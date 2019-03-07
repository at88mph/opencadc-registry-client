opencadc-registry-client (1.2.0)
================================

Registry client for CADC and CANFAR services.

Download
--------

::

    <script type='application/javascript' src='registry-client.js'></script>

API
---

::

    var registryClient = new Registry()

    // Or a custom capabilities endpiont
    var registryClient = new Registry({resourceCapabilitiesEndPoint:'http://www.mysite.com/reg/resources'})

Methods
~~~~~~~

+------------+---------------+
| Function   | Description   |
+============+===============+
+------------+---------------+

\|
``getServiceURL(resourceURI, standardURI, interfaceURI, authType, preferInsecure)``
\|

.. raw:: html

   <p>

.. raw:: html

   <h4>

Obtain a service URL endpoint for the given resource and standard IDs.

.. raw:: html

   </h4>

.. raw:: html

   </p>

.. raw:: html

   <p>

``{String} resourceURI The Resource URI to lookup.``

.. raw:: html

   </p>

.. raw:: html

   <p>

``{String} standardURI The Standard ID URI to lookup.``

.. raw:: html

   </p>

.. raw:: html

   <p>

``{String} interfaceURI The URI of the interface type to pull down.``

.. raw:: html

   </p>

.. raw:: html

   <p>

``{String} secureFlag What type of auth to look up ('basic', 'cookie', 'tls').  The 'tls' value will require a client certificate.  Optional, defaults to null.``

.. raw:: html

   </p>

.. raw:: html

   <p>

``{Boolean} preferInsecure Prefer plain HTTP URLs if true.  Default is null (or false) to return HTTPS URLs.``

.. raw:: html

   </p>

.. raw:: html

   <p>

``@returns {Promise}``

.. raw:: html

   </p>

\| \| ``getCapabilityURL(uri)`` \|

.. raw:: html

   <p>

.. raw:: html

   <h4>

Obtain the capabilities URL for the given URI.

.. raw:: html

   </h4>

.. raw:: html

   </p>

.. raw:: html

   <p>

``{String} uri The URI to look up.``

.. raw:: html

   </p>

.. raw:: html

   <p>

``@returns {Promise}``

.. raw:: html

   </p>

::

                                                                                                                                                                                                                                                                                |

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
