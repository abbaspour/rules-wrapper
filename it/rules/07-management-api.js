async function link(user, context, callback) {

    const info = global.info;
    const error = global.err;

    const {ManagementClient} = require('auth0');

    if (user.identities.length > 1) { // no linking if user is already linked
        info('user already linked. skip linking.');
        return callback(null, user, context);
    }

    if (!user.identities[0].isSocial) {
        info('user is not social. skip linking.');
        return callback(null, user, context);
    }

    const client = new ManagementClient({
        token: auth0.accessToken,
        domain: auth0.domain
    });

    // Search for other candidate users
    const candidateUsers = await client.getUsersByEmail(user.email);

    if (!Array.isArray(candidateUsers) || !candidateUsers.length) { // didn't find anything
        info('no candidate users after search. skip linking');
        return callback(null, user, context);
    }

    const firstCandidate = candidateUsers.find((c) =>
            c.user_id !== user.user_id                  // not the current user
            && c.identities[0].provider === 'auth0'     // DB user
        //&& c.email_verified                           // make sure email is verified
    );

    if (!firstCandidate) { // didn't find any other user with the same email other than ourselves
        info('no candidate users after filter. skip linking');
        return;
    }

    client.linkUsers(firstCandidate.user_id, {
        provider: user.identities[0].provider,
        user_id: user.identities[0].user_id
    }, function (err) {
        if (err) {
            error(`unable to link social user ${user.user_id} to dn ${firstCandidate.user_id} successful due to ${err}`);
            return callback(null, user, context);
        }
    });
    info(`linked current social user ${user.user_id} to new DB primary ${firstCandidate.user_id} successful.`);

    context.primaryUser = firstCandidate.user_id;

    return callback(null, user, context);
}
