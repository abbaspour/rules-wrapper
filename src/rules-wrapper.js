const async = require('async');
const _ = require('lodash');

function mapToContext(event) {
    const context = {
        authentication: event?.authentication,
        riskAssessment: event?.authentication?.riskAssessment,
        request: event?.request,
        authorization: event?.authorization,
        stats: {
            loginsCount: event?.stats?.logins_count
        },
        connectionID: event?.connection?.id,
        connectionMetadata: event?.connection?.metadata,
        connection: event?.connection?.name,
        connectionStrategy: event?.connection?.strategy,
        clientID: event?.client?.client_id,
        clientName: event?.client?.name,
        clientMetadata: event?.client?.metadata,
        tenant: event?.tenant?.id,
        protocol: event?.transaction?.protocol,
        locale: event?.transaction?.locale,
        // TBC
        jwtConfiguration: {}, // TODO
        // TODO sso: {},
        // placeholder for api
        connectionOptions: {},
        accessToken: {},
        idToken: {},
        samlConfiguration: {},
        // TODO multifactor: {},
        // TODO redirect: {}
    };

    delete (context?.authentication?.riskAssessment);

    if (event?.request?.user_agent) {
        context.request.userAgent = event.request.user_agent;
        delete (context?.request?.user_agent);
    }

    if (event?.request?.geoip) {
        context.request.geoip.city_name = event.request.geoip?.cityName;
        context.request.geoip.continent_code = event.request.geoip?.continentCode;
        context.request.geoip.country_code = event.request.geoip?.countryCode;
        context.request.geoip.country_code3 = event.request.geoip?.countryCode3;
        context.request.geoip.country_name = event.request.geoip?.countryName;
        context.request.geoip.subdivision_code = event.request.geoip?.subdivisionCode;
        context.request.geoip.subdivision_name = event.request.geoip?.subdivisionName;
        context.request.geoip.time_zone = event.request.geoip?.timeZone;
        delete (context.request.geoip?.cityName);
        delete (context.request.geoip?.continentCode);
        delete (context.request.geoip?.countryCode);
        delete (context.request.geoip?.countryCode3);
        delete (context.request.geoip?.countryName);
        delete (context.request.geoip?.subdivisionCode);
        delete (context.request.geoip?.subdivisionName);
        delete (context.request.geoip?.timeZone);
    }

    if (!_.isEmpty(event?.secrets)) {
        context.configuration = event.secrets;
    }

    _.forEach(context?.authentication?.methods, m => m.timestamp = new Date(m.timestamp).valueOf());

    Object.defineProperty(context, 'sessionID', {
        get: function () {
            console.log('sessionID not supported in rules-wrapper');
            return 'unsupported';
            //throw new Error('sessionID not supported in rules-wrapper')
        }
    });
    Object.defineProperty(context, 'auth0SessionId', {
        get: function () {
            console.log('auth0SessionId not supported in rules-wrapper');
            return 'unsupported';
            //throw new Error('auth0SessionId not supported in rules-wrapper')
        }
    });

    return context;
}

function mapToUser(event) {
    const user = {
        ...event?.user,
        clientID: event?.client?.client_id,
    };

    _.forEach(user.identities, i => delete (i.userId));

    return user;
}

function diffAndCallApi(initialUser, user, initialContext, context, api) {

    // -- PrimaryUserId --
    if (context?.primaryUser) {
        api.authentication.setPrimaryUserId(context.primaryUser);
    }

    // -- Access Token -- (claims and scopes)
    _.forEach(context?.accessToken, (v, k) => api.accessToken.setCustomClaim(k, v));
    // todo: diff scopes and call addScope() && removeScope()

    // -- ID Token --
    _.forEach(context?.idToken, (v, k) => api.idToken.setCustomClaim(k, v));

    // -- Redirection --
    if (context?.redirect?.url) {
        // TODO: we should be in post-login and not continue
        api.redirect.sendUserTo(context.redirect.url);
    }

    // -- SAML --


}

exports.execute = (rules, params) => {
    const {
        event,
        api
    } = params;

    const clonedEvent = _.cloneDeep(event);

    const initialContext = mapToContext(clonedEvent);
    const initialUser = mapToUser(clonedEvent);

    const context = _.cloneDeep(initialContext);
    const user = _.cloneDeep(initialUser);

    // noinspection JSUnusedLocalSymbols
    // eslint-disable-next-line no-unused-vars
    const global = {};

    async.waterfall([
        function (callback) {
            callback(null, user, context);
        },
        ...rules
    ], function (err, result) {
        if (err) {
            api.access.deny(err);
            return;
        }

        diffAndCallApi(initialUser, user, initialContext, context, api);
    });
};

