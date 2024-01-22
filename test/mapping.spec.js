const wrapper = require('../src/rules-wrapper');

const {
    expect,
    describe,
    it,
    jest: _jest
} = require('@jest/globals');

describe('complex mapping', () => {
    const mockEvent = {
        transaction: {
            acr_values: [],
            id: 'dGA_Pj94DQ3ZKVGtcgp5m5_1LTjBrfoT',
            linking_id: 'vM-sby_rLzut5o-lO6Q2gX7bybE',
            locale: 'en',
            login_hint: null,
            prompt: [],
            protocol: 'oidc-implicit-profile',
            redirect_uri: 'https://jwt.io',
            requested_scopes: ['openid', 'profile', 'email'],
            response_mode: null,
            response_type: ['token', 'id_token'],
            state: null,
            ui_locales: []
        },
        authentication: {
            methods: [{
                name: 'pwd',
                timestamp: '2024-01-14T23:10:37.313Z'
            }],
            riskAssessment: {
                assessments: {
                    ImpossibleTravel: {
                        code: 'location_history_not_found',
                        confidence: 'high'
                    },
                    NewDevice: {
                        code: 'no_device_history',
                        confidence: 'low'
                    },
                    PhoneNumber: {
                        code: 'phone_number_not_provided',
                        confidence: 'neutral'
                    },
                    UntrustedIP: {
                        code: 'not_found_on_deny_list',
                        confidence: 'high'
                    }
                },
                confidence: 'high',
                version: '1'
            }
        },
        authorization: {roles: []},
        connection: {
            id: 'con_UZwhZkh05jv7Gsg0',
            metadata: {},
            name: 'Username-Password-Authentication',
            strategy: 'auth0'
        },
        resource_server: {identifier: 'https://abbaspour.auth0.com/userinfo'},
        tenant: {id: 'abbaspour'},
        secrets: {},
        session: {id: '7wHSq2a_0n83qWJ3R-l1M5_Vu3Bm6cEo'},
        configuration: {},
        client: {
            client_id: 'VJIEWAptlFWokl2pRC2ptswic1jCGoEC',
            name: 'JWT.io',
            metadata: {}
        },
        request: {
            ip: '125.168.130.208',
            method: 'GET',
            query: {
                client_id: 'VJIEWAptlFWokl2pRC2ptswic1jCGoEC',
                nonce: 'mynonce',
                protocol: 'oauth2',
                redirect_uri: 'https://jwt.io',
                response_type: 'token id_token',
                scope: 'openid profile email'
            },
            body: {},
            geoip: {
                cityName: 'Newcastle',
                continentCode: 'OC',
                countryCode3: 'AUS',
                countryCode: 'AU',
                countryName: 'Australia',
                latitude: -32.898,
                longitude: 151.6707,
                subdivisionCode: 'NSW',
                subdivisionName: 'New South Wales',
                timeZone: 'Australia/Sydney'
            },
            hostname: 'abbaspour.auth0.com',
            user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0'
        },
        stats: {logins_count: 35},
        user: {
            crm_customer_id: 1234,
            app_metadata: {crm_customer_id: 1234},
            created_at: '2023-07-10T06:17:30.560Z',
            email_verified: false,
            email: 'amin@okta.com',
            identities: [{
                connection: 'Username-Password-Authentication',
                isSocial: false,
                provider: 'auth0',
                userId: '64aba27a81421100b34f2203',
                user_id: '64aba27a81421100b34f2203'
            }],
            last_password_reset: '2023-12-15T03:20:33.206Z',
            name: 'amin@okta.com',
            nickname: 'amin',
            picture: 'https://s.gravatar.com/avatar/71bcdea6b2cb25634410bb5b7ac09747?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fam.png',
            updated_at: '2024-01-14T23:10:37.307Z',
            user_id: 'auth0|64aba27a81421100b34f2203',
            //user_metadata: {},
            multifactor: ['guardian']
        }
    };

    it('should do complex mapping', () => {

        const expectedUser = {
            // TODO _id: '79b1bf64cc40096ecc8d79172ff4e845',
            clientID: 'VJIEWAptlFWokl2pRC2ptswic1jCGoEC',
            created_at: '2023-07-10T06:17:30.560Z',
            email: 'amin@okta.com',
            email_verified: false,
            identities: [{
                connection: 'Username-Password-Authentication',
                provider: 'auth0',
                user_id: '64aba27a81421100b34f2203',
                isSocial: false
            }],
            name: 'amin@okta.com',
            nickname: 'amin',
            picture: 'https://s.gravatar.com/avatar/71bcdea6b2cb25634410bb5b7ac09747?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fam.png',
            updated_at: '2024-01-14T23:10:37.307Z',
            user_id: 'auth0|64aba27a81421100b34f2203',
            multifactor: ['guardian'],
            // TODO multifactor_last_modified: '2023-12-15T02:52:27.100Z',
            last_password_reset: '2023-12-15T03:20:33.206Z',
            // TODO global_client_id: 'indMoL7Aya109w09tV5Ei4gdTf1DmKL1',
            app_metadata: {crm_customer_id: 1234},
            crm_customer_id: 1234,
            // TODO persistent: {}
        };


        const expectedContext = {
            tenant: 'abbaspour',
            clientID: 'VJIEWAptlFWokl2pRC2ptswic1jCGoEC',
            clientName: 'JWT.io',
            clientMetadata: {},
            connection: 'Username-Password-Authentication',
            connectionStrategy: 'auth0',
            connectionID: 'con_UZwhZkh05jv7Gsg0',
            connectionOptions: {},
            connectionMetadata: {},
            samlConfiguration: {},
            jwtConfiguration: {},
            protocol: 'oidc-implicit-profile',
            stats: {loginsCount: 35},
            //TODO sso: {'with_auth0': false, with_dbconn: false},
            accessToken: {},
            idToken: {},
            authentication: {
                methods: [{
                    name: 'pwd',
                    timestamp: 1705273837313
                }]
            },
            locale: 'en',
            riskAssessment: {
                confidence: 'high',
                version: '1',
                assessments: {
                    UntrustedIP: {
                        confidence: 'high',
                        code: 'not_found_on_deny_list'
                    },
                    NewDevice: {
                        confidence: 'low',
                        code: 'no_device_history'
                    },
                    ImpossibleTravel: {
                        confidence: 'high',
                        code: 'location_history_not_found'
                    },
                    PhoneNumber: {
                        confidence: 'neutral',
                        code: 'phone_number_not_provided'
                    }
                }
            },
            //TODO sessionID: '7wHSq2a_0n83qWJ3R-l1M5_Vu3Bm6cEo',
            //TODO auth0SessionId: '7wHSq2a_0n83qWJ3R-l1M5_Vu3Bm6cEo',
            request: {
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0',
                ip: '125.168.130.208',
                geoip: {
                    country_code: 'AU',
                    'country_code3': 'AUS',
                    country_name: 'Australia',
                    city_name: 'Newcastle',
                    latitude: -32.898,
                    longitude: 151.6707,
                    time_zone: 'Australia/Sydney',
                    continent_code: 'OC',
                    subdivision_code: 'NSW',
                    subdivision_name: 'New South Wales'
                },
                hostname: 'abbaspour.auth0.com',
                method: 'GET',
                query: {
                    protocol: 'oauth2',
                    client_id: 'VJIEWAptlFWokl2pRC2ptswic1jCGoEC',
                    response_type: 'token id_token',
                    nonce: 'mynonce',
                    redirect_uri: 'https://jwt.io',
                    scope: 'openid profile email'
                },
                body: {}
            },
            authorization: {roles: []},
            app_metadata_change_record: [],
            user_metadata_change_record: []
        };

        const mockRule = _jest.fn();

        wrapper.execute([mockRule], {
            event: mockEvent,
            api: {}
        });

        expect(mockRule).toHaveBeenCalledTimes(1);
        expect(mockRule).toHaveBeenCalledWith(expectedUser, expectedContext, expect.anything());
    });

});