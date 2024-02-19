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

describe('handle multiple rules', () => {
    it('should changes to user object to reflect in the next rule', async () => {

        const event = {
            user: {
                email: 'user@example.com'
            }
        };
        const api = {
            accessToken: {
                setCustomClaim: _jest.fn()
            },
            cache
        };

        const rule1 = (user, context, callback) => {
            //console.log(`rule 1 => user: ${JSON.stringify(user)}, context: ${JSON.stringify(context)}}`);
            user.x = 'y';
            callback(null);
        };

        const rule2 = (user, context, callback) => {
            //console.log(`rule 2 => user: ${JSON.stringify(user)}, context: ${JSON.stringify(context)}}`);
            expect(user.x).toBe('y');
            callback(null);
        };

        await wrapper.execute([rule1, rule2], {
            event,
            api
        });
    });

    it('should not call second rule if first one returns error on callback', async () => {

        const event = {
            user: {
                email: 'user@example.com'
            }
        };
        const api = {
            access: {
                deny: _jest.fn()
            },
            cache
        };

        const rule2 = _jest.fn();

        const rule1 = (user, context, callback) => {
            user.x = 'y';
            callback('some-error');
        };

        try {
            await wrapper.execute([rule1, rule2], {
                event,
                api
            });
        } catch (e) {

        }

        expect(api.access.deny).toBeCalledWith('some-error');
        expect(rule2).not.toBeCalled();
    });

    it('should not call second rule if first one throws error', async () => {

        const event = {
            user: {
                email: 'user@example.com'
            }
        };
        const api = {
            access: {
                deny: _jest.fn()
            },
            cache
        };

        const rule1 = (user, context, callback) => {
            throw 'exception';
        };

        const rule2 = _jest.fn();

        await wrapper.execute([rule1, rule2], {
            event,
            api
        });

        expect(api.access.deny).toBeCalledWith('exception');
        expect(rule2).not.toBeCalled();
    });

});


describe('global object', () => {
    it('read and write global object', async () => {
        const event = {
            user: {
                email: 'user@example.com'
            }
        };
        const api = {
            access: {
                deny: _jest.fn()
            },
            cache
        };

        const rule1 = (user, context, callback) => {
            global.x = 'y';
            global.f = _jest.fn();
            return callback(null, user, context);
        };

        const rule2 = (user, context, callback) => {
            expect(global.x).toBe('y');
            global.f('param');
            expect(global.f).toBeCalledWith('param');
            return callback(null, user, context);
        };

        await wrapper.execute([rule1, rule2], {
            event,
            api
        });
    });
});