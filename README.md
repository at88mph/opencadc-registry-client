# opencadc-registry-client

Registry client for CADC and CANFAR services.

## Download

```
<script type='application/javascript' src='registry-client.js'></script>
```

## API

```
var registryClient = new Registry()

// Or a custom capabilities endpiont
var registryClient = new Registry({resourceCapabilitiesEndPoint:'http://www.mysite.com/reg/resources'})
```

### Methods

| Function                                                            | Description                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getServiceURL(resourceURI, standardURI, interfaceURI, secureFlag)` | <p><h4>Obtain a service URL endpoint for the given resource and standard IDs.</h4></p><p>`{String} resourceURI The Resource URI to lookup.`</p><p>`{String} standardURI The Standard ID URI to lookup.`</p><p>`{String} interfaceURI The URI of the interface type to pull down.`</p><p>`{boolean} secureFlag Whether to look for HTTPS access URLs. Requires client certificate.`</p><p>`@returns {Promise}`</p> |
| `getCapabilityURL()`                                                | <p><h4>Obtain the capabilities URL for the given URI.</h4></p><p>`{String} uri The URI to look up.`</p><p>`@returns {Promise}`</p>                                                                                                                                                                                                                                                                                |

### Obtaining a Service URL

```
var registryClient = new Registry()

// Look up the TAP service.
registryClient.getServiceURL(
        'ivo://cadc.nrc.ca/tap',
        'ivo://ivoa.net/std/TAP',
        'uws:Sync',
        false
      )
      .then(function(serviceURL) {
        // Hit the serviceURL
      }).catch(function(err) {
        console.error('Error obtaining Service URL > ' + err)
      })
```
