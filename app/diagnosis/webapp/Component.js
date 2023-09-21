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
                const oComponentData = this.getComponentData();
                console.log("# app was started with parameters " + JSON.stringify(oComponentData.startupParameters || {}));
                const oManifestUi5 = this.getMetadata().getManifestEntry("sap.ui5");
                console.log("# oManifestUi5: " + JSON.stringify(oManifestUi5 || {}));
                const oDataSources = this.getMetadata().getManifestEntry("sap.app").dataSources;
                console.log("# dataSource: " + JSON.stringify(oDataSources || {}));
                if ( oComponentData.startupParameters &&  oComponentData.startupParameters.destOverrides &&  oComponentData.startupParameters.destOverrides.length > 0 ) {
                    const destOverrides = oComponentData.startupParameters.destOverrides[0];
                    // insert override into main service url like /destOverrides[OLD_DEST|NEW_DEST]/srv-api]
                    const newUri = "/destOverrides["+destOverrides+"]/srv-api]";
                    console.log("# overriding mainService url from '"+oDataSources.mainService.uri+"' to '"+newUri+"'");
                    oDataSources.mainService.uri = newUri;
                    // this.getModel().setHeaders({"X-DEST-OVERRIDES": destOverrides});
                    // if (!oManifestUi5.models[""].settings.serviceUrlParams)
                    //     oManifestUi5.models[""].settings.serviceUrlParams = {};
                    // if (!oManifestUi5.models[""].settings.metadataUrlParam)
                    //     oManifestUi5.models[""].settings.metadataUrlParams = {};
                    // oManifestUi5.models[""].settings.serviceUrlParams["destOverrides"] = destOverrides;
                    // oManifestUi5.models[""].settings.metadataUrlParams["destOverrides"] = destOverrides;
                }
                Component.prototype.init.apply(this, arguments);
            },
            initComponentModels: function() {

                const oComponentData = this.getComponentData();
                console.log("# app was started with parameters " + JSON.stringify(oComponentData.startupParameters || {}));
                if ( oComponentData.startupParameters && oComponentData.startupParameters.destOverrides &&  oComponentData.startupParameters.destOverrides.length > 0 ) {
                    const destOverrides = oComponentData.startupParameters.destOverrides[0];
                    console.log("# destOverrides = '"+destOverrides+"'");
                    var oMetadata = this.getMetadata();
                    // retrieve the merged sap.app and sap.ui5 sections of the manifest
                    // to create the models for the component + inherited ones
                    var oManifestDataSources = oMetadata.getManifestEntry("/sap.app/dataSources", true) || {};
                    const newUri = "/destOverrides["+destOverrides+"]/srv-api]";
                    console.log("# overriding mainService url from '"+oManifestDataSources.mainService.uri+"' to '"+newUri+"'");
                    oManifestDataSources.mainService.uri = newUri;

                    var oManifestModels = this._getManifestEntry("/sap.ui5/models", true) || {};
                    if (!oManifestModels[""].settings.metadataUrlParams)
                        oManifestModels[""].settings.metadataUrlParams = {};
                    oManifestModels[""].settings.metadataUrlParams["destOverrides"] = destOverrides;
                    oManifestModels[""].serviceUrl = newUri;
                }
            
                // pass the models and data sources to the internal helper
                Component.prototype.initComponentModels.apply(this, arguments);
            }
        });
    }
);