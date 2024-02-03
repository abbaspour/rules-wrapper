resource "auth0_tenant" "tenant_config" {
  friendly_name = "Rules Wrapper Demo"
  flags {
    enable_client_connections = false
  }
  sandbox_version = "18"
}

# simple SPA client
resource "auth0_client" "jwt-io" {
  name            = "JWT.io"
  description     = "JWT.io SPA client"
  app_type        = "spa"
  oidc_conformant = true
  is_first_party  = true

  callbacks = [
    "https://jwt.io"
  ]

  allowed_logout_urls = [
  ]

  grant_types = [
    "authorization_code",
    "http://auth0.com/oauth/grant-type/password-realm",
    "implicit",
    "password",
    "refresh_token"
  ]

  jwt_configuration {
    alg = "RS256"
  }
}


data "auth0_connection" "db" {
  name = "Username-Password-Authentication"
}

resource "auth0_connection_clients" "db_clients" {
  connection_id   = data.auth0_connection.db.id
  enabled_clients = [auth0_client.jwt-io.id, var.auth0_tf_client_id]
  lifecycle {
    ignore_changes = [
      enabled_clients
    ]
  }
}

resource "auth0_resource_server" "rs" {
  name       = "Sample Resource Server"
  identifier = "my.rs"

  allow_offline_access                            = true
  skip_consent_for_verifiable_first_party_clients = true
}

resource "auth0_resource_server_scopes" "my_api_scopes" {
  resource_server_identifier = auth0_resource_server.rs.identifier

  scopes {
    name        = "read:user"
    description = "allow read user"
  }

  scopes {
    name        = "update:user"
    description = "allow update user"
  }

  scopes {
    name        = "delete:user"
    description = "allow delete user for admin roles only"
  }
}

## Users
resource "auth0_user" "user_1" {
  depends_on      = [auth0_connection_clients.db_clients]
  connection_name = data.auth0_connection.db.name
  email           = var.user1_email
  password        = var.default_password
  given_name      = "User1"
  family_name     = "Tester"
  lifecycle {
    ignore_changes = [
      app_metadata, user_metadata
    ]
  }
}

resource "auth0_user" "user_2" {
  depends_on      = [auth0_connection_clients.db_clients]
  connection_name = data.auth0_connection.db.name
  email           = var.social_user_email
  password        = var.default_password
  given_name      = "Social"
  family_name     = "User"
  lifecycle {
    ignore_changes = [
      app_metadata, user_metadata
    ]
  }
}

resource "auth0_user" "user_admin" {
  depends_on      = [auth0_connection_clients.db_clients]
  connection_name = data.auth0_connection.db.name
  email           = "admin@atko.email"
  password        = var.default_password
  given_name      = "Admin"
  family_name     = "Tester"
  app_metadata    = jsonencode({
    role : "admin"
  })
  lifecycle {
    ignore_changes = [
      app_metadata, user_metadata
    ]
  }
}

## Social (for linking demo)
data "auth0_connection" "google" {
  name = "google-oauth2"
}

resource "auth0_connection_clients" "google_clients" {
  connection_id   = data.auth0_connection.google.id
  enabled_clients = [auth0_client.jwt-io.id]
  lifecycle {
    ignore_changes = [
      enabled_clients
    ]
  }
}

## outputs
output "spa_login_url" {
  value = "https://${var.auth0_domain}/authorize?client_id=${auth0_client.jwt-io.id}&redirect_uri=https%3A%2F%2Fjwt.io&response_type=id_token&nonce=nonce&prompt=login&scope=openid%20profile%20email&login_hint=${auth0_user.user_1.email}"
}

