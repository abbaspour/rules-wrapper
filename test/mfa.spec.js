const wrapper = require('../src/rules-wrapper');

const {
    expect,
    describe,
    it,
    jest: _jest
} = require('@jest/globals');

describe('handle MFA', () => {

    it('should enable MFA allowRememberBrowser false', () => {

        const event = {};
        const api = {
            multifactor: {
                enable: _jest.fn(),
            }
        };

        function rule(user, context, callback) {
            context.multifactor = {
                provider: 'any',
                allowRememberBrowser: false,
            };
            callback(null);
        }

        wrapper.execute([rule], {
            event,
            api
        });

        expect(api.multifactor.enable).toHaveBeenCalledWith('any', {allowRememberBrowser: false});
    });


    it('should enable MFA allowRememberBrowser true', () => {

        const event = {};
        const api = {
            multifactor: {
                enable: _jest.fn(),
            }
        };

        function rule(user, context, callback) {
            context.multifactor = {
                provider: 'any'
            };
            callback(null);
        }

        wrapper.execute([rule], {
            event,
            api
        });

        expect(api.multifactor.enable).toHaveBeenCalledWith('any', {allowRememberBrowser: true});
    });

});
