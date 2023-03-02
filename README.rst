opencadc-registry-client (1.2.2)
================================

Registry client for CADC and CANFAR services.

Download
--------

::

    <script type='application/javascript' src='registry-client.js'></script>

Optimized
~~~~~~~~~

You may optionally build a webpack (minified) version for a 3.6KB file:
::
    npm install
    npm run dist

This will produce a ``dist/registry-client.min.js`` file.

API
---

::

    var registryClient = new Registry()

    // Or a custom registry location
    var registryClient = new Registry({baseURL:'http://www.mysite.com'})

Methods
~~~~~~~


=========================================================================================     =========================   ===========================
Function                                                                                      Argument                    Description
=========================================================================================     =========================   ===========================
``@return {Promise}`` **getServiceURL(resourceURI, standardURI, interfaceURI, authType)**     ``{String}`` resourceURI    The Resource URI to lookup.

                                                                                              ``{String}`` standardURI    The Standard ID to lookup.

                                                                                              ``{String}`` interfaceURI   The The URI of the interface type to pull down.
                                                                                 
                                                                                              ``{String}`` authType       What type of auth to look up ('basic', 'cookie', 'tls').  The 'tls' value will require a client certificate.  Optional, defaults to ``null``.

``@returns {Promise}`` **getCapabilityURL(uri)**                                              ``{String}`` uri            The URI to look up.

``@return {Promise}`` **getApplicationURL(resourceURI)**                                        ``{String}`` resourceURI    The Resource URI to lookup.

``@return {Promise}`` **getApplicationEndpoints()**                                             ````    none                none
=========================================================================================     =========================   ===========================


=========================================================================================     =========================   ===========================
Function                                                                                      Argument                    Description
=========================================================================================     =========================   ===========================
``@return {Promise}`` **getServiceURL(resourceURI, standardURI, interfaceURI, authType)**     ``{String}`` resourceURI    The Resource URI to lookup.

                                                                                              ``{String}`` standardURI    The Standard ID to lookup.

                                                                                              ``{String}`` interfaceURI   The The URI of the interface type to pull down.
                                                                                 
                                                                                              ``{String}`` authType       What type of auth to look up ('basic', 'cookie', 'tls').  The 'tls' value will require a client certificate.  Optional, defaults to ``null``.

``@returns {Promise}`` **getCapabilityURL(uri)**                                              ``{String}`` uri            The URI to look up.
``@returns {Promise}`` **getApplicationURL(uri)**                                              ``{String}`` uri            The URI to look up.
=========================================================================================     =========================   ===========================




Obtaining a Service URL
~~~~~~~~~~~~~~~~~~~~~~~

::

    var registryClient = new Registry()

    // Look up the TAP service with cookie authentication.
    registryClient.getServiceURL(
            'ivo://cadc.nrc.ca/tap',
            'ivo://ivoa.net/std/TAP',
            'uws:Sync',
            'cookie'
          )
          .then(function(serviceURL) {
            // Hit the serviceURL
          }).catch(function(err) {
            console.error('Error obtaining Service URL > ' + err)
          })

::

    var registryClient = new Registry()

    // Look up the TAP service with TLS authentication (HTTPS).
    registryClient.getServiceURL(
            'ivo://cadc.nrc.ca/tap',
            'ivo://ivoa.net/std/TAP',
            'uws:Sync',
            'tls'
          )
          .then(function(serviceURL) {
            // Hit the serviceURL
          }).catch(function(err) {
            console.error('Error obtaining Service URL > ' + err)
          })

::

    var registryClient = new Registry()

    // Look up the TAP service with Basic authentication (auth-sync endpoint).
    registryClient.getServiceURL(
            'ivo://cadc.nrc.ca/tap',
            'ivo://ivoa.net/std/TAP',
            'uws:Sync',
            'basic'
          )
          .then(function(serviceURL) {
            // Hit the serviceURL
          }).catch(function(err) {
            console.error('Error obtaining Service URL > ' + err)
          })

Obtaining an insecure Service URL
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

This is only useful (and recommended) for Service URLs that may gain
some performance by calling an HTTP URL rather than suffer the potential
latency of HTTPS, such as data uploads and downloads.

::

    var registryClient = new Registry()

    // Look up the TAP service with Basic authentication (auth-sync endpoint).
    registryClient.getServiceURL(
            'ivo://cadc.nrc.ca/tap',
            'ivo://ivoa.net/std/TAP',
            'uws:Sync',
            'basic',
            true // Prefer insecure.
          )
          .then(function(serviceURL) {
            // Hit the serviceURL
          }).catch(function(err) {
            console.error('Error obtaining Service URL > ' + err)
          })

Obtaining a Capability URL
~~~~~~~~~~~~~~~~~~~~~~~~~~

Note that capability documents can vary.  As of version 1.2.0, the library supports
both the multiple ``<interface />`` style each with its own ``<accessURL />`` and ``<securityMethod />``,
as well as the newer TAP 1.1 version that will produce a single ``<interface />`` with multiple ``<securityMethod />`` tags.
::

    var registryClient = new Registry()

    // Look up the TAP service capabilities.
    registryClient.getCapabilityURL(
            'ivo://cadc.nrc.ca/tap'
          )
          .then(function(capabilityURL) {
            // Hit the capabilityURL and see the XML
          }).catch(function(err) {
            console.error('Error obtaining Capability URL > ' + err)
          })

Obtaining an Application URL
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Note that capability documents can vary.  As of version 1.2.0, the library supports
both the multiple ``<interface />`` style each with its own ``<accessURL />`` and ``<securityMethod />``,
as well as the newer TAP 1.1 version that will produce a single ``<interface />`` with multiple ``<securityMethod />`` tags.
::

    var registryClient = new Registry()

    // Look up the TAP service capabilities.
    registryClient.getApplicationURL(
            'ivo://cadc.nrc.ca/gms'
          )
          .then(function(capabilityURL) {
            // Hit the capabilityURL and see the XML
          }).catch(function(err) {
            console.error('Error obtaining Capability URL > ' + err)
          })
