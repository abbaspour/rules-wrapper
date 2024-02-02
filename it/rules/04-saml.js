function saml(user, context, callback) {
    const info = global.info;

    if (context.protocol === 'samlp') {
        info('detected SAML federation. setting samlConfiguration');
        context.samlConfiguration.signatureAlgorithm = 'rsa-sha256';
        context.samlConfiguration.nameIdentifierProbes = [
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
        ];
        context.samlConfiguration.mappings = {
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/PPID': 'user_id'
        };
    }


    return callback(null, user, context);
}
