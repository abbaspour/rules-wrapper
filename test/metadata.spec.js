const wrapper = require('../src/rules-wrapper');

const {
    expect,
    describe,
    it,
    jest: _jest
} = require('@jest/globals');

describe('auth0.users metadata api', () => {
    it('should record all app metadata changes for current user', () => {

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
            }
        };

        function rule(user, context, callback) {
            auth0.users.updateAppMetadata('abc', {'k1': 'v1'});
            auth0.users.updateAppMetadata('u123', {'k2': 'v2'});
            callback(null);
        }

        wrapper.execute([rule], {
            event,
            api
        });

        expect(api.user.setAppMetadata).toHaveBeenCalledTimes(1);
        expect(api.user.setAppMetadata).toHaveBeenCalledWith('k2', 'v2');

    });


    it('should record all user metadata changes for current user', () => {

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
            }
        };

        function rule(user, context, callback) {
            auth0.users.updateUserMetadata('abc', {'k1': 'v1'});
            auth0.users.updateUserMetadata('u123', {'k2': 'v2'});
            callback(null);
        }

        wrapper.execute([rule], {
            event,
            api
        });

        expect(api.user.setUserMetadata).toHaveBeenCalledTimes(1);
        expect(api.user.setUserMetadata).toHaveBeenCalledWith('k2', 'v2');

    });
});
