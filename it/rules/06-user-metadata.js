function metadata(user, context, callback) {

    const { geoip: {country_name}} = context.request || {geoip: {country_name: 'NA'}};
    const { geoip: {city_name}} = context.request || {geoip: {city_name: 'NA'}};

    auth0.users.updateAppMetadata(user.user_id, {last_country: country_name});
    auth0.users.updateUserMetadata(user.user_id, {last_city: city_name});

    return callback(null, user, context);
}
