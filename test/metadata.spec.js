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

describe('auth0.users metadata api', () => {
    it('should record all app metadata changes for current user', async () => {

        const event = {
            user: {
                user_id: 'u123'
            }
        };
        const api = {
            user: {
                setAppMetadata: _jest.fn()
            },
            access: {
                deny: (e) => console.log(e)
            },
            cache
        };

        function rule(user, context, callback) {
            auth0.users.updateAppMetadata('abc', {'k1': 'v1'});
            auth0.users.updateAppMetadata('u123', {'k2': 'v2'});
            callback(null);
        }

        await wrapper.execute([rule], {
            event,
            api
        });

        expect(api.user.setAppMetadata).toHaveBeenCalledTimes(1);
        expect(api.user.setAppMetadata).toHaveBeenCalledWith('k2', 'v2');

    });


    it('should record all user metadata changes for current user', async () => {

        const event = {
            user: {
                user_id: 'u123'
            }
        };
        const api = {
            user: {
                setUserMetadata: _jest.fn()
            },
            access: {
                deny: (e) => console.log(e)
            },
            cache
        };

        function rule(user, context, callback) {
            auth0.users.updateUserMetadata('abc', {'k1': 'v1'});
            auth0.users.updateUserMetadata('u123', {'k2': 'v2'});
            callback(null);
        }

        await wrapper.execute([rule], {
            event,
            api
        });

        expect(api.user.setUserMetadata).toHaveBeenCalledTimes(1);
        expect(api.user.setUserMetadata).toHaveBeenCalledWith('k2', 'v2');

    });
});
