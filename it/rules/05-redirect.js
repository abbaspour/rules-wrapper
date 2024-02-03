function redirect(user, context, callback) {

    const info = global.info;
    const error = global.error;

    const implicit_login = new RegExp('^oidc-implicit-profile');

    const {role} = user.app_metadata || {};

    if (role === 'admin') {
        if (implicit_login.test(context.protocol)) {
            error(`admin user ${user.email} not allowed to do implicit`);
            return callback('implicit not allowed for admin users');
        }
        return callback(null, user, context);
    }

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
