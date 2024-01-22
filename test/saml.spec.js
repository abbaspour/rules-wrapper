const wrapper = require('../src/rules-wrapper');

const {
    expect,
    describe,
    it,
    jest: _jest
} = require('@jest/globals');

describe('handle custom claims', () => {

    const testSigningCert = '-----BEGIN CERTIFICATE-----\nMIIC8jCCAdqgAwIBAgIJObB6jmhG0QIEMA0GCSqGSIb3DQEBBQUAMCAxHjAcBgNV\n[..all the other lines..]-----END CERTIFICATE-----\n';

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
                setSignResponse: _jest.fn(),
                setNameIdentifierFormat: _jest.fn(),
                setSignatureAlgorithm: _jest.fn(),
                setDigestAlgorithm: _jest.fn(),
                setDestination: _jest.fn(),
                setNameIdentifierProbes: _jest.fn(),
                setAuthnContextClassRef: _jest.fn(),
                setIncludeAttributeNameFormat: _jest.fn(),
                setTypedAttributes: _jest.fn(),
                setLifetimeInSeconds: _jest.fn(),
                setSigningCert: _jest.fn(),
            }
        };

        function rule(user, context, callback) {
            context.samlConfiguration.audience = 'audience';
            context.samlConfiguration.recipient = 'recipient';
            context.samlConfiguration.createUpnClaim = true;
            context.samlConfiguration.passthroughClaimsWithNoMapping = true;
            context.samlConfiguration.mapUnknownClaimsAsIs = true;
            context.samlConfiguration.mapIdentities = true;
            context.samlConfiguration.signResponse = true;
            context.samlConfiguration.nameIdentifierFormat = 'urn:oasis:names:tc:SAML:1.1:nameid-format:myformat';
            context.samlConfiguration.signatureAlgorithm = 'sa';
            context.samlConfiguration.digestAlgorithm = 'da';
            context.samlConfiguration.destination = 'destination';
            context.samlConfiguration.nameIdentifierProbes = ['na1', 'na2'];
            context.samlConfiguration.authnContextClassRef = 'urn:oasis:names:tc:SAML:2.0:ac:classes:myref';
            context.samlConfiguration.includeAttributeNameFormat = true;
            context.samlConfiguration.typedAttributes = true;
            context.samlConfiguration.lifetimeInSeconds = 3600;
            context.samlConfiguration.signingCert = testSigningCert;
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
        expect(api.samlResponse.setSignResponse).toHaveBeenCalledWith(true);
        expect(api.samlResponse.setNameIdentifierFormat).toHaveBeenCalledWith('urn:oasis:names:tc:SAML:1.1:nameid-format:myformat');
        expect(api.samlResponse.setSignatureAlgorithm).toHaveBeenCalledWith('sa');
        expect(api.samlResponse.setDigestAlgorithm).toHaveBeenCalledWith('da');
        expect(api.samlResponse.setDestination).toHaveBeenCalledWith('destination');
        expect(api.samlResponse.setNameIdentifierProbes).toHaveBeenCalledWith(['na1', 'na2']);
        expect(api.samlResponse.setAuthnContextClassRef).toHaveBeenCalledWith('urn:oasis:names:tc:SAML:2.0:ac:classes:myref');
        expect(api.samlResponse.setIncludeAttributeNameFormat).toHaveBeenCalledWith(true);
        expect(api.samlResponse.setTypedAttributes).toHaveBeenCalledWith(true);
        expect(api.samlResponse.setLifetimeInSeconds).toHaveBeenCalledWith(3600);
        expect(api.samlResponse.setSigningCert).toHaveBeenCalledWith(testSigningCert);

    });
});
