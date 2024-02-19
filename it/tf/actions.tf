data "local_file" "wrapper" {
  filename = "../../src/rules-wrapper.js"
}

/*
locals {
  benchmark_rules = [for i in range(length(auth0_rule.benchmark-rule)): { (auth0_rule.benchmark-rule[i].name) = auth0_rule.benchmark-rule[i].script }]
}
*/

resource "local_file" "action-code" {
  filename = "../.rendered/action.js"
  content  = templatefile("../actions/wrapper-action.tftpl.js", {
    //benchmark_rules = local.benchmark_rules,
    rules = [
      { (auth0_rule.rule-globals.name) = auth0_rule.rule-globals.script },
      { (auth0_rule.rule-dump.name) = auth0_rule.rule-dump.script },
      { (auth0_rule.rule-claims.name) = auth0_rule.rule-claims.script },
      { (auth0_rule.rule-saml.name) = auth0_rule.rule-saml.script },
      { (auth0_rule.rule-redirect.name) = auth0_rule.rule-redirect.script },
      { (auth0_rule.rule-user-metadata.name) = auth0_rule.rule-user-metadata.script },
      { (auth0_rule.rule-management-api.name) = auth0_rule.rule-management-api.script },
      { (auth0_rule.rule-control-scopes.name) = auth0_rule.rule-control-scopes.script },
      { (auth0_rule.rule-final.name) =  auth0_rule.rule-final.script }
    ],
    wrapper_source = data.local_file.wrapper.content
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

/* can't use global client. missing cc grant */
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
    version = "0.1.11"
  }

  dependencies {
    name    = "async"
    version = "3.2.5"
  }

  dependencies {
    name    = "auth0"
    version = "3.5.0"
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

