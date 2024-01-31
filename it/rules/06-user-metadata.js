function metadata(user, context, callback) {

    const last_country = context?.request?.geoip?.country_name ? context.request.geoip.country_name : 'NA';
    const last_city = context?.request?.geoip?.city_name ? context.request.geoip.city_name : 'NA';

    auth0.users.updateAppMetadata(user.user_id, {last_country});
    auth0.users.updateUserMetadata(user.user_id, {last_city});

    return callback(null, user, context);
}
