function redirect(user, context, callback) {

    const info = global.info;

    const interactive_login = new RegExp('^oidc-basic-profile');

    if (!interactive_login.test(context.protocol)) {
        info(`protocol ${context.protocol} is not oidc-basic-profile. no redirect`);
        return callback(null, user, context);
    }

    context.redirect = {
        url: 'https://httpbin.org/get'
    };

    console.info('redirecting to httpbin for oidc-basic-profile');

    return callback(null, user, context);
}
