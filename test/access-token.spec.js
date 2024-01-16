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

        wrapper.execute([rule], {event, api});

        expect(api.accessToken.setCustomClaim).toHaveBeenCalledTimes(2);
        expect(api.accessToken.setCustomClaim).toHaveBeenNthCalledWith(1, 'k1', 'v1');
        expect(api.accessToken.setCustomClaim).toHaveBeenNthCalledWith(2, 'https://k2', 'v2');

    });

    // TODO: scopes alteration tests
});
