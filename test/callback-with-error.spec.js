const wrapper = require('../src/rules-wrapper');

const {
    expect,
    describe,
    it,
    beforeEach,
    jest: _jest
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

describe('simple-mapping', () => {

    it('should map event to context and user', async () => {
        const mockEvent = {
            transaction: {
                protocol: 'oidc-protocol',
                id: 'tx-id'
            },
            connection: {
                strategy: 'custom-strategy',
            },
            user: {
                identities: [],
                email: 'test@example.com',
            },
            client: {
                client_id: 'testClientId',
            },
            secrets: {
                domain: 'test.auth0.com',
            },
        };

        const mockApi = {
            redirect: {
                sendUserTo: _jest.fn(),
            },
            access: {
                deny: _jest.fn(),
            },
            cache
        };

        const {onExecutePostLogin} = require('./action01');
        await onExecutePostLogin(mockEvent, mockApi);
    });

    it('should call api.access.deny on callback error', async () => {
        const mockEvent = {
            transaction: {
                protocol: 'oidc-protocol',
                id: 'tx-id'
            },
            connection: {
                strategy: 'custom-strategy',
            },
            user: {
                identities: [],
                email: 'test@example.com',
            },
            client: {
                client_id: 'testClientId',
            },
            secrets: {
                domain: 'test.auth0.com',
            },
        };

        const mockApi = {
            redirect: {
                sendUserTo: _jest.fn(),
            },
            access: {
                deny: _jest.fn(),
            },
            cache
        };

        function rule(user, context, callback) {
            callback('error');
        }

        await wrapper.execute([rule], {
            event: mockEvent,
            api: mockApi
        });

        expect(mockApi.access.deny).toBeCalledWith('error');
    });
});

