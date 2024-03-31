window["optimizelyDatafile"] = {"groups": [], "environmentKey": "production", "rollouts": [], "typedAudiences": [{"id": "20156923661", "conditions": ["and", ["or", ["or", {"value": "free", "type": "custom_attribute", "name": "current_tenant_tier", "match": "exact"}]], ["or", ["or", {"value": "owner", "type": "custom_attribute", "name": "roles", "match": "substring"}]]], "name": "Free Tenant \"Owners\""}], "projectId": "19308461948", "variables": [], "featureFlags": [], "experiments": [{"status": "Running", "audienceConditions": ["or", "20156923661"], "audienceIds": ["20156923661"], "variations": [{"variables": [], "id": "20176455044", "key": "control"}, {"variables": [], "id": "20185633131", "key": "variation"}], "id": "20178731193", "key": "aa-experiment", "layerId": "20183363974", "trafficAllocation": [{"entityId": "20176455044", "endOfRange": 2300}, {"entityId": "20185633131", "endOfRange": 5000}, {"entityId": "20185633131", "endOfRange": 10000}], "forcedVariations": {}}], "version": "4", "audiences": [{"id": "20156923661", "conditions": "[\"or\", {\"match\": \"exact\", \"name\": \"$opt_dummy_attribute\", \"type\": \"custom_attribute\", \"value\": \"$opt_dummy_value\"}]", "name": "Free Tenant \"Owners\""}, {"conditions": "[\"or\", {\"match\": \"exact\", \"name\": \"$opt_dummy_attribute\", \"type\": \"custom_attribute\", \"value\": \"$opt_dummy_value\"}]", "id": "$opt_dummy_audience", "name": "Optimizely-Generated Audience for Backwards Compatibility"}], "anonymizeIP": true, "sdkKey": "9Y7Th7LPPZzQ7rYGxaZbz", "attributes": [{"id": "20152815289", "key": "current_tenant_locality"}, {"id": "20168474121", "key": "created_at"}, {"id": "20170905465", "key": "environment"}, {"id": "20178721271", "key": "current_tenant_name"}, {"id": "20183363968", "key": "current_tenant_is_trial"}, {"id": "20187394693", "key": "roles"}, {"id": "20189364015", "key": "current_tenant_tier"}, {"id": "20190964114", "key": "current_tenant_created_at"}, {"id": "20197251999", "key": "current_tenant_region"}], "botFiltering": false, "accountId": "17870831401", "events": [{"experimentIds": ["20178731193"], "id": "20166853179", "key": "optimizely-test-event"}, {"experimentIds": [], "id": "20289635460", "key": "super-cool-event"}, {"experimentIds": [], "id": "20506607317", "key": "b2b-vs-b2c_total-revenue"}, {"experimentIds": [], "id": "20524531481", "key": "b2b-vs-b2c_clickb2b"}, {"experimentIds": [], "id": "20539521763", "key": "b2b-vs-b2c_clickb2e"}, {"experimentIds": [], "id": "20539740804", "key": "b2b-vs-b2c_b2e-conversions"}, {"experimentIds": [], "id": "20545660969", "key": "b2b-vs-b2c_clickb2c"}, {"experimentIds": [], "id": "20555671320", "key": "b2b-vs-b2c_b2b-conversions"}, {"experimentIds": [], "id": "20572960103", "key": "b2b-vs-b2c_b2c-conversions"}], "revision": "104"}