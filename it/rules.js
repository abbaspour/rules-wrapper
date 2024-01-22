function id_token_claim(user, context, callback) {
    console.log('adding claim to id_token');
    context.idToken = context.idToken || {};
    context.idToken['x'] = 'y';
    callback(null);
}

function redirect(user, context, callback) {
    if (context.protocol === 'redirect-callback') return callback(null);
    if (!context.protocol.match(/^oidc/)) return callback(null);

    console.log('interactive login, redirecting to httpbin');

    context.redirect = {
        url: 'https://httpbin.org/get'
    };
    callback();
}

function saml(user, context, callback) {
    context.samlConfiguration.signatureAlgorithm = 'rsa-sha256';
    context.samlConfiguration.nameIdentifierProbes = [
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
    ];

    callback();
}

function accessTokenScopes(user, context, callback) {
    context.accessToken.scope = 's1 s2 s3';
    callback();
}

function metadata(user, context, callback) {
    auth0.users.updateAppMetadata(user.user_id, {'a1': 'v1'});
    auth0.users.updateUserMetadata(user.user_id, {'u1': 'v2'});
    callback();
}


async function user_search(user, context, callback) {
    // const { ManagementClient } = require('auth0').ManagementClient;
    const { ManagementClient } = require('auth0');

    const management = new ManagementClient({
        token: auth0.accessToken,
        domain: auth0.domain
    });

    const {data} = await management.users.getAll();
    console.log(JSON.stringify(data));

    callback();
}