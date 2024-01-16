# Idea

```js
const wrapper = require('@auth0/rules-wrapper');

onExecutePostLogin = (event, api) => {
    const rules = [
        rule1,
        rule2
    ];

    wrapper.execute(rules, {event, api});
}
```

# Context Mapping

## Attributes

> NOTE: event fields are `snake_cased` and context fields are `cameCased`.

| Action `event`                   | Rules `context`       |
|:---------------------------------|:----------------------|
| `.authentication.riskAssessment` | `.riskAssessment`     |
| `.request`                       | `.request`            |
| `.authorization`                 | `.authorization`      |
| `.authentication`                | `.authentication`     |
| `.stats`                         | `.stats`              |
| `.connection.id`                 | `.connectionID`       |
| `.connection.metadata`           | `.connectionMetadata` |
| `.connection.name`               | `.connection`         |
| `.connection.strategy`           | `.connectionStrategy` |
| `.client.client_id`              | `.clientID`           |
| `.client.name`                   | `.clientName`         |
| `.client.metadata`               | `.clientMetadata`     |
| `.tenant.id`                     | `.tenant`             |
| `.transaction.protocol`          | `.protocol`           |           
| `.transaction.locale`            | `.locale`             |
| `.secrets`                       | `.configuration`      |
| N/A TBC?                         | `.jwtConfiguration`   |
| TBC?                             | `.sso`                |
| N/A                              | `.sessionID`          |
| N/A                              | `.auth0SessionId`     |

## Methods

| Action `api`                    | Rules `context`      |
|:--------------------------------|:---------------------|
| `.accessToken.setCustomClaim()` | `.accessToken`       |
| `.idToken.setCustomClaim()`     | `.idToken`           |
| `.samlResponse.setAttribute()`  | `.samlConfiguration` |
| `.multifactor.*`                | `.multifactor`       | 
| `.redirect.sendUserTo(url)`     | `.redirect {url}`    |

# User Mapping

## Attributes

| Action `event`          | Rules `user`        |
|:------------------------|:--------------------|
| `.user`                 | `.`                 |
| `.client.clent_id`      | `.clientID`  TBC?   |
| ?                       | `.global_client_id` |
| `.identities.[].userId` | -                   | 

## Methods

| Action `api`              | Rules `user`     |
|:--------------------------|:-----------------|
| `.user.setAppMetadata()`  | `.app_metadata`  |
| `.user.setUserMetadata()` | `.user_metadata` |

# Rules `auth0` Object

| Actions | Rules `auth0`  |
|:--------|:---------------|
| ?       | `.baseUrl`     |
| ?       | `.users`       |
| ?       | `.accessToken` |
| ?       | `.domain`      |