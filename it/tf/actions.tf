data "local_file" "rules" {
  filename = "../rules01.js"
}

data "local_file" "wrapper" {
  filename = "../../src/rules-wrapper.js"
}

resource "local_file" "action-code" {
  filename = "../.rendered/action.js"
  content  = templatefile("../action.tpl.js", {
    rules_source   = data.local_file.rules.content
    wrapper_source = data.local_file.wrapper.content
    #rule_names     = "id_token_claim, redirect"
    rule_names     = "id_token_claim, saml"
    //rule_names     = "accessTokenScopes"
    //rule_names     = "metadata"
    #rule_names     = "user_search"
    #rule_names     = "restrictClientRule,enrichTokens"
  })
}

data "auth0_resource_server" "api_v2" {
  identifier = "https://${var.auth0_domain}/api/v2/"
}

resource "auth0_client" "companion-m2m" {
  name = "Rules Wrapper Companion APIv2 Client users read and update"
  app_type = "non_interactive"
  grant_types = [
    "client_credentials"
  ]
}

resource "auth0_client_grant" "companion-m2m-grants" {
  audience  = data.auth0_resource_server.api_v2.identifier
  client_id = auth0_client.companion-m2m.client_id
  scopes    = ["read:users", "update:users"]
}

data "auth0_client" "companion-m2m" {
  name = auth0_client.companion-m2m.name
  client_id = auth0_client.companion-m2m.client_id
}

data "auth0_client" "global_client" {
  name = "All Applications"
}

resource "auth0_action" "wrapper-action" {
  name    = "Rules Wrapper Action"
  runtime = "node18"
  deploy  = true
  code    = local_file.action-code.content

  supported_triggers {
    id      = "post-login"
    version = "v3"
  }

  dependencies {
    name    = "rules-wrapper"
    version = "0.1.6"
  }

  dependencies {
    name    = "async"
    version = "3.2.5"
  }

  dependencies {
    name    = "auth0"
    version = "4.2.0"
  }

  secrets {
    name  = "clientId"
    value = auth0_client.companion-m2m.client_id
  }

  secrets {
    name  = "clientSecret"
    value = data.auth0_client.companion-m2m.client_secret
  }

  secrets {
    name  = "domain"
    value = var.auth0_domain
  }

  secrets {
    name  = "global_client_id"
    value = data.auth0_client.global_client.client_id
  }
}

output "global_client_id" {
  value = data.auth0_client.global_client.client_id
}