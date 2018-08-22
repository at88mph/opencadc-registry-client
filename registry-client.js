this.Registry = (function(Promise, XMLHttpRequest, DOMParser, undefined) {
  'use strict'

  if (!String.prototype.trim) {
    ;(function() {
      // Make sure we trim BOM and NBSP
      var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
      String.prototype.trim = function() {
        return this.replace(rtrim, '')
      }
    })()
  }

  /**
   * Registry client constructor.
   *
   * @param {{}} opts   Options to pass in.
   *        {opts.resourceCapabilitiesEndPoint='http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/reg/resource-caps'}
   * @constructor
   */
  function Registry(opts) {
    var defaultOptions = {
      resourceCapabilitiesEndPoint:
        'http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/reg/resource-caps'
    }

    var options = opts || {}

    this.LINE_CHECKER = /^[\w]+.*$/
    this.resourceCapabilitiesURL =
      options.resourceCapabilitiesEndPoint ||
      defaultOptions.resourceCapabilitiesEndPoint
  }

  /**
   * Obtain a service URL endpoint for the given resource and standard IDs
   *
   * @param {String} resourceURI   The Resource URI to lookup.
   * @param {String} standardURI  The Standard ID URI to lookup.
   * @param {String} interfaceURI The URI of the interface type to pull down.
   * @param {boolean} secureFlag  Whether to look for HTTPS access URLs.  Requires client certificate.
   * @returns {Promise}
   */
  Registry.prototype.getServiceURL = function(
    resourceURI,
    standardURI,
    interfaceURI,
    secureFlag
  ) {
    var self = this
    return new Promise(function(resolve, reject) {
      self
        .getCapabilityURL(resourceURI)
        .then(function(serviceCapabilityURL) {
          self
            ._get(serviceCapabilityURL, 'text/xml')
            .then(function(request) {
              var serviceURL
              var doc =
                request.responseXML ||
                new DOMParser().parseFromString(request.responseText)

              var capabilityFields = doc.documentElement.getElementsByTagName(
                'capability'
              )

              for (var i = 0, cfl = capabilityFields.length; i < cfl; i++) {
                var next = capabilityFields[i]

                if (next.getAttribute('standardID') === standardURI) {
                  var interfaces = next.getElementsByTagName('interface')

                  for (var j = 0, il = interfaces.length; j < il; j++) {
                    var nextInterface = interfaces[j]
                    var securityMethods = nextInterface.getElementsByTagName(
                      'securityMethod'
                    )
                    if (
                      ((secureFlag === false && securityMethods.length === 0) ||
                        (secureFlag === true &&
                          securityMethods.length > 0 &&
                          securityMethods[0].getAttribute('standardID') ===
                            'ivo://ivoa.net/sso#tls-with-certificate')) &&
                      nextInterface.getAttribute('xsi:type') === interfaceURI
                    ) {
                      // Actual URL value.
                      var accessURLElements = nextInterface.getElementsByTagName(
                        'accessURL'
                      )
                      serviceURL =
                        accessURLElements.length > 0
                          ? accessURLElements[0].childNodes[0].nodeValue
                          : null
                      break
                    }
                  }
                }
              }

              if (!serviceURL) {
                reject(new Error('No service URL found'))
              } else {
                resolve(serviceURL)
              }
            })
            .catch(function(err) {
              console.error('Error obtaining Service URL > ' + err)
            })
        })
        .catch(function(err) {
          console.error('Error obtaining Capability URL > ' + err)
        })
    })
  }

  /**
   * Obtain the capabilities URL for the given URI.
   *
   * @param {String} uri   The URI to look up.
   * @returns {Promise}
   */
  Registry.prototype.getCapabilityURL = function(uri) {
    var self = this
    return new Promise(function(resolve, reject) {
      self
        ._get(self.resourceCapabilitiesURL, 'text/plain')
        .then(function(request) {
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
            reject({ uri: uri, error: new Error('No such URI ' + uri) })
          } else {
            resolve(capabilityURL)
          }
        })
        .catch(function(err) {
          console.error('Error obtaining capability URL > ' + err)
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
  Registry.prototype._get = function(url, contentType) {
    return new Promise(function(resolve, reject) {
      var request = new XMLHttpRequest()
      request.addEventListener(
        'load',
        function() {
          resolve(request)
        },
        false
      )

      request.addEventListener(
        'error',
        function() {
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
