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

describe('handle redirects', () => {
    it('should call sendUserTo when context.redirect.url is set', async () => {

        const event = {};
        const api = {
            redirect: {
                sendUserTo: _jest.fn()
            },
            cache
        };

        function rule(user, context, callback) {
            context.redirect = {
                url: 'https://example.com'
            };
            callback(null);
        }

        await wrapper.execute([rule], {
            event,
            api
        });

        expect(api.redirect.sendUserTo).toHaveBeenCalledWith('https://example.com');

    });

});
