function scopes(user, context, callback) {

    const info = global.info;
    const error = global.error;

    const { role } = user.app_metadata || {};

    const {scope} = context.accessToken || {};

    if (!scope) return callback(null, user, context);

    info(`>>> received scopes: ${scope}`);

    const scopes = scope.split(' ');

    if (role === 'admin') {
        info(`user ${user.email} has admin role. skipping scopes check`);

        const done_mfa = context.authentication.find(o => o.name === 'mfa');

        const alter_user_scopes = scopes.includes('update:user') || scopes.includes('delete:user')
        if (!done_mfa && alter_user_scopes) {
            info('admin user requires MFA to alter users');
            context.multifactor = {
                provider : 'any'
            };
        }

        return callback(null, user, context);
    }

    let found = true;
    do {
        const index = scopes.findIndex('delete:user');
        found = index !== -1;
        if (found) {
            delete scopes[index];
            error('non-admin users cannot request delete:user. removing');
        }
    } while (found);

    const filtered_scopes = scopes.join(' ');
    info(`>>> filtered scopes: ${JSON.stringify(filtered_scopes)}`);
    context.accessToken.scope = filtered_scopes;

    return callback(null, user, context);
}