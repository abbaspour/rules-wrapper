function restrictClientRule(user, context, callback) {
    // TODO: implement your rule
    if (context.clientID === 'mEEmp8AbfUAYFfhibxIcdkfOGbpjuQS5') {
        context.accessToken.scope = 'openid profile email';
    }
    return callback(null, user, context);
}

function enrichTokens(user, context, callback) {
    const namespace = 'https://myapp.example.com/';
    var MOBILE_CLIENTS = ['ZadSt4UULd9aFcCG7Fm73lblWrkxN7nK'];
    if (MOBILE_CLIENTS.indexOf(context.clientID) !== -1 && user.app_metadata && user.app_metadata.sealed) {
        context.idToken['https://mobiletowebsso.com/sealedToken'] = user.app_metadata.sealed;
    }
    context.idToken[namespace + 'mobile'] = user.phone_number || user.user_metadata.mobile || '+61430838370';
    context.idToken[namespace + 'amr'] = ['mfa'];
    callback(null, user, context);
}