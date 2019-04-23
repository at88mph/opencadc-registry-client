this.Registry = (function (Promise, XMLHttpRequest, DOMParser, undefined) {
  'use strict'

  if (!String.prototype.trim) {
    ;
    (function () {
      // Make sure we trim BOM and NBSP
      const rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
      String.prototype.trim = function () {
        return this.replace(rtrim, '')
      }
    })()
  }

  /**
   * Registry client constructor.
   *
   * @param {{}} opts   Options to pass in.
   *        {opts.resourceCapabilitiesEndPoint='https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/reg/resource-caps'}
   * @constructor
   */
  function Registry(opts) {
    const defaultOptions = {
      resourceCapabilitiesEndPoint: 'https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/reg/resource-caps'
    }

    const options = opts || {}

    this.resourceCapabilitiesURL =
      options.resourceCapabilitiesEndPoint ||
      defaultOptions.resourceCapabilitiesEndPoint

    // As of s2419, April 2019, the options passed in to the
    // registry are ignored in favour of pointing to a local /reg endpoint.
    // Access to wheree the service actually is deployed is controlled via Apache rules.
    // TODO: as applications using the registry are altered, remove the 'opts'
    // entries until this code can be realistically depricated.
    this.baseURL = window.location.origin
    this.resourceCapabilitiesURL = this.baseURL + '/reg/resource-caps'
    this.regApplicationsURL = this.baseURL + '/reg/applications'
  }

  Registry.HTTP_INTERFACE_TYPE = 'vs:ParamHTTP'

  Registry.LINE_CHECKER = /^[\w]+.*$/

  Registry.AUTH_TYPES = {
    basic: 'ivo://ivoa.net/sso#BasicAA',
    cookie: 'ivo://ivoa.net/sso#cookie',
    tls: 'ivo://ivoa.net/sso#tls-with-certificate'
  }

  Registry.prototype.getResourceCapabilities = function (serviceCapabilityURL) {
    return this._get(serviceCapabilityURL, 'text/xml')
  }

  /**
   * Obtain a service URL endpoint for the given resource and standard IDs
   *
   * @param {String} resourceURI   The Resource URI to lookup.
   * @param {String} standardURI  The Standard ID URI to lookup.
   * @param {String} interfaceURI The URI of the interface type to pull down.  Defaults to vs:ParamHTTP.
   * @param {String} authType  What type of auth to look up ('basic', 'cookie', 'tls').  Optional, defaults to
   *                          null (Anonymous).
   * @returns {Promise}
   */
  Registry.prototype.getServiceURL = function (
    resourceURI,
    standardURI,
    interfaceURI,
    authType
  ) {
    const self = this
    const _interfaceURI = interfaceURI ?
      interfaceURI :
      Registry.HTTP_INTERFACE_TYPE
    return new Promise(function (resolve, reject) {
      self
        .getCapabilityURL(resourceURI)
        .then(function (serviceCapabilityURL) {
          self
            .getResourceCapabilities(serviceCapabilityURL)
            .then(function (request) {
              const doc =
                request.responseXML ||
                new DOMParser().parseFromString(request.responseText)
              const capabilityFields = doc.documentElement.getElementsByTagName(
                'capability'
              )

              for (let i = 0, cfl = capabilityFields.length; i < cfl; i++) {
                const next = capabilityFields[i]

                if (next.getAttribute('standardID') === standardURI) {
                  const interfaces = next.getElementsByTagName('interface')

                  for (let j = 0, il = interfaces.length; j < il; j++) {
                    const nextInterface = interfaces[j]
                    if (
                      nextInterface.getAttribute('xsi:type') === _interfaceURI
                    ) {
                      if (
                        self._interfaceSupportsAuthType(authType, nextInterface) === true
                      ) {
                        // Actual URL value.
                        const accessURLElements = nextInterface.getElementsByTagName(
                          'accessURL'
                        )
                        const serviceURL =
                          accessURLElements.length > 0 ?
                          accessURLElements[0].childNodes[0].nodeValue :
                          null

                        if (serviceURL) {
                          resolve(serviceURL)
                        }
                      }
                    }
                  }
                }
              }

              reject(new Error(`No service URL found for \nResource: ${resourceURI}\nStandard: ${standardURI}\nInterface: ${_interfaceURI}\nAuthType: ${authType}`))
            })
            .catch(function (err) {
              console.error(
                'Error obtaining Service URL > ' + (err.error ? err.error : err)
              )
            })
        })
        .catch(function (err) {
          console.error(
            'Error obtaining Capability URL > ' + (err.error ? err.error : err)
          )
        })
    })
  }

  Registry.prototype._interfaceSupportsAuthType = function (
    authType,
    interfaceElement
  ) {
    const securityMethods = interfaceElement.getElementsByTagName(
      'securityMethod'
    )
    if (!authType && securityMethods.length === 0) {
      return true
    } else if (securityMethods.length > 0) {
      for (let smi = 0, sml = securityMethods.length; smi < sml; smi++) {
        const nextSecurityMethod = securityMethods[smi]
        const nextSecurityMethodStandard = nextSecurityMethod.getAttribute('standardID')

        if ((!nextSecurityMethodStandard && !authType) ||
          (authType && nextSecurityMethodStandard === Registry.AUTH_TYPES[authType.toLowerCase()])) {
          return true
        }
      }
    } else {
      return false
    }
  }

  /**
   * Obtain the Resource endpoints (key = value pairs).
   *
   * @returns {Promise}
   */
  Registry.prototype.getResourceCapabilitiesEndpoints = function () {
    return this._get(this.resourceCapabilitiesURL, 'text/plain')
  }

  /**
   * Obtain the Applications endpoints (key = value pairs).
   *
   * @returns {Promise}
   */
  Registry.prototype.getApplicationsEndpoints = function () {
    return this._get(this.regApplicationsURL, 'text/plain')
  }


  /**
   * Obtain the capabilities URL for the given URI.
   *
   * @param {String} uri   The URI to look up.
   * @returns {Promise}
   */
  Registry.prototype.getCapabilityURL = function (uri) {
    const self = this
    return new Promise(function (resolve, reject) {
      self
        .getResourceCapabilitiesEndpoints()
        .then(function (request) {
          let capabilityURL
          const asciiOutput = request.responseText
          const asciiLines = asciiOutput.split('\n')
          for (let i = 0, all = asciiLines.length; i < all; i++) {
            const nextLine = asciiLines[i]
            if (Registry.LINE_CHECKER.test(nextLine)) {
              const keyValue = nextLine.split('=')
              const key = keyValue[0].trim()
              if (key === uri) {
                capabilityURL = keyValue[1].trim()
                break
              }
            }
          }

          if (!capabilityURL) {
            reject({
              uri: uri,
              error: new Error('No such URI ' + uri)
            })
          } else {
            resolve(capabilityURL)
          }
        })
        .catch(function (err) {
          console.error(
            'Error obtaining capability URL > ' + (err.error ? err.error : err)
          )
        })
    })
  }

  /**
   * Obtain the applications URL for the given URI.
   *
   * @param {String} uri   The URI to look up.
   * @returns {Promise}
   */
  Registry.prototype.getApplicationURL = function (uri) {
    const self = this
    return new Promise(function (resolve, reject) {
      self
          .getApplicationsEndpoints()
          .then(function (request) {
            let applicationURL
            const asciiOutput = request.responseText
            const asciiLines = asciiOutput.split('\n')
            for (let i = 0, all = asciiLines.length; i < all; i++) {
              const nextLine = asciiLines[i]
              if (Registry.LINE_CHECKER.test(nextLine)) {
                const keyValue = nextLine.split('=')
                const key = keyValue[0].trim()
                if (key === uri) {
                  applicationURL = keyValue[1].trim()
                  break
                }
              }
            }

            if (!applicationURL) {
              reject({
                uri: uri,
                error: new Error('No such URI ' + uri)
              })
            } else {
              resolve(applicationURL)
            }
          })
          .catch(function (err) {
            console.error(
                'Error obtaining application URL > ' + (err.error ? err.error : err)
            )
          })
    })
  }

  /**
   * Create a new request for outbout HTTP(S) calls.
   *
   * @param {String}  url   URL to GET.
   * @param {String} contentType  The Content type to request.
   * @return {Promise}  Promise creating the XMLHttpRequest.
   * @private
   */
  Registry.prototype._get = function (url, contentType) {
    return new Promise(function (resolve, reject) {
      const request = new XMLHttpRequest()
      request.addEventListener(
        'load',
        function () {
          resolve(request)
        },
        false
      )

      request.addEventListener(
        'error',
        function () {
          reject(request.responseText)
        },
        false
      )

      request.withCredentials = true
      request.open('GET', url)
      request.setRequestHeader('Content-Type', contentType)
      request.send(null)
    })
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Registry
  }

  return Registry
})(Promise, XMLHttpRequest, DOMParser)
