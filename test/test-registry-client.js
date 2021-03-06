'use strict'

global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
global.DOMParser = require('xmldom').DOMParser
var Registry = require('../registry-client')

var testData = {}
testData['https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/tap/1_1/capabilities/'] =
  '<?xml version="1.0" encoding="UTF-8"?>' +
  '<vosi:capabilities xmlns:vosi="http://www.ivoa.net/xml/VOSICapabilities/v1.0" xmlns:uws="http://www.ivoa.net/xml/UWSRegExt/v0.1" xmlns:vs="http://www.ivoa.net/xml/VODataService/v1.1" ' +
  'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
  '<capability xmlns:tr="http://www.ivoa.net/xml/TAPRegExt/v1.0" standardID="ivo://ivoa.net/std/TAP_11" xsi:type="tr:TableAccess">' +
  '<interface xsi:type="vs:ParamHTTP" role="std" version="1.1">' +
  '<accessURL use="base">https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/tap/1_1</accessURL>' +
  '<securityMethod standardID="ivo://ivoa.net/sso#cookie" />' +
  '<securityMethod standardID="ivo://ivoa.net/sso#cert" />' +
  '<securityMethod />' +
  '</interface></capability></vosi:capabilities>'

testData['https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/alt-tap/1_1/capabilities/'] =
  '<?xml version="1.0" encoding="UTF-8"?>' +
  '<vosi:capabilities xmlns:vosi="http://www.ivoa.net/xml/VOSICapabilities/v1.0" xmlns:uws="http://www.ivoa.net/xml/UWSRegExt/v0.1" xmlns:vs="http://www.ivoa.net/xml/VODataService/v1.1" ' +
  'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
  '<capability xmlns:tr="http://www.ivoa.net/xml/TAPRegExt/v1.0" standardID="ivo://ivoa.net/std/TAP_11" xsi:type="tr:TableAccess">' +
  '<interface xsi:type="vs:ParamHTTP" role="std" version="1.1">' +
  '<accessURL use="base">https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/alt-tap/1_1</accessURL>' +
  '</interface></capability></vosi:capabilities>'

testData[
    'https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/service/1/capabilities/'
  ] =
  '<?xml version="1.0" encoding="UTF-8"?>' +
  '<vosi:capabilities xmlns:vosi="http://www.ivoa.net/xml/VOSICapabilities/v1.0" xmlns:uws="http://www.ivoa.net/xml/UWSRegExt/v0.1" xmlns:vs="http://www.ivoa.net/xml/VODataService/v1.1" ' +
  'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
  '<capability xmlns:tr="http://www.ivoa.net/xml/TAPRegExt/v1.0" standardID="ivo://ivoa.net/std/SRV1" xsi:type="tr:TableAccess">' +
  '<interface xsi:type="vs:ParamHTTP" role="std" version="1.1">' +
  '<accessURL use="base">https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/service/1/</accessURL>' +
  '</interface>' +
  '<interface xsi:type="uws:Async" role="std" version="1.1">' +
  '<accessURL use="base">https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/service/1/async</accessURL>' +
  '</interface>' +
  '<interface xsi:type="uws:Sync" role="std" version="1.1">' +
  '<accessURL use="base">https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/service/1/auth</accessURL>' +
  '<securityMethod standardID="ivo://ivoa.net/sso#BasicAA" />' +
  '</interface></capability></vosi:capabilities>'

testData['https://www.canfar.phys.uvic.ca/service/2/capabilities/'] =
  '<?xml version="1.0" encoding="UTF-8"?>' +
  '<vosi:capabilities xmlns:vosi="http://www.ivoa.net/xml/VOSICapabilities/v1.0" xmlns:uws="http://www.ivoa.net/xml/UWSRegExt/v0.1" xmlns:vs="http://www.ivoa.net/xml/VODataService/v1.1" ' +
  'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
  '<capability xmlns:tr="http://www.ivoa.net/xml/TAPRegExt/v1.0" standardID="ivo://ivoa.net/std/SRV2" xsi:type="tr:TableAccess">' +
  '<interface xsi:type="vs:ParamHTTP" role="std" version="1.1">' +
  '<accessURL use="base">https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/service/2/</accessURL>' +
  '</interface>' +
  '<interface xsi:type="uws:Sync" role="std" version="1.1">' +
  '<accessURL use="base">https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/service/2/sync</accessURL>' +
  '</interface>' +
  '<interface xsi:type="uws:Sync" role="std" version="1.1">' +
  '<accessURL use="base">https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/service/2/sync</accessURL>' +
  '<securityMethod standardID="ivo://ivoa.net/sso#cookie" />' +
  '</interface>' +
  '<interface xsi:type="uws:Sync" role="std" version="1.1">' +
  '<accessURL use="base">https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/service/2/auth</accessURL>' +
  '<securityMethod standardID="ivo://ivoa.net/sso#BasicAA" />' +
  '</interface>' +
  '</capability></vosi:capabilities> '

testData['https://www.canfar.net/service/beta/capabilities/'] =
  '<?xml version="1.0" encoding="UTF-8"?>' +
  '<vosi:capabilities xmlns:vosi="http://www.ivoa.net/xml/VOSICapabilities/v1.0" xmlns:uws="http://www.ivoa.net/xml/UWSRegExt/v0.1" xmlns:vs="http://www.ivoa.net/xml/VODataService/v1.1" ' +
  'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
  '<capability xmlns:tr="http://www.ivoa.net/xml/TAPRegExt/v1.0" standardID="ivo://ivoa.net/std/SRVBETA" xsi:type="tr:TableAccess">' +
  '<interface xsi:type="vs:ParamHTTP" role="std" version="1.1">' +
  '<accessURL use="base">https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/service/beta/</accessURL>' +
  '</interface>' +
  '<interface xsi:type="uws:Sync" role="std" version="1.1">' +
  '<accessURL use="base">https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/service/beta/alt/sync</accessURL>' +
  '<securityMethod standardID="ivo://ivoa.net/sso#cookie" />' +
  '</interface>' +
  '<interface xsi:type="uws:Sync" role="std" version="1.1">' +
  '<accessURL use="base">https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/service/beta/sync</accessURL>' +
  '<securityMethod standardID="ivo://ivoa.net/sso#cookie" />' +
  '</interface>' +
  '<interface xsi:type="uws:Sync" role="std" version="1.1">' +
  '<accessURL use="base">https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/service/beta/sync</accessURL>' +
  '<securityMethod standardID="ivo://ivoa.net/sso#tls-with-certificate" />' +
  '</interface>' +
  '</capability></vosi:capabilities>'

// Override inputs that would normally come from the network.
//
//
Registry.prototype.getResourceCapabilitiesEndpoints = function () {
  return new Promise(function (resolve) {
    var requestObj = {}
    requestObj.responseText =
      'ivo://cadc.nrc.ca/service_one = https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/service/1/capabilities/\n' +
      'ivo://cadc.nrc.ca/service_two = https://www.canfar.phys.uvic.ca/service/2/capabilities/\n' +
      'ivo://cadc.nrc.ca/service_three = https://www.canfar.net/service/beta/capabilities/\n' +
      'ivo://cadc.nrc.ca/service_tap_1_1 = https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/tap/1_1/capabilities/\n' +
      'ivo://cadc.nrc.ca/service_alt-tap_1_1 = https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/alt-tap/1_1/capabilities/\n'

    resolve(requestObj)
  })
}

Registry.prototype.getResourceCapabilities = function (serviceCapabilityURL) {
  return new Promise(function (resolve) {
    var requestObj = {}
    requestObj.responseText = testData[serviceCapabilityURL]

    resolve(requestObj)
  })
}
//
//
// End overrides

describe('Registry tests', function () {
  var reg = new Registry()

  it('Capabilities lookup from CADC', function (done) {
    reg
      .getCapabilityURL('ivo://cadc.nrc.ca/service_one')
      .then(function (capabilityURL) {
        done(
          capabilityURL ===
          'https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/service/1/capabilities/' ?
          undefined :
          `Wrong output ${capabilityURL}`
        )
      })
  })

  it('HTTP service URL lookup', function (done) {
    reg
      .getServiceURL(
        'ivo://cadc.nrc.ca/service_two',
        'ivo://ivoa.net/std/SRV2',
        'uws:Sync',
        null
      )
      .then(function (serviceURL) {
        done(
          'https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/service/2/sync' !==
          serviceURL ?
          `Wrong Service URL returned >> (${serviceURL})` :
          undefined
        )
      })
      .catch(function (error) {
        done(error)
      })
  })

  it('HTTP service basic auth URL lookup', function (done) {
    reg = new Registry()
    reg
      .getServiceURL(
        'ivo://cadc.nrc.ca/service_one',
        'ivo://ivoa.net/std/SRV1',
        'uws:Sync',
        'basic'
      )
      .then(function (serviceURL) {
        done(
          'https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/service/1/auth' !==
          serviceURL ?
          `Wrong Service URL returned >> (${serviceURL})` :
          undefined
        )
      })
      .catch(function (error) {
        done(error)
      })
  })

  it('HTTP service cookie URL lookup', function (done) {
    reg = new Registry()
    reg
      .getServiceURL(
        'ivo://cadc.nrc.ca/service_two',
        'ivo://ivoa.net/std/SRV2',
        'uws:Sync',
        'cookie'
      )
      .then(function (serviceURL) {
        done(
          'https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/service/2/sync' !==
          serviceURL ?
          `Wrong Service URL returned >> (${serviceURL})` :
          undefined
        )
      })
      .catch(function (error) {
        done(error)
      })
  })

  it('HTTP service TLS URL lookup', function (done) {
    reg = new Registry()
    reg
      .getServiceURL(
        'ivo://cadc.nrc.ca/service_three',
        'ivo://ivoa.net/std/SRVBETA',
        'uws:Sync',
        'tls'
      )
      .then(function (serviceURL) {
        done(
          'https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/service/beta/sync' !==
          serviceURL ?
          `Wrong Service URL returned >> (${serviceURL})` :
          undefined
        )
      })
      .catch(function (error) {
        done(error)
      })
  })

  it('HTTPS service Cookie URL lookup', function (done) {
    reg = new Registry()
    reg
      .getServiceURL(
        'ivo://cadc.nrc.ca/service_three',
        'ivo://ivoa.net/std/SRVBETA',
        'uws:Sync',
        'cookie'
      )
      .then(function (serviceURL) {
        done(
          'https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/service/beta/alt/sync' !==
          serviceURL ?
          `Wrong Service URL returned >> (${serviceURL})` :
          undefined
        )
      })
      .catch(function (error) {
        done(error)
      })
  })

  it('TAP 1.1 capabilities.', function (done) {
    reg = new Registry()
    reg
      .getServiceURL(
        'ivo://cadc.nrc.ca/service_tap_1_1',
        'ivo://ivoa.net/std/TAP_11',
        null,
        'cookie'
      )
      .then(function (serviceURL) {
        done(
          'https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/tap/1_1' !==
          serviceURL ?
          `Wrong Service URL returned >> (${serviceURL})` :
          undefined
        )
      })
      .catch(function (error) {
        done(error)
      })
  })

  it('TAP 1.1 capabilities (anon with no security methods).', function (done) {
    reg = new Registry()
    reg
      .getServiceURL(
        'ivo://cadc.nrc.ca/service_alt-tap_1_1',
        'ivo://ivoa.net/std/TAP_11',
        null,
        null
      )
      .then(function (serviceURL) {
        done(
          'https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/alt-tap/1_1' !==
          serviceURL ?
          `Wrong Service URL returned >> (${serviceURL})` :
          undefined
        )
      })
      .catch(function (error) {
        done(error)
      })
  })

  it('TAP 1.1 capabilities (auth with no security methods).', function (done) {
    reg = new Registry()
    reg
      .getServiceURL(
        'ivo://cadc.nrc.ca/service_alt-tap_1_1',
        'ivo://ivoa.net/std/TAP_11',
        null,
        'cert'
      )
      .then(function (serviceURL) {
        done(new Error(`Should not have found ${serviceURL}.`))
      })
      .catch(function (error) {
        done(error.message.indexOf('No service URL found for') !== 0 ? `Wrong error message > ${error}` : undefined)
      })
  })
})
