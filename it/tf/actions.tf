data "local_file" "rule01" {
  filename = "../rule01.js"
}

resource "local_file" "action-code" {
  filename = "../.rendered/action.js"
  content = templatefile("../action.js.tpl", {
    rules_source = data.local_file.rule01.content
    rule_names = "rule01"
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

  dependencies {
    name    = "rules-wrapper"
    version = "0.1.0"
  }
}