
const cds = require('@sap/cds')

/**
 * Implementation for Risk Management service defined in ./risk-service.cds
 */
module.exports = cds.service.impl(async function () {
    this.on('READ', 'Diagnosis', async function (req) {
        console.log("# reading diagnosis");
        const destDef = cds.env.requires['API_S4_HTTP_BASIC'] //defined in package.json
        const destOverride = req.req.query.destination;
        var service = null;
        if (destDef && destOverride) {
            const newDestDef = JSON.parse(JSON.stringify(destDef));
            console.log("# override destination [" + newDestDef.credentials.destination + "] to [" + destOverride + "]");
            newDestDef.credentials.destination = destOverride;
            service = await cds.connect.to(newDestDef);
        } else {
            // no override, use normal destination
            service = await cds.connect.to("API_S4_HTTP_BASIC");
        }
        const url = "/Diagnosis";
        const result = await service.tx(req).get(url);
        return result;
    });
});