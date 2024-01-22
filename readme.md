# Auth0 Rules Wrapper

Actions based wrapper function to run Rules without any modifications to source code.

# Mapping Table
see [mapping.md](mapping.md)

# Compatibility
* [x] access_token claims
* [x] access_token scopes
* [x] id_token claims
* [x] setting primaryUserId
* [x] SAML response mapping
* [x] `global` object
* [x] pre & post redirect 
* [x] MFA
* [ ] user and app metadata
* [ ] `auth0` object
* [ ] npm dependencies

# Not supported 
* [ ] upstream IdP access_token

# Todo
* [ ] `global` object fields write back to cache
* [ ] log level param

# References
* https://auth0team.atlassian.net/servicedesk/customer/portal/9/DR-2055?created=true
* https://auth0team.atlassian.net/servicedesk/customer/portal/34/ESD-33960?created=true
* https://auth0.com/docs/get-started/architecture-scenarios/spa-api/part-2#create-a-rule-to-validate-token-scopes