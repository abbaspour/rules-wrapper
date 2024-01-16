const wrapper = require('../src/rules-wrapper');

const {expect, describe, it, beforeEach, jest: _jest} = require('@jest/globals');

describe('simple-mapping', () => {

    let mockEvent;
    let mockApi;

    beforeEach(() => {
        // Reset the mocks before each test
        _jest.resetAllMocks();

        // Mock event and API objects
        mockEvent = {
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

        mockApi = {
            redirect: {
                sendUserTo: _jest.fn(),
            },
            access: {
                deny: _jest.fn(),
            }
        };
    });

    it('should map event to context and user', async () => {
        const {onExecutePostLogin} = require('./action01');
        await onExecutePostLogin(mockEvent, mockApi);
    });

    it('should call api.access.deny on callback error', async () => {
        function rule(user, context, callback) {
            callback('error');
        }

        wrapper.execute([rule], {event: mockEvent, api: mockApi});

        expect(mockApi.access.deny).toBeCalledWith('error');
    });
});

