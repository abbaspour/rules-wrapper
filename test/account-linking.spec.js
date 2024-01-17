const wrapper = require('../src/rules-wrapper');

const {
    expect,
    describe,
    it,
    jest: _jest
} = require('@jest/globals');

describe('simple linking', () => {
    it('should call setPrimaryUserId if context.primaryUser is set', () => {

        const event = {};
        const api = {
            authentication: {
                setPrimaryUserId: _jest.fn()
            }
        };

        function rule(user, context, callback) {
            context.primaryUser = 'abc';
            callback(null);
        }

        wrapper.execute([rule], {event, api});

        expect(api.authentication.setPrimaryUserId).toHaveBeenCalledWith('abc');

    });
});
