this.Registry = (function (Promise, XMLHttpRequest, DOMParser, undefined) {
  'use strict'

  if (!String.prototype.trim) {;
    (function () {
      // Make sure we trim BOM and NBSP
      var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
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
    var defaultOptions = {
      resourceCapabilitiesEndPoint: 'https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/reg/resource-caps'
    }

    var options = opts || {}

    this.AUTH_TYPES = {
      'basic': 'ivo://ivoa.net/sso#BasicAA',
      'cookie': 'ivo://ivoa.net/sso#cookie',
      'tls': 'ivo://ivoa.net/sso#tls-with-certificate'
    }

    this.LINE_CHECKER = /^[\w]+.*$/
    this.resourceCapabilitiesURL =
      options.resourceCapabilitiesEndPoint ||
      defaultOptions.resourceCapabilitiesEndPoint
  }

  Registry.prototype.getResourceCapabilities = function (serviceCapabilityURL) {
    return this._get(serviceCapabilityURL, 'text/xml')
  }

  /**
   * Obtain a service URL endpoint for the given resource and standard IDs
   *
   * @param {String} resourceURI   The Resource URI to lookup.
   * @param {String} standardURI  The Standard ID URI to lookup.
   * @param {String} interfaceURI The URI of the interface type to pull down.
   * @param {String} authType  What type of auth to look up ('basic', 'cookie', 'tls').  Optional, defaults to null.
   * @param {String} preferInsecure  Prefer plain HTTP URLs if True.  Default is null (or false) to return HTTPS URLs.
   * @returns {Promise}
   */
  Registry.prototype.getServiceURL = function (
    resourceURI,
    standardURI,
    interfaceURI,
    authType,
    preferInsecure
  ) {
    var self = this
    return new Promise(function (resolve, reject) {
      self
        .getCapabilityURL(resourceURI)
        .then(function (serviceCapabilityURL) {
          self
            .getResourceCapabilities(serviceCapabilityURL)
            .then(function (request) {
              var doc =
                request.responseXML ||
                new DOMParser().parseFromString(request.responseText)
              var capabilityFields = doc.documentElement.getElementsByTagName('capability')

              for (var i = 0, cfl = capabilityFields.length; i < cfl; i++) {
                var next = capabilityFields[i]

                if (next.getAttribute('standardID') === standardURI) {
                  var interfaces = next.getElementsByTagName('interface')
                  var matchingServiceURLs = []

                  for (var j = 0, il = interfaces.length; j < il; j++) {
                    var nextInterface = interfaces[j]
                    var securityMethods = nextInterface.getElementsByTagName('securityMethod')
                    if (
                      ((!authType && securityMethods.length === 0) ||
                        (authType &&
                          securityMethods.length > 0 &&
                          securityMethods[0].getAttribute('standardID') === self.AUTH_TYPES[authType.toLowerCase()])) &&
                      nextInterface.getAttribute('xsi:type') === interfaceURI
                    ) {
                      // Actual URL value.
                      var accessURLElements = nextInterface.getElementsByTagName('accessURL')
                      var serviceURL =
                        accessURLElements.length > 0 ?
                        accessURLElements[0].childNodes[0].nodeValue :
                        null

                      if (serviceURL) {
                        matchingServiceURLs.push(serviceURL)
                      }
                    }
                  }
                }
              }

              if (matchingServiceURLs.length === 0) {
                reject(new Error('No service URL found'))
              } else {
                var preferredServiceURLs = []
                for (var msi = 0, msl = matchingServiceURLs.length; msi < msl; msi++) {
                  var nextURL = matchingServiceURLs[msi]
                  if ((preferInsecure === true && nextURL.indexOf('http://') === 0) ||
                    (nextURL.indexOf('https://') === 0)) {
                    preferredServiceURLs.splice(0, 0, nextURL)
                  } else {
                    console.warn('Warning: Insecure URL found (' + nextURL + ').  Possible downgrade.')
                    preferredServiceURLs.push(nextURL)
                  }
                }
                if (preferredServiceURLs.length === 0) {
                  resolve(matchingServiceURLs[0])
                } else {
                  resolve(preferredServiceURLs[0])
                }
              }
            })
            .catch(function (err) {
              console.error('Error obtaining Service URL > ' + (err.error ? err.error : err))
            })
        })
        .catch(function (err) {
          console.error('Error obtaining Capability URL > ' + (err.error ? err.error : err))
        })
    })
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
   * Obtain the capabilities URL for the given URI.
   *
   * @param {String} uri   The URI to look up.
   * @returns {Promise}
   */
  Registry.prototype.getCapabilityURL = function (uri) {
    var self = this
    return new Promise(function (resolve, reject) {
      self
        .getResourceCapabilitiesEndpoints()
        .then(function (request) {
          var capabilityURL
          var asciiOutput = request.responseText
          var asciiLines = asciiOutput.split('\n')
          for (var i = 0, all = asciiLines.length; i < all; i++) {
            var nextLine = asciiLines[i]
            if (self.LINE_CHECKER.test(nextLine)) {
              var keyValue = nextLine.split('=')
              var key = keyValue[0].trim()
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
          console.error('Error obtaining capability URL > ' + (err.error ? err.error : err))
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
      var request = new XMLHttpRequest()
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
