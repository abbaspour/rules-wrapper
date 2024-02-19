const wrapper = require('../src/rules-wrapper');

const {
    expect,
    describe,
    it,
    jest: _jest,
    beforeEach
} = require('@jest/globals');

const AuthenticationClient = _jest.fn().mockImplementation((domain, clientId, clientSecret) => {
    return {
        oauth: {
            clientCredentialsGrant: _jest.fn().mockImplementation((audience) => {
                return {
                    access_token: `mock-access-token => domain: ${domain}, clientId: ${clientId}, clientSecret: ${clientSecret ? clientSecret.replace(/./g, 'x') : 'xxx'}, audience: ${audience}`,
                    expires_in: 86400
                };
            })
        }
    };
});

beforeEach(() => {
    _jest.resetModules();

    _jest.mock('auth0', () => {
        return {AuthenticationClient};
    });
});

const cache = {
    get: _jest.fn().mockImplementation(() => {
        return 'token';
    }),
    set: _jest.fn()
};

describe('handle MFA', () => {

    it('should enable MFA allowRememberBrowser false', async () => {

        const event = {};
        const api = {
            multifactor: {
                enable: _jest.fn(),
            },
            cache
        };

        function rule(user, context, callback) {
            context.multifactor = {
                provider: 'any',
                allowRememberBrowser: false,
            };
            callback(null);
        }

        await wrapper.execute([rule], {
            event,
            api
        });

        expect(api.multifactor.enable).toHaveBeenCalledWith('any', {allowRememberBrowser: false});
    });


    it('should enable MFA allowRememberBrowser true', async () => {

        const event = {};
        const api = {
            multifactor: {
                enable: _jest.fn(),
            },
            cache
        };

        function rule(user, context, callback) {
            context.multifactor = {
                provider: 'any'
            };
            callback(null);
        }

        await wrapper.execute([rule], {
            event,
            api
        });

        expect(api.multifactor.enable).toHaveBeenCalledWith('any', {allowRememberBrowser: true});
    });

});
