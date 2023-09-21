sap.ui.define(
    ["sap/fe/core/AppComponent"],
    function (Component) {
        "use strict";

        return Component.extend("cvx.poc.diagnosis.Component", {

            metadata: {
                manifest: "json"
            },

            _sOriginSrvUri : null,
            _sDestOverridenUri : null,

            initComponentModels: function() {

                const oComponentData = this.getComponentData();

                // note: only returned getManifestObject is editable (by reference))
                const oMainService = this.getManifestObject().getEntry("/sap.app/dataSources").mainService || {};
                const oManifestModels = this.getManifestObject().getEntry("/sap.ui5/models", true) || {};

                // backup initial data
                if (oMainService && oMainService.uri && !this._sOriginSrvUri)
                    this._sOriginSrvUri = oMainService.uri;

                // check & apply destOverrides param 
                if ( oComponentData && oComponentData.startupParameters && oComponentData.startupParameters.destOverrides &&  oComponentData.startupParameters.destOverrides.length > 0 ) {

                    // read startup param
                    const destOverrides = oComponentData.startupParameters.destOverrides[0];
                    console.log("# destOverrides = '"+destOverrides+"'");
                    // 
                    
                    // below only works if your CAP app serves ODataV4Model 
                    const newUri = "/srv-api/?destOverrides="+destOverrides; // add service url parameters
                    this._sDestOverridenUri = newUri;
                    console.log("# overriding mainService url from '"+oMainService.uri+"' to '"+newUri+"'");
                    oMainService.uri = newUri;
                    
                    // below only works if your CAP app serves ODataV2Model (comment out in case of V4)                   
                    // if (!oManifestModels[""].settings.serviceUrlParams)
                    //     oManifestModels[""].settings.serviceUrlParams = {};
                    // oManifestModels[""].settings.serviceUrlParams["destOverrides"] = destOverrides;

                } else if (this._sOriginSrvUri) {
                    // restore original srvUri if no destOverrides param was specified 
                    oMainService.uri = this._sOriginSrvUri;
                }
            
                // pass the models and data sources to the internal helper
                Component.prototype.initComponentModels.apply(this, arguments);
            }
        });
    }
);