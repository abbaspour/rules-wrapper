#!/usr/bin/env bash

# shellcheck disable=SC2016

command -v awk >/dev/null || { echo >&2 "ERROR: awk required."; exit 1; }
command -v jq >/dev/null || { echo >&2 "ERROR: jq required."; exit 1; }

readonly DIR=$(dirname "${BASH_SOURCE[0]}")

readonly tfvars="${DIR}/tf/terraform.auto.tfvars"
readonly tfstate="${DIR}/tf/terraform.tfstate"

declare -r username=$(awk -F= '/^user1_email/{print $2}' "${tfvars}" | tr -d ' "')
declare -r password=$(awk -F= '/^default_password/{print $2}' "${tfvars}" | tr -d ' "')
declare -r client_id=$(jq  -r '.resources[] | select(.type=="auth0_client") | select (.name=="jwt-io") | .instances[0].attributes.client_id' "${tfstate}")
declare -r connection='Username-Password-Authentication'
declare -r auth0_domain=$(awk -F= '/^auth0_domain/{print $2}' "${tfvars}" | tr -d ' "')

declare BODY=$(cat <<EOL
{
  "scope": "openid profile read:user update:user delete:user",
  "audience": "my.rs",
  "grant_type": "http://auth0.com/oauth/grant-type/password-realm",
  "realm" : "${connection}",
  "client_id": "${client_id}",
  "username": "${username}",
  "password": "${password}"
}
EOL
)

#curl --header 'content-type: application/json' -d "${BODY}" "https://${auth0_domain}/oauth/token"
#exit

readonly response=$(curl -s --header 'content-type: application/json' -d "${BODY}" "https://${auth0_domain}/oauth/token")

#echo $response

readonly access_token=$(jq -r '.access_token' <<< "${response}")
readonly id_token=$(jq -r '.id_token' <<< "${response}")

#echo "Access Token"
#jq -Rr 'split(".") | .[1] | gsub("-"; "+") | gsub("_"; "/") | gsub("%3D"; "=") | @base64d | fromjson' <<< "${access_token}"

if [[ -n "${id_token}" && "${id_token}" != "null" ]]; then
  #echo "ID Token"
  #jq -Rr 'split(".") | .[1] | gsub("-"; "+") | gsub("_"; "/") | gsub("%3D"; "=") | @base64d | fromjson' <<< "${id_token}"
  jq -Rr 'split(".") | .[1] | gsub("-"; "+") | gsub("_"; "/") | gsub("%3D"; "=") | @base64d | fromjson | .runtime' <<< "${id_token}"
fi