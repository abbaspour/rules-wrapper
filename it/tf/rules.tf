// 01
data "local_file" "rule-src-globals" {
  filename = "../rules/01-globals.js"
}

resource "auth0_rule" "rule-globals" {
  name   = "globals"
  script = data.local_file.rule-src-globals.content
  order = 1
}

// 02
/*
data "local_file" "rule-src-dump" {
  filename = "../rules/02-dump.js"
}

resource "auth0_rule" "rule-dump" {
  name   = "dump"
  script = data.local_file.rule-src-dump.content
  order = 2
}

// 03
data "local_file" "rule-src-claims" {
  filename = "../rules/03-claims.js"
}

resource "auth0_rule" "rule-claims" {
  name   = "claims"
  script = data.local_file.rule-src-claims.content
  order = 3
}

// 04
data "local_file" "rule-src-saml" {
  filename = "../rules/04-saml.js"
}

resource "auth0_rule" "rule-saml" {
  name   = "saml"
  script = data.local_file.rule-src-saml.content
  order = 4
}

// 05 - redirect
data "local_file" "rule-src-redirect" {
  filename = "../rules/05-redirect.js"
}

resource "auth0_rule" "rule-redirect" {
  name   = "redirect"
  script = data.local_file.rule-src-redirect.content
  order = 5
}

// 06 - user metadata
data "local_file" "rule-src-user-metadata" {
  filename = "../rules/06-user-metadata.js"
}

resource "auth0_rule" "rule-user-metadata" {
  name   = "metadata"
  script = data.local_file.rule-src-user-metadata.content
  order = 6
}

// 07 - management-api
data "local_file" "rule-src-management-api" {
  filename = "../rules/07-management-api.js"
}

resource "auth0_rule" "rule-management-api" {
  name   = "managementApi"
  script = data.local_file.rule-src-management-api.content
  order = 7
}

// 08 - access_token scopes
data "local_file" "rule-src-control-scopes" {
  filename = "../rules/08-control-scopes.js"
}

resource "auth0_rule" "rule-control-scopes" {
  name   = "controlScopes"
  script = data.local_file.rule-src-control-scopes.content
  order = 8
}
*/

// 09 - final
data "local_file" "rule-src-final" {
  filename = "../rules/90-final.js"
}

resource "auth0_rule" "rule-final" {
  name   = "final"
  script = data.local_file.rule-src-final.content
  order = 999
}
