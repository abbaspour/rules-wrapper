# Auth0 Rules Wrapper

Actions based wrapper function to run Rules without any modifications to source code.

# Mapping Table
see [mapping.md](mapping.md)

# Compatibility
* [x] access_token claims
* [ ] access_token scopes
* [x] id_token claims
* [x] setting primaryUserId
* [ ] SAML response mapping
* [x] `global` object
* [x] pre & post redirect 
* [ ] `auth0` object
* [ ] npm dependencies
* [ ] MFA

# Not supported 
* [ ] upstream IdP access_token

# Todo
* [ ] `global` object fields write back to cache
