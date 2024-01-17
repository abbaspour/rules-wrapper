const wrapper = require('../src/rules-wrapper');

const {
    expect,
    describe,
    it,
    jest: _jest
} = require('@jest/globals');

describe('handle multiple rules', () => {
    it('should changes to user object to reflect in the next rule', () => {

        const event = {
            user: {
                email: 'user@example.com'
            }
        };
        const api = {
            accessToken: {
                setCustomClaim: _jest.fn()
            }
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

        wrapper.execute([rule1, rule2], {
            event,
            api
        });
    });

    it('should not call second rule if first one returns error on callback', () => {

        const event = {
            user: {
                email: 'user@example.com'
            }
        };
        const api = {
            access: {
                deny: _jest.fn()
            }
        };

        const rule2 = _jest.fn();

        const rule1 = (user, context, callback) => {
            user.x = 'y';
            callback('some-error');
        };

        wrapper.execute([rule1, rule2], {
            event,
            api
        });

        expect(api.access.deny).toBeCalledWith('some-error');
        expect(rule2).not.toBeCalled();
    });

    it('should not call second rule if first one throws error', () => {

        const event = {
            user: {
                email: 'user@example.com'
            }
        };
        const api = {
            access: {
                deny: _jest.fn()
            }
        };

        const rule2 = _jest.fn();

        const rule1 = (user, context, callback) => {
            throw 'exception';
        };

        wrapper.execute([rule1, rule2], {
            event,
            api
        });

        expect(api.access.deny).toBeCalledWith('exception');
        expect(rule2).not.toBeCalled();
    });

});
