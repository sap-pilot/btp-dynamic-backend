
const cds = require('@sap/cds')
const {resolveDestination} = require('@sap-pilot/btp-util')

/**
 * Implementation for Risk Management service defined in ./risk-service.cds
 */
module.exports = cds.service.impl(async function () {
    this.on('READ', 'Diagnosis', async function (req) {
        console.log("# reading diagnosis");
        // override destination and replace it with destOverrides specified URL paremter if applicable
        const service = await cds.connect.to(resolveDestination(req,"API_S4_HTTP_BASIC"));
        const result = await service.tx(req).get("/Diagnosis"); // service.run(req.query);
        if  (result && result.length)
            result.$count = result.length; // add inline $count otherise fiori element page wont show result
        console.log("# result = "+JSON.stringify(result || {}))
        return result;
    });
});