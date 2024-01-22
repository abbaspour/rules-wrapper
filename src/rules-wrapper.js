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
        // TODO redirect: {},
        app_metadata_change_record: [],
        user_metadata_change_record: []
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

function diffAndCallApi(event, user, context, auth0, api) {

    // -- PrimaryUserId --
    if (context?.primaryUser) {
        api.authentication.setPrimaryUserId(context.primaryUser);
    }

    // -- Access Token -- (claims)
    Object.entries(context?.accessToken)?.forEach(([key, value]) => key !== 'scope' && api.accessToken.setCustomClaim(key, value));

    // -- Access Token -- (scopes)
    if (context.accessToken.scope) {
        let requested_scopes = event?.transaction?.requested_scopes; // array
        if (!requested_scopes) {
            if (event?.request?.body?.scope) { // for ROPG
                requested_scopes = event.request.body.scope.split(' ');
            }
        }
        const rules_altered_scopes = context.accessToken.scope.split(' '); // string -> array

        const removed_scopes = requested_scopes.filter(s => !rules_altered_scopes.includes(s));
        const added_scopes = rules_altered_scopes.filter(s => !requested_scopes.includes(s));

        added_scopes.forEach(s => api.accessToken.addScope(s));
        removed_scopes.forEach(s => api.accessToken.removeScope(s));
    }

    // -- ID Token --
    Object.entries(context?.idToken)?.forEach(([key, value]) => api.idToken.setCustomClaim(key, value));

    // -- Redirection --
    if (context?.redirect?.url) {
        // TODO: we should be in post-login and not continue
        api.redirect.sendUserTo(context.redirect.url);
    }

    // -- MFA --
    if (context?.multifactor) {
        const {
            provider,
            allowRememberBrowser = true
        } = context.multifactor;
        if (provider === 'any') // only allowed value in Rules
            api.multifactor.enable('any', {allowRememberBrowser});
    }

    // -- Metadata --
    for (const r of context.app_metadata_change_record)
        Object.entries(r).forEach(([name, value]) => api.user.setAppMetadata(name, value));


    for (const r of context.user_metadata_change_record)
        Object.entries(r).forEach(([name, value]) => api.user.setUserMetadata(name, value));

    // -- SAML --
    // context https://auth0.com/docs/authenticate/protocols/saml/saml-configuration/customize-saml-assertions
    // api https://auth0.com/docs/customize/actions/flows-and-triggers/login-flow/api-object

    if (context.samlConfiguration.audience) {
        api.samlResponse.setAudience(context.samlConfiguration.audience);
    }

    if (context.samlConfiguration.recipient) {
        api.samlResponse.setRecipient(context.samlConfiguration.recipient);
    }

    /*
    if (context.samlConfiguration.issuer) {
        api.samlResponse.setIssuer(context.samlConfiguration.issuer);
    }
    */
    if (context.samlConfiguration.createUpnClaim) {
        api.samlResponse.setCreateUpnClaim(context.samlConfiguration.createUpnClaim);
    }

    if (context.samlConfiguration.passthroughClaimsWithNoMapping) {
        api.samlResponse.setPassthroughClaimsWithNoMapping(context.samlConfiguration.passthroughClaimsWithNoMapping);
    }

    if (context.samlConfiguration.mapUnknownClaimsAsIs) {
        api.samlResponse.setMapUnknownClaimsAsIs(context.samlConfiguration.mapUnknownClaimsAsIs);
    }

    if (context.samlConfiguration.mapIdentities) {
        api.samlResponse.setMapIdentities(context.samlConfiguration.mapIdentities);
    }

    if (context.samlConfiguration.signResponse) {
        api.samlResponse.setSignResponse(context.samlConfiguration.signResponse);
    }

    if (context.samlConfiguration.nameIdentifierFormat) {
        api.samlResponse.setNameIdentifierFormat(context.samlConfiguration.nameIdentifierFormat);
    }


    if (context.samlConfiguration.signatureAlgorithm) {
        api.samlResponse.setSignatureAlgorithm(context.samlConfiguration.signatureAlgorithm);
    }

    if (context.samlConfiguration.digestAlgorithm) {
        api.samlResponse.setDigestAlgorithm(context.samlConfiguration.digestAlgorithm);
    }

    if (context.samlConfiguration.destination) {
        api.samlResponse.setDestination(context.samlConfiguration.destination);
    }

    if (context.samlConfiguration.nameIdentifierProbes) {
        api.samlResponse.setNameIdentifierProbes(context.samlConfiguration.nameIdentifierProbes);
    }

    if (context.samlConfiguration.authnContextClassRef) {
        api.samlResponse.setAuthnContextClassRef(context.samlConfiguration.authnContextClassRef);
    }

    if (context.samlConfiguration.includeAttributeNameFormat) {
        api.samlResponse.setIncludeAttributeNameFormat(context.samlConfiguration.includeAttributeNameFormat);
    }

    if (context.samlConfiguration.typedAttributes) {
        api.samlResponse.setTypedAttributes(context.samlConfiguration.typedAttributes);
    }

    if (context.samlConfiguration.lifetimeInSeconds) {
        api.samlResponse.setLifetimeInSeconds(context.samlConfiguration.lifetimeInSeconds);
    }

    if (context.samlConfiguration.signingCert) {
        api.samlResponse.setSigningCert(context.samlConfiguration.signingCert);
    }

}

function wrap(rules) {
    return rules.map((r, i) => (user, context, callback) => {
        try {
            r(user, context, (err, u, c) => {
                    if (err) {
                        console.log(`error returned from rule "${r.name}" index ${i}: ${r.name}: ${JSON.stringify(err)}`);
                        callback(err);
                    } else {
                        callback(null, u ? u : user, c ? c : context);
                    }
                }
            );
        } catch (e) {
            console.log(`uncaught error from rule "${r.name}" index ${i}: ${e}, ${JSON.stringify(e)}`);
            callback(e);
        }
    });
}

const API2_CACHE_KEY = 'rules-wrapper-api2-token';

async function getApi2AccessToken(event, api) {

    let {value: token} = api.cache.get(API2_CACHE_KEY) || {};

    if (!token) {
        const {AuthenticationClient} = require('auth0');

        const {
            domain,
            clientId,
            clientSecret
        } = event.secrets || {};

        //console.log(domain, clientId);

        const cc = new AuthenticationClient({
            domain,
            clientId,
            clientSecret
        });

        try {
            const {data} = await cc.oauth.clientCredentialsGrant({audience: `https://${domain}/api/v2/`});

            token = data?.access_token;

            if (!token) {
                console.log('failed get api v2 cc token');
                return 'UNABLE-TO-OBTAIN: unknown';
            }
            //console.log('cache MIS for m2m token');

            const result = api.cache.set(API2_CACHE_KEY, token, {ttl: data.expires_in * 1000});

            if (result?.type === 'error') {
                console.log('failed to set the token in the cache with error code', result.code);
                return 'UNABLE-TO-OBTAIN: ' + result;
            }
        } catch (err) {
            console.log('failed calling cc grant', err);
            return 'UNABLE-TO-OBTAIN: ' + err;
        }
    }

    return token;
}

exports.execute = async (rules, params) => {
    const {
        event,
        api,
        onContinue = false
    } = params;

    // console.log(`wrapper received event: ${JSON.stringify(event)}`);

    const _event = structuredClone(event);

    const context = mapToContext(_event);
    const user = mapToUser(_event);

    if (onContinue) context.protocol = 'redirect-callback';

    const domain = event?.secrets?.domain || event.request?.hostname;

    const auth0 = {
        accessToken: await getApi2AccessToken(event, api),
        baseUrl: `https://${domain}/api/v2`,
        domain,
        users: {
            updateAppMetadata: function (user_id, metadata) {
                if (user_id !== _event?.user?.user_id) {
                    console.log(`WARN: updateAppMetadata() for user_id(${user_id}) other than current user (${_event.user.user_id}) is unsupported.`);
                } else {
                    console.log(`adding to updateAppMetadata(${JSON.stringify(metadata)})`);
                    context.app_metadata_change_record.push(metadata);
                }
            },
            updateUserMetadata: function (user_id, metadata) {
                if (user_id !== _event?.user?.user_id) {
                    console.log(`WARN: updateUserMetadata() for user_id(${user_id}) other than current user (${_event.user.user_id}) is unsupported.`);
                } else {
                    console.log(`adding to updateUserMetadata(${metadata})`);
                    context.user_metadata_change_record.push(metadata);
                }
            }
        },
    };

    global.auth0 = auth0;

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

        diffAndCallApi(event, user, context, auth0, api);
    });
};

