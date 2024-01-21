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
                setAudience: _jest.fn(),
                setRecipient: _jest.fn(),
                setCreateUpnClaim: _jest.fn(),
                setPassthroughClaimsWithNoMapping: _jest.fn(),
                setMapUnknownClaimsAsIs: _jest.fn(),
                setMapIdentities: _jest.fn(),
                setSignatureAlgorithm: _jest.fn(),
                setDigestAlgorithm: _jest.fn(),
                setNameIdentifierProbes: _jest.fn(),
                setLifetimeInSeconds: _jest.fn(),
            }
        };

        function rule(user, context, callback) {
            context.samlConfiguration.audience = 'audience';
            context.samlConfiguration.recipient = 'recipient';
            context.samlConfiguration.createUpnClaim = true;
            context.samlConfiguration.passthroughClaimsWithNoMapping = true;
            context.samlConfiguration.mapUnknownClaimsAsIs = true;
            context.samlConfiguration.mapIdentities = true;
            context.samlConfiguration.signatureAlgorithm = 'sa';
            context.samlConfiguration.digestAlgorithm = 'da';
            context.samlConfiguration.nameIdentifierProbes = ['na1', 'na2'];
            context.samlConfiguration.lifetimeInSeconds = 3600;
            callback(null);
        }

        wrapper.execute([rule], {
            event,
            api
        });

        expect(api.samlResponse.setAudience).toHaveBeenCalledWith('audience');
        expect(api.samlResponse.setRecipient).toHaveBeenCalledWith('recipient');
        expect(api.samlResponse.setCreateUpnClaim).toHaveBeenCalledWith(true);
        expect(api.samlResponse.setPassthroughClaimsWithNoMapping).toHaveBeenCalledWith(true);
        expect(api.samlResponse.setMapUnknownClaimsAsIs).toHaveBeenCalledWith(true);
        expect(api.samlResponse.setMapIdentities).toHaveBeenCalledWith(true);
        expect(api.samlResponse.setSignatureAlgorithm).toHaveBeenCalledWith('sa');
        expect(api.samlResponse.setDigestAlgorithm).toHaveBeenCalledWith('da');
        expect(api.samlResponse.setNameIdentifierProbes).toHaveBeenCalledWith(['na1', 'na2']);
        expect(api.samlResponse.setLifetimeInSeconds).toHaveBeenCalledWith(3600);

    });
});
