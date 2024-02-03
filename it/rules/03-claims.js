function claims(user, context, callback) {

    const { geoip: {country_name}} = context.request || {geoip: {country_name: 'NA'}};

    context.idToken.country = country_name;
    context.accessToken.country = country_name;

    return callback(null, user, context);
}