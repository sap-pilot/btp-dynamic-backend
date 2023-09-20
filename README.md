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


## Learn More

Learn more at https://cap.cloud.sap/docs/get-started/.
