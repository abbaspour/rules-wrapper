# Auth0 Rules Wrapper

```js
const wrapper = require('@auth0/rules-wrapper');

function rule01(u, ctx, cb) { }
function rule02(u, ctx, cb) { }

exports.onExecutePostLogin = async (event, api) => {
    await wrapper.execute([rule01, rule02], {event, api});
}

exports.onContinuePostLogin = async (event, api) => {
    await wrapper.execute([rule01, rule02], {event, api, onContinue: true});
}
```


Actions based wrapper function to run Rules without any modifications to source code.

# Mapping Table
see [mapping.md](mapping.md)

# Compatibility
* [x] access_token claims
* [x] access_token scopes
* [x] id_token claims
* [x] setting primaryUserId
* [x] SAML response mapping
* [x] `global` object simple
* [x] pre & post redirect 
* [x] MFA
* [x] `auth0` object user and app metadata for current user
* [x] `auth0` object accessToken
* [ ] Configuration object 

# Not supported 
* [ ] SAML mapping for [issuer, logout and binding](https://auth0team.atlassian.net/servicedesk/customer/portal/34/ESD-33960) 
* [ ] npm dependencies (Rules [verequire()](https://github.com/auth0/verquire/blob/master/lib/verquire.js#L14-L44)) vs actions dependencies
* [ ] global_client_id

# Out of scope
* [x] `auth0` object user and app metadata for other users

# Todo
* [ ] log level param

# References
* https://auth0team.atlassian.net/servicedesk/customer/portal/9/DR-2055?created=true
* https://auth0team.atlassian.net/servicedesk/customer/portal/34/ESD-33960?created=true
* https://auth0.com/docs/get-started/architecture-scenarios/spa-api/part-2#create-a-rule-to-validate-token-scopes