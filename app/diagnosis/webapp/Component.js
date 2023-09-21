sap.ui.define(
    ["sap/fe/core/AppComponent"],
    function (Component) {
        "use strict";

        return Component.extend("cvx.poc.diagnosis.Component", {
            metadata: {
                manifest: "json"
            },
            init: function () {
                /*
                 * getComponentData() returns an object like { startupParameters : { AAA : ["BBB"], DEF: ["HIJ","KLM"] } }
                 * NOTE: parameters values are passed via arrays
                */
                // const oComponentData = this.getComponentData();
                // console.log("# app was started with parameters " + JSON.stringify(oComponentData.startupParameters || {}));
                // const oManifestUi5 = this.getMetadata().getManifestEntry("sap.ui5");
                // console.log("# oManifestUi5: " + JSON.stringify(oManifestUi5 || {}));
                // const oDataSources = this.getMetadata().getManifestEntry("sap.app").dataSources;
                // console.log("# dataSource: " + JSON.stringify(oDataSources || {}));
                // if ( oComponentData.startupParameters &&  oComponentData.startupParameters.destOverrides &&  oComponentData.startupParameters.destOverrides.length > 0 ) {
                //     const destOverrides = oComponentData.startupParameters.destOverrides[0];
                //     // insert override into main service url like /destOverrides[OLD_DEST|NEW_DEST]/srv-api]
                //     const newUri = "/destOverrides["+destOverrides+"]/srv-api]";
                //     console.log("# overriding mainService url from '"+oDataSources.mainService.uri+"' to '"+newUri+"'");
                //     oDataSources.mainService.uri = newUri;
                //     debugger;
                //     // this.getModel().setHeaders({"X-DEST-OVERRIDES": destOverrides});
                //     // if (!oManifestUi5.models[""].settings.serviceUrlParams)
                //     //     oManifestUi5.models[""].settings.serviceUrlParams = {};
                //     // if (!oManifestUi5.models[""].settings.metadataUrlParam)
                //     //     oManifestUi5.models[""].settings.metadataUrlParams = {};
                //     // oManifestUi5.models[""].settings.serviceUrlParams["destOverrides"] = destOverrides;
                //     // oManifestUi5.models[""].settings.metadataUrlParams["destOverrides"] = destOverrides;
                // }
                Component.prototype.init.apply(this, arguments);
            },
            initComponentModels: function() {

                const oComponentData = this.getComponentData();
                console.log("# app was started with parameters " + JSON.stringify(oComponentData.startupParameters || {}));
                if ( oComponentData.startupParameters && oComponentData.startupParameters.destOverrides &&  oComponentData.startupParameters.destOverrides.length > 0 ) {
                    const destOverrides = oComponentData.startupParameters.destOverrides[0];
                    console.log("# destOverrides = '"+destOverrides+"'");
                    // note: only returned getManifestObject is editable (by reference)
                    const oMainService = this.getManifestObject().getEntry("/sap.app/dataSources").mainService || {};
                    //const newUri = "/destOverrides["+destOverrides+"]/srv-api]";
                    const newUri = "/srv-api/?destOverrides="+destOverrides; // add service url parameters
                    console.log("# overriding mainService url from '"+oMainService.uri+"' to '"+newUri+"'");
                    oMainService.uri = newUri;

                    // below only works for ODataV2Model
                    // var oManifestModels = this._getManifestEntry("/sap.ui5/models", true) || {};
                    // if (!oManifestModels[""].settings.metadataUrlParams)
                    //     oManifestModels[""].settings.metadataUrlParams = {};
                    // oManifestModels[""].settings.metadataUrlParams["destOverrides"] = destOverrides;
                    // oManifestModels[""].serviceUrl = newUri;
                }
            
                // pass the models and data sources to the internal helper
                Component.prototype.initComponentModels.apply(this, arguments);
            }
        });
    }
);