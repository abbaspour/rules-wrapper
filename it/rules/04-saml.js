function saml(user, context, callback) {
    const info = global.info;
    const error = global.error;

    if (context.protocol === 'samlp') {
        info('detected SAML federation. setting samlConfiguration');
        context.samlConfiguration.signatureAlgorithm = 'rsa-sha256';
        context.samlConfiguration.nameIdentifierProbes = [
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
        ];
        context.samlConfiguration.mappings = {
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/PPID': 'user_id'
        };


        const { role } = user.app_metadata || {};

        if (role === 'admin') {
            error(`admin user ${user.email} not allowed to do SAML`);
            return callback('SAML not allowed for admin users');
        }
    }


    return callback(null, user, context);
}
