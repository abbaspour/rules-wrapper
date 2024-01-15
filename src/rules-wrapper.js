const async = require('async');
const _ = require('lodash');

function mapToContext(event) {
    // TODO: camelCase to snake_case
    const context = {
        riskAssessment: event?.authentication?.riskAssessment,
        request: event?.request,
        authorization: event?.authorization,
        authentication: event?.authentication,
        stats: event?.stats,
        connectionID: event?.connection.id,
        connectionMetadata: event?.connection?.metadata,
        connection: event?.connection?.name,
        connectionStrategy: event?.connection?.strategy,
        clientID: event?.client?.client_id,
        clientName: event?.client?.name,
        clientMetadata: event?.client?.metadata,
        tenant: event?.tenant?.id,
        protocol: event?.transaction?.protocol,
        locale: event?.transaction?.locale,
        configuration: event?.secrets,
        // TBC
        jwtConfiguration: {},
        sso: {},
        // placeholder for api
        accessToken: {},
        idToken: {},
        samlConfiguration: {},
        multifactor: {},
        redirect: {}
    };

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
    return {
        ...event?.user,
        clientID: event?.client?.client_id,
        app_metadata: {},
        user_metadata: {}
    };
}

function callApi(result, params) {
    // TODO
}

exports.execute = (rules, params) => {
    const {event, api} = params;

    const clonedEvent = _.cloneDeep(event);

    const context = mapToContext(clonedEvent);
    const user = mapToUser(clonedEvent);

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

        callApi(result, params);
    });
};

