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
* [x] configuration object populated from secrets 
* [x] global_client_id

# Not supported
* [ ] SAML mapping for [issuer, logout and binding](https://auth0team.atlassian.net/servicedesk/customer/portal/34/ESD-33960) 
* [ ] context fields `sessionID`, `auth0SessionId`, `sso` and `jwtConfiguration`
* [ ] [upstream IdP access_token](https://auth0.com/docs/customize/actions/limitations) 

# Out of scope
* [x] `auth0` object user and app metadata for other users

# Todo
* [ ] log level param
