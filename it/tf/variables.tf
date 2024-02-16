## auth0
variable "auth0_domain" {
  type = string
  description = "Auth0 Domain"
}

variable "auth0_tf_client_id" {
  type = string
  description = "Auth0 TF provider client_id"
}

variable "auth0_tf_client_secret" {
  type = string
  description = "Auth0 TF provider client_secret"
  sensitive = true
}

variable "default_password" {
  type = string
  description = "password for test users"
  sensitive = true
}

variable "user1_email" {
  type = string
  description = "email for test users"
}

variable "social_user_email" {
  type = string
  description = "email for social users"
}

variable "rule_count" {
  type = number
  description = "number of rules for performance testing"
  default = 1
}