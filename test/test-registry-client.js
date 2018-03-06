'use strict'

global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
global.DOMParser = require('xmldom').DOMParser
var assert = require('assert')
var Registry = require('../registry-client')

describe('Registry tests', function() {
  var reg = new Registry()

  it('Capabilities lookup from CADC', function(done) {
    reg.getCapabilityURL('ivo://cadc.nrc.ca/tap').then(function(capabilityURL) {
      done(
        capabilityURL ===
        'http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/tap/capabilities'
          ? undefined
          : `Wrong output ${capabilityURL}`
      )
    })
  })

  it('HTTP service URL lookup', function(done) {
    reg
      .getServiceURL(
        'ivo://cadc.nrc.ca/tap',
        'ivo://ivoa.net/std/TAP',
        'uws:Sync',
        false
      )
      .then(function(serviceURL) {
        done(
          'http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/tap/sync' !== serviceURL
            ? `Wrong Service URL returned >> (${serviceURL})`
            : undefined
        )
      }).catch(function (error) {
        done(error)
      })
  })

  // it('HTTPS service URL lookup', function(done) {
  //   reg
  //     .serviceURL('ivo://cadc.nrc.ca/tap', 'ivo://ivoa.net/std/TAP', 'uws:Sync', true)
  //     .then(function(serviceURL) {
  //       if ('https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/tap' !== serviceURL) {
  //         done(`Wrong secure service URL returned >> (${serviceURL})`)
  //       } else {
  //         done()
  //       }
  //     })
  // })
})
