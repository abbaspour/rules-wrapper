function scopes(user, context, callback) {

    const info = global.info;

    const audience = context.protocol === 'oauth2-password'? context.request.body.audience : context.request.query.audience;

    if(!audience || audience !== 'my.rs') {
        return callback(null, user, context);
    }

    const scope = context.protocol === 'oauth2-password'? context.request.body.scope : context.request.query.scope;

    if (!scope) return callback(null, user, context);

    info(`>>> received scopes: ${scope}`);

    const scopes = scope.split(' ');

    const { role } = user.app_metadata || {};

    if (role === 'admin') {
        info(`user ${user.email} has admin role. skipping scopes check. checking MFA`);

        const authentication_methods = context.authentication.methods || [];
        const done_mfa = authentication_methods.find(m => m.name === 'mfa');

        const alter_user_scopes = scopes.includes('update:user') || scopes.includes('delete:user');

        if (!done_mfa && alter_user_scopes) {
            info('admin user requires MFA to alter users');
            context.multifactor = {
                provider : 'any'
            };
        }

        return callback(null, user, context);
    }

    const filtered_scopes = scopes.filter(s => s !== 'delete:user');

    info(`>>> filtered scopes: ${JSON.stringify(filtered_scopes)}`);
    context.accessToken.scope = filtered_scopes.join(' ');

    return callback(null, user, context);
}