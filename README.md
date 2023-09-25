# Getting Started

BTP sample dynamic backend CAP and UI5 project to support CAP/hub/multi-backend pattern."

## Build and deploy

Run below commands to build and deploy this app
```
cf login
npm install
npm run bd
```

## Run

After successful deployment, run below command to generate default-env.json for local testing:
```
export CF_APP_NAME=BTP-DynamicBackend-srv
npm run gen-env
cds watch
```

Open browser and enter below URL to test destination override via URL parameter "destOverrides" - below query overrides destination API_S4_HTTP_BASIC_CPIUSER with API_S4_HTTP_BASIC_APPDEVUSER 
```
http://localhost:4004/odata/v4/service/risk/Diagnosis?destOverrides=API_S4_HTTP_BASIC_CPIUSER|API_S4_HTTP_BASIC_APPDEVUSER
```
## Limitations

1. **Data persistency** - This sample code is more for "pass through scenarios" - eg: no backend related data persisted in HANA cloud. 
   - For backend related data persistency requirements, consider Multi-tenant (MTE) or addition data seperation design in your CAP app, eg: add a client number to identify/seperate data for multiple backend
2. **Security segregation** - Although the UI can be segrated by Launchpad roles, the CAP service doesn't differenciate users for different backends. 
   - Same as above for CAP service security segregation consider MTE or addition security design (custom attribute etc) 
3. **Security consideration** - For production usage you may want to limit the destinations UI or user can use, for instance by specifying the destinations can be used in ENV variable DEST_OVERRIDE_WHITELIST (check mta.yaml and risk-service.js) so to avoid malacious user switching to ANY destination they want

## Learn More

Learn more at https://cap.cloud.sap/docs/get-started/.
