const wrapper = require('../src/rules-wrapper');

const {
    expect,
    describe,
    it,
    jest: _jest
} = require('@jest/globals');

describe('handle redirects', () => {
    it('should call sendUserTo when context.redirect.url is set', () => {

        const event = {};
        const api = {
            redirect: {
                sendUserTo: _jest.fn()
            }
        };

        function rule(user, context, callback) {
            context.redirect = {
                url: 'https://example.com'
            };
            callback(null);
        }

        wrapper.execute([rule], {event, api});

        expect(api.redirect.sendUserTo).toHaveBeenCalledWith('https://example.com');

    });

});
