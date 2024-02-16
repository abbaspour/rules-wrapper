resource "auth0_rule" "benchmark-rule" {
  count = var.rule_count
  name   = "rule${count.index + 2}"
  enabled = false
  script = templatefile("./benchmark-rule.js.tftpl", {
    index = count.index + 2
  })
  order = count.index + 2
}

