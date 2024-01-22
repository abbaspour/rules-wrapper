const wrapper = require('../src/rules-wrapper');

const {
    expect,
    describe,
    it,
    jest: _jest
} = require('@jest/globals');

describe('handle custom claims', () => {
    it('should call setCustomClaim for all custom claims', () => {

        const event = {};
        const api = {
            accessToken: {
                setCustomClaim: _jest.fn()
            }
        };

        function rule(user, context, callback) {
            context.accessToken['k1'] = 'v1';
            context.accessToken['https://k2'] = 'v2';
            callback(null);
        }

        wrapper.execute([rule], {
            event,
            api
        });

        expect(api.accessToken.setCustomClaim).toHaveBeenCalledTimes(2);
        expect(api.accessToken.setCustomClaim).toHaveBeenNthCalledWith(1, 'k1', 'v1');
        expect(api.accessToken.setCustomClaim).toHaveBeenNthCalledWith(2, 'https://k2', 'v2');

    });

    it('should alter scopes based on requested_scopes from front channel', () => {
        const event = {
            transaction: {
                requested_scopes: ['s1', 's2'],
            },
        };
        const api = {
            accessToken: {
                addScope: _jest.fn(),
                removeScope: _jest.fn()
            }
        };

        function rule(user, context, callback) {
            context.accessToken.scope = 's1 s3';
            callback(null);
        }

        wrapper.execute([rule], {
            event,
            api
        });

        expect(api.accessToken.addScope).toHaveBeenCalledWith('s3');
        expect(api.accessToken.removeScope).toHaveBeenCalledWith('s2');

    });

    it('should alter scopes based on request.body from back channel', () => {
        const event = {
            transaction: {
                protocol: 'oauth2-password'
            },
            request: {
                body: {
                    scope: 's1 s2'
                }
            }
        };

        const api = {
            accessToken: {
                addScope: _jest.fn(),
                removeScope: _jest.fn()
            }
        };

        function rule(user, context, callback) {
            context.accessToken.scope = 's1 s3';
            callback(null);
        }

        wrapper.execute([rule], {
            event,
            api
        });

        expect(api.accessToken.addScope).toHaveBeenCalledWith('s3');
        expect(api.accessToken.removeScope).toHaveBeenCalledWith('s2');

    });

});
