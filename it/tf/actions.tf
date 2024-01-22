data "local_file" "rules" {
  filename = "../rules.js"
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
    #rule_names     = "id_token_claim, saml"
    rule_names     = "accessTokenScopes"
  })
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

  /*
  dependencies {
    name    = "rules-wrapper"
    version = "0.1.4"
  }
  */

  dependencies {
    name    = "async"
    version = "3.2.5"
  }
}