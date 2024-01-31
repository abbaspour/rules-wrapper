async function listUsers(user, context, callback) {

    const info = global.info;
    const { role } = user.app_metadata || {};

    if (role !== 'admin') {
        return callback(null, user, context);
    }

    const {ManagementClient} = require('auth0');

    const management = new ManagementClient({
        token: auth0.accessToken,
        domain: auth0.domain
    });

    const {data} = await management.users.getAll();
    info('result from management.users.getAll(): ' + JSON.stringify(data));

    return callback(null, user, context);
}
