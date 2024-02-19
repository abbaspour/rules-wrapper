resource "auth0_action" "benchmark-begin" {
  name   = "benchmark action begin"
  deploy = true
  code = file("../actions/benchmark-begin.js")
  supported_triggers {
    id      = "post-login"
    version = "v3"
  }
}

resource "auth0_action" "benchmark-end" {
  name   = "benchmark action end"
  deploy = true
  code = file("../actions/benchmark-end.js")
  supported_triggers {
    id      = "post-login"
    version = "v3"
  }
}

resource "auth0_action" "benchmark-action" {
  count = var.action_count
  name   = "benchmark action ${count.index + 2}"
  deploy = true
  code = templatefile("../actions/benchmark-action.tftpl.js", {
    index = count.index + 2
  })
  supported_triggers {
    id      = "post-login"
    version = "v3"
  }
}

resource "auth0_trigger_actions" "benchmark-binding" {
  trigger = "post-login"
  depends_on = [auth0_action.benchmark-action]

  actions {
    display_name = "begin"
    id           = auth0_action.benchmark-begin.id
  }

  dynamic "actions" {
    for_each = auth0_action.benchmark-action
    content {
      id = actions.value.id
      display_name = actions.value.name
    }
  }

  actions {
    display_name = "end"
    id           = auth0_action.benchmark-end.id
  }

}
