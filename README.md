# Getting Started

BTP sample dynamic backend CAP and UI5 project to support CAP/hub/multi-backend pattern.

## How it works

Open this app at the deployed approuter URL for instance: <br />
https://btp-dynamicbackend-cf-aws-use-development-dcore.cfapps.us10.hana.ondemand.com/index.html#Shell-home

![btp-dd-apps.png](/doc/img/btp-dd-apps.png)

If you open **ESH Diagnostics - CPIUSER (DR1)** tile it will show ESH info loaded via API_S4_HTTP_BASIC_CPIUSER destination defined/hardcoded in [package.json](package.json). <br />
![btp-dd-dr1.png](/doc/img/btp-dd-dr1.png)

If you navigate back and open the second tile **ESH Diagnostics - APPDEVUSER (DRU)** browser will navigate to an URL like below with URL parem **destOverrides=API_S4_HTTP_BASIC_CPIUSER|API_S4_HTTP_BASIC_APPDEVUSER** which essentially tells the UI/CAP app to replace CPIUSER destination with APPDEVUSER destination during runtime: <br /> 
![btp-dd-dru.png](/doc/img/btp-dd-dru.png)

You can replace above URL param or create another tile via [/app/flp/appconfig/fioriSandboxConfig.json](/app/flp/appconfig/fioriSandboxConfig.json) to point to other destinations.

**Note:** the target destination must be whitelisted in CAP service "User Provided Variables" so to prevent end-user from pointing the app to arbitrary destinations. the initial whitelist is defined in [mta.yaml](/mta.yaml) -> BTP-DynamicBackend-srv -> properties -> DEST_OVERRIDE_WHITELIST_EXP <br />
![btp-dd-whitelist.png](/doc/img/btp-dd-whitelist.png)

## How to adopt it in your app

### Step 1 - Add npm package @sap-pilot/btp-util to your app

```
npm i @sap-pilot/btp-util
```

### Step 2 - Add resolveDestination to your CAP srv module when you connect to destination

Check [/srv/risk-service.js](/srv/risk-service.js) or following sample code:
```
const {resolveDestination} = require('@sap-pilot/btp-util')

module.exports = cds.service.impl(async function () {
    this.on('READ', 'Diagnosis', async function (req) {        
        // override destination and replace it with destOverrides specified URL paremter if applicable (deefault destination is API_S4_HTTP_BASIC specified in package.json)
        const service = await cds.connect.to(resolveDestination(req,"API_S4_HTTP_BASIC"));
        const result = await service.tx(req).get("/Diagnosis"); // service.run(req.query);
        / ...
    });
});
```

**Note:** the resolveDestination method code is availale in github: https://github.com/sap-pilot/btp-util/blob/main/index.js

### Step 3 - Adjust Fiori Component.js to pass the destOverrides parameter

Sample code - [/app/diagnosis/webapp/Component.js](/app/diagnosis/webapp/Component.js): <br />
Note: you may want to uncomment OData V2 code and comment out V4 code if you are using OData V2 in yoour CAP app.
```
sap.ui.define(
    ["sap/fe/core/AppComponent"],
    function (Component) {
        "use strict";

        return Component.extend("cvx.poc.diagnosis.Component", {

            metadata: {
                manifest: "json"
            },

            initComponentModels: function() {

                const oComponentData = this.getComponentData();

                // note: only returned getManifestObject is editable (by reference))
                const oMainService = this.getManifestObject().getEntry("/sap.app/dataSources").mainService || {};
                const oManifestModels = this.getManifestObject().getEntry("/sap.ui5/models", true) || {};

                // check & apply destOverrides param 
                if ( oComponentData && oComponentData.startupParameters && oComponentData.startupParameters.destOverrides &&  oComponentData.startupParameters.destOverrides.length > 0 ) {

                    // read startup param
                    const destOverrides = oComponentData.startupParameters.destOverrides[0];
                    console.log("# destOverrides = '"+destOverrides+"'");

                    // below only works if your CAP app serves ODataV4Model 
                    const newUri = "/srv-api/?destOverrides="+destOverrides; // add service url parameters
                    console.log("# overriding mainService url from '"+oMainService.uri+"' to '"+newUri+"'");
                    if (!oMainService.originUri)
                        oMainService.originUri = oMainService.uri; // backup current uri
                    oMainService.uri = newUri;
                    
                    // below only works for ODataV2Model (uncomment below if you are using V2 CAP service)                   
                    // if (!oManifestModels[""].settings.serviceUrlParams)
                    //     oManifestModels[""].settings.serviceUrlParams = {};
                    // oManifestModels[""].settings.serviceUrlParams["destOverrides"] = destOverrides;

                } else if (oMainService.originUri) {
                    // restore original srvUri if no destOverrides param was specified 
                    oMainService.uri = oMainService.originUri;
                }
            
                // pass the models and data sources to the internal helper
                Component.prototype.initComponentModels.apply(this, arguments);
            }
        });
    }
);
```

### Step 4 - Create a copy of your fiori tile with URL param destOverrides

You can create a tile locally in approuter & flp sandbox to test like this -  [/app/flp/appconfig/fioriSandboxConfig.json](/app/flp/appconfig/fioriSandboxConfig.json)

OR contact BTP team to create a copy of your app/tile in Launchpad content manager and add destOverrides URL param as needed. <br />
![btp-dd-tile.png](/doc/img/btp-dd-tile.png)


## Limitations

1. **Data persistency** - This sample code is more for "pass through scenarios" - eg: no backend related data persisted in HANA cloud. 
   - For backend related data persistency requirements, consider Multi-tenant (MTE) or addition data seperation design in your CAP app, eg: add a client number to identify/seperate data for multiple backend
2. **Security segregation** - Although the UI can be segrated by Launchpad roles, the CAP service doesn't differenciate users for different backends. 
   - Same as above for CAP service security segregation consider MTE or addition security design (custom attribute etc) 
3. **Security consideration** - For production usage you may want to limit the destinations UI or user can use, for instance by specifying the destinations can be used in ENV variable DEST_OVERRIDE_WHITELIST_EXP (check mta.yaml and risk-service.js) so to avoid malacious user switching to ANY destination they want

## Learn More

Learn more at https://cap.cloud.sap/docs/get-started/.
