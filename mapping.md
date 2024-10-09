# Context Mapping

## Attributes

| Rules `context`                       | Action `event`                                        | 
|:--------------------------------------|:------------------------------------------------------|
| `.riskAssessment`                     | `.authentication.riskAssessment`                      | 
| `.request`                            | `.request`                                            | 
| `.authorization`                      | `.authorization`                                      | 
| `.authentication`                     | `.authentication`                                     | 
| `.stats`                              | `.stats`                                              | 
| `.connectionID`                       | `.connection.id`                                      | 
| `.connectionMetadata`                 | `.connection.metadata`                                | 
| `.connection`                         | `.connection.name`                                    | 
| `.connectionStrategy`                 | `.connection.strategy`                                | 
| `.clientID`                           | `.client.client_id`                                   | 
| `.clientName`                         | `.client.name`                                        | 
| `.clientMetadata`                     | `.client.metadata`                                    | 
| `.tenant`                             | `.tenant.id`                                          | 
| `.protocol`                           | `.transaction.protocol`                               |            
| `.locale`                             | `.transaction.locale`                                 | 
| `.configuration`                      | `.secrets`                                            | 
| `.sso.current_clients`                | `.session.clients`                                    | 
| `.sessionID`                          | `.session.id`                                         | 
| `.auth0SessionId`                     | `.session.id`                                         | 
| `.connectionOptions.domain_aliases`   | ???                                                   | 
| `.connectionOptions.tenant_domain`    | ???                                                   | 
| `.jwtConfiguration.scopes`            | ???                                                   | 
| `.jwtConfiguration.lifetimeInSeconds` | ???                                                   | 
| `.sso.with_dbconn`                    | `.authentication.methods.some(m => m.name === 'pwd')` | 
| `.sso.with_auth0`                     | deprecated                                            | 

## Methods

| Rules `context`         | Action `api`                    | 
|:------------------------|:--------------------------------|
| `.accessToken`          | `.accessToken.setCustomClaim()` | 
| `.idToken`              | `.idToken.setCustomClaim()`     | 
| `.samlConfiguration.x`  | `.samlResponse.setX()`          | 
| `.multifactor {p, {r}}` | `.multifactor.enable(p, {r})`   |  
| `.redirect = {url}`     | `.redirect.sendUserTo(url)`     | 

### SAML Mappiong Methods

Based
on [Rules SAML assertion mapping](https://auth0.com/docs/authenticate/protocols/saml/saml-configuration/customize-saml-assertions)
and
[Actions](https://auth0.com/docs/customize/actions/flows-and-triggers/login-flow/api-object)

| Rules `context.samlConfiguration` | Type    | Action `api.samlResponse`              |
|:----------------------------------|:--------|:---------------------------------------|
| `.audience`                       | string  | `.setAudience()`                       | 
| `.recipient`                      | string  | `.setRecipient()`                      | 
| `.mappings`                       | object  | `.setAttribute()`                      | 
| `.createUpnClaim`                 | boolean | `.setCreateUpnClaim()`                 | 
| `.passthroughClaimsWithNoMapping` | boolean | `.setPassthroughClaimsWithNoMapping()` | 
| `.mapUnknownClaimsAsIs`           | boolean | `.setMapUnknownClaimsAsIs()`           | 
| `.mapIdentities`                  | boolean | `.setMapIdentities()`                  | 
| `.signatureAlgorithm`             | string  | `.setSignatureAlgorithm()`             | 
| `.digestAlgorithm`                | string  | `.setDigestAlgorithm()`                | 
| `.destination`                    | object? | `.setDestination()`                    | 
| `.lifetimeInSeconds`              | integer | `.setLifetimeInSeconds()`              | 
| `.signResponse`                   | boolean | `.setSignResponse()`                   | 
| `.nameIdentifierFormat`           | string  | `.setNameIdentifierFormat()            | 
| `.nameIdentifierProbes`           | array   | `.setNameIdentifierProbes()`           | 
| `.authnContextClassRef`           | string  | `.setAuthnContextClassRef()`           | 
| `.typedAttributes`                | boolean | `.setTypedAttributes()`                | 
| `.includeAttributeNameFormat`     | boolean | `.setIncludeAttributeNameFormat()`     | 
| `.signingCert`                    | string  | `.setSigningCert()`                    |  
| `.encryptionPublicKey`            | string  | `.setEncryptionPublicKey()`            |  
| `.encryptionCert`                 | string  | `.setEncryptionCert()`                 |  
| `.key`                            | string  | `.setKey()`                            |  
| `.cert`                           | string  | `.setCert()`                           |  
| `.authnContextDeclRef`            | string  | deprecated                             | 
| `.issuer`                         | string  | ???                                    | 
| `.logout {callback, slo_enabled}` | object  | ???                                    | 
| `.binding`                        | string  | ???                                    | 
| `.RelayState`                     | string  | ???                                    |
| `.wctx`                           | string  | ???                                    | 

# User Mapping

## Attributes

| Rules `user`                 | Action `event`                               |         
|:-----------------------------|:---------------------------------------------|
| `.`                          | `.user`                                      |                     
| `.clientID`                  | `.client.clent_id`                           | 
| `.global_client_id`          | deprecated (use `.secrets.global_client_id`) | 
| `.identities[]`              | `.user.identities`                           | 
| `.identities[].access_token` | deprecated (TBA via add-on)                  | 

## Methods

This is rough mapping since `auth0.users` can operate on all users but `api.user` only operates on current_user.

| Rules `auth0.users`     | Action `api.user`    | 
|:------------------------|:---------------------|
| `.updateAppMetadata()`  | `.setAppMetadata()`  | 
| `.updateUserMetadata()` | `.setUserMetadata()` | 

# Rules `auth0` Object

deprecated (TBA via add-on)

| Rules `auth0`  | Actions | 
|:---------------|:--------|
| `.baseUrl`     | ???     | 
| `.users`       | ???     | 
| `.accessToken` | ???     | 
| `.domain`      | ???     | 

Auth0 accessToken has following scopes

* `read:users`
* `update:users`

Here is a sample token:

```json
{
  "iss": "https://abbaspour.auth0.com/",
  "aud": "https://abbaspour.auth0.com/api/v2/",
  "iat": 1726545425,
  "exp": 1726550825,
  "scope": "read:users update:users",
  "azp": "indMoL7Aya109w09tV5Ei4gdTf1DmKL1"
}
```