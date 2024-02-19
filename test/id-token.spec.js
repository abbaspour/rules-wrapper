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

describe('handle custom claims', () => {
    it('should call setCustomClaim for all custom claims', async () => {

        const event = {};
        const api = {
            idToken: {
                setCustomClaim: _jest.fn()
            },
            cache
        };

        function rule(user, context, callback) {
            context.idToken['k1'] = 'v1';
            context.idToken['https://k2'] = 'v2';
            callback(null);
        }

        await wrapper.execute([rule], {
            event,
            api
        });

        expect(api.idToken.setCustomClaim).toHaveBeenCalledTimes(2);
        expect(api.idToken.setCustomClaim).toHaveBeenNthCalledWith(1, 'k1', 'v1');
        expect(api.idToken.setCustomClaim).toHaveBeenNthCalledWith(2, 'https://k2', 'v2');

    });
});
