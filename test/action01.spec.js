const {describe, it} = require('@jest/globals');
const {jest: _jest} = require('@jest/globals');


describe('simple-mapping', () => {
    it('should map event to context and user', async () => {

        // Mock event and API objects
        const mockEvent = {
            transaction: {
                protocol: 'oidc-protocol',
                id: 'tx-id'
            },
            connection: {
                strategy: 'custom-strategy',
            },
            user: {
                identities: [],
                email: 'test@example.com',
            },
            client: {
                client_id: 'testClientId',
            },
            secrets: {
                domain: 'test.auth0.com',
            },
        };

        const mockApi = {
            redirect: {
                sendUserTo: _jest.fn(),
            },
            access: {
                deny: _jest.fn(),
            }
        };

        const {onExecutePostLogin} = require('./action01');

        await onExecutePostLogin(mockEvent, mockApi);

    });
});
