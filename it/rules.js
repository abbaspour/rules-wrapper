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
    callback();
}