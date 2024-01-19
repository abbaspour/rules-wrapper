/* eslint-disable */
const async = require('async');

const isNotEmpty = (o) => o && Object.keys(o).length > 0;

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

    if (isNotEmpty(event?.secrets)) {
        context.configuration = event.secrets;
    }

    context?.authentication?.methods.forEach(m => {
        m.timestamp = new Date(m.timestamp).valueOf();
    });

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

    user?.identities?.forEach(i => delete (i.userId));

    return user;
}

function diffAndCallApi(user, context, api) {

    // -- PrimaryUserId --
    if (context?.primaryUser) {
        api.authentication.setPrimaryUserId(context.primaryUser);
    }

    // -- Access Token -- (claims and scopes)
    Object.entries(context?.accessToken)?.forEach(e => api.accessToken.setCustomClaim(e[0], e[1]));
    // todo: diff scopes and call addScope() && removeScope()

    // -- ID Token --
    Object.entries(context?.idToken)?.forEach(e => api.idToken.setCustomClaim(e[0], e[1]));

    // -- Redirection --
    if (context?.redirect?.url) {
        // TODO: we should be in post-login and not continue
        api.redirect.sendUserTo(context.redirect.url);
    }

    // -- SAML --
    if (context.samlConfiguration.signatureAlgorithm) {
        console.log(`api.samlResponse.setSignatureAlgorithm(${context.samlConfiguration.signatureAlgorithm})`);
        api.samlResponse.setSignatureAlgorithm(context.samlConfiguration.signatureAlgorithm);
    }

}

function wrap(rules) {
    return rules.map((r, i) => (user, context, callback) => {
        try {
            r(user, context, (err) => {
                    if (err) {
                        console.log(`error returned from rule[${i}]: ${JSON.stringify(err)}`);
                        callback(err);
                    } else {
                        callback(null, user, context);
                    }
                }
            );
        } catch (e) {
            callback(e);
        }
    });
}

exports.execute = (rules, params) => {
    const {
        event,
        api,
        onContinue = false
    } = params;

    const _event = structuredClone(event);

    const context = mapToContext(_event);
    const user = mapToUser(_event);

    if (onContinue) context.protocol = 'redirect-callback';

    // eslint-disable-next-line no-unused-vars
    // noinspection JSUnusedLocalSymbols,DuplicatedCode
    const global = {};

    async.waterfall([
        function (callback) {
            callback(null, user, context);
        },
        //...rules
        ...wrap(rules)
    ], function (err, user, context) {
        if (err) {
            console.log(`received error in final callback: ${err}, ${JSON.stringify(err)}`);
            api.access.deny(err);
            return;
        }

        diffAndCallApi(user, context, api);
    });
};

