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
                var oComponentData = this.getComponentData();
                console.log("# app was started with parameters " + JSON.stringify(oComponentData.startupParameters || {}));
                debugger;
                Component.prototype.init.apply(this, arguments);
            }
        });
    }
);