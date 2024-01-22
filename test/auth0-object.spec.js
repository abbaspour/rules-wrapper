const wrapper = require('../src/rules-wrapper');

const {
    expect,
    describe,
    it,
    jest: _jest,
    beforeEach,
} = require('@jest/globals');

const AuthenticationClient = _jest.fn().mockImplementation((domain, clientId, clientSecret) => {
    return {
        oauth: {
            clientCredentialsGrant: _jest.fn().mockImplementation((audience) => {
                return {
                    data: {
                        access_token: `mock-access-token => domain: ${domain}, clientId: ${clientId}, clientSecret: ${clientSecret ? clientSecret.replace(/./g, 'x') : 'xxx'}, audience: ${audience}`,
                        expires_in: 86400
                    }
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


describe('support auth0 embedded object', () => {
    it('have auth0 object with valid access_token', async () => {
        const event = {
            secrets: {
                domain: 'my-auth0-domain.auth0.com',
                clientId: 'c1',
                clientSecret: 'sssss'
            }
        };

        const api = {cache};

        function rule(u, ctx, cb) {
            console.log(`${JSON.stringify(auth0)}`);
            expect(auth0.accessToken).not.toBeNull();
            expect(auth0.baseUrl).toBe('https://my-auth0-domain.auth0.com/api/v2');
            expect(auth0.domain).toBe('my-auth0-domain.auth0.com');
        }

        await wrapper.execute([rule], {event, api});

    });

});