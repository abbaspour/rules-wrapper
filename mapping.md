# Context Mapping

## Attributes

| Action `event`                   | Rules `context`       |
|:---------------------------------|:----------------------|
| `.authentication.riskAssessment` | `.riskAssessment`     |
| `.request`                       | `.request`            |
| `.authorization`                 | `.authorization`      |
| `.authentication`                | `.authentication`     |
| `.stats`                         | `.stats`              |
| `.connection.id`                 | `.connectionID`       |
| `.connection.metadata`           | `.connectionMetadata` |
| `.connection.name`               | `.connection`         |
| `.connection.strategy`           | `.connectionStrategy` |
| `.client.client_id`              | `.clientID`           |
| `.client.name`                   | `.clientName`         |
| `.client.metadata`               | `.clientMetadata`     |
| `.tenant.id`                     | `.tenant`             |
| `.transaction.protocol`          | `.protocol`           |           
| `.transaction.locale`            | `.locale`             |
| `.secrets`                       | `.configuration`      |
| N/A TBC?                         | `.jwtConfiguration`   |
| TBC?                             | `.sso`                |
| N/A                              | `.sessionID`          |
| N/A                              | `.auth0SessionId`     |

## Methods

| Action `api`                    | Rules `context`         |
|:--------------------------------|:------------------------|
| `.accessToken.setCustomClaim()` | `.accessToken`          |
| `.idToken.setCustomClaim()`     | `.idToken`              |
| `.samlResponse.setX()`          | `.samlConfiguration.x`  |
| `.multifactor.enable(p, {r})`   | `.multifactor {p, {r}}` | 
| `.redirect.sendUserTo(url)`     | `.redirect {url}`       |

### SAML Mappiong Methods

Based
on [Rules SAML assertion mapping](https://auth0.com/docs/authenticate/protocols/saml/saml-configuration/customize-saml-assertions)
and
[Actions](https://auth0.com/docs/customize/actions/flows-and-triggers/login-flow/api-object)

| Rules `context.samlConfiguration` | Type    | Action `api.samlResponse`              |
|:----------------------------------|:--------|:---------------------------------------|
| audience                          | string  | `.setAudience()`                       | 
| recipient	                        | string  | `.setRecipient()`                      | 
| issuer                            | string  | ???                                    | 
| mappings                          | object  | `.setAttribute()`                      | 
| createUpnClaim                    | boolean | `.setCreateUpnClaim()`                 | 
| passthroughClaimsWithNoMapping    | boolean | `.setPassthroughClaimsWithNoMapping()` | 
| mapUnknownClaimsAsIs              | boolean | `.setMapUnknownClaimsAsIs()`           | 
| mapIdentities	                    | boolean | `.setMapIdentities()`                  | 
| signatureAlgorithm                | string  | `.setSignatureAlgorithm()`             | 
| digestAlgorithm                   | string  | `.setDigestAlgorithm()`                | 
| destination                       | object? | `.setDestination()`                    | 
| lifetimeInSeconds                 | integer | `.setLifetimeInSeconds()`              | 
| signResponse                      | boolean | `.setSignResponse()`                   | 
| nameIdentifierFormat              | string  | `.setNameIdentifierFormat()            | 
| nameIdentifierProbes              | array   | `.setNameIdentifierProbes()`           | 
| authnContextClassRef              | string  | `.setAuthnContextClassRef()`           | 
| typedAttributes                   | boolean | `.setTypedAttributes()`                | 
| includeAttributeNameFormat        | boolean | `.setIncludeAttributeNameFormat()`     | 
| logout                            | object  | ???                                    | 
| binding                           | string  | ???                                    | 
| signingCert                       | string  | `.setSigningCert()`                    |  

# User Mapping

## Attributes

| Action `event`          | Rules `user`        |
|:------------------------|:--------------------|
| `.user`                 | `.`                 |
| `.client.clent_id`      | `.clientID`  TBC?   |
| ?                       | `.global_client_id` |
| `.identities.[].userId` | -                   | 

## Methods

| Action `api`              | Rules `auth0.users` |
|:--------------------------|:--------------------|
| `.user.setAppMetadata()`  | `.app_metadata`     |
| `.user.setUserMetadata()` | `.user_metadata`    |

# Rules `auth0` Object

| Actions | Rules `auth0`  |
|:--------|:---------------|
| ?       | `.baseUrl`     |
| ?       | `.users`       |
| ?       | `.accessToken` |
| ?       | `.domain`      |