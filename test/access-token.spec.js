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
            samlResponse: {
                setSignatureAlgorithm: _jest.fn(),
                setDigestAlgorithm: _jest.fn(),
                setNameIdentifierProbes: _jest.fn(),
                setLifetimeInSeconds: _jest.fn(),
            }
        };

        function rule(user, context, callback) {
            context.samlConfiguration.signatureAlgorithm = 'sa';
            context.samlConfiguration.digestAlgorithm = 'da';
            context.samlConfiguration.nameIdentifierProbes = ['na1', 'na2'];
            context.samlConfiguration.lifetimeInSeconds = 3600;
            callback(null);
        }

        wrapper.execute([rule], {event, api});

        expect(api.samlResponse.setSignatureAlgorithm).toHaveBeenCalledWith('sa');
        expect(api.samlResponse.setDigestAlgorithm).toHaveBeenCalledWith('da');
        expect(api.samlResponse.setNameIdentifierProbes).toHaveBeenCalledWith(['na1', 'na2']);
        expect(api.samlResponse.setLifetimeInSeconds).toHaveBeenCalledWith(3600);

    });
});
