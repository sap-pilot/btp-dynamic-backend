
const cds = require('@sap/cds')

const resolveDestination = function(request, requiredDestination) {
    const destDef = cds.env.requires[requiredDestination]; // take destination config from package.json cds.requires 
    const destOverrides = (request && request.req && request.req.query)? request.req.query.destOverrides : null; // take url parameter "destOverrides": CSV string of OLD_DEST|NEW_DEST
    if (!destOverrides || !destDef || !destDef.credentials || !destDef.credentials.destination)
        return requiredDestination; // nothing to override
    // need to override destination, copy config first
    const destOverrideWhitelistExp = process.env.DEST_OVERRIDE_WHITELIST_EXP;
    let destExp = null;
    if (!destOverrideWhitelistExp) {
        console.log("# warning: no DEST_OVERRIDE_WHITELIST_EXP specified in ENV, all destOverrides are permitted now.")
    } else {
        destExp = new RegExp(destOverrideWhitelistExp,"i"); // case insensitive
    }
    const newDestDef = JSON.parse(JSON.stringify(destDef));
    const destMap = {}; // OLD_DEST : NEW_DEST map
    const aOverrides = destOverrides.split(",");
    for ( const override of aOverrides) {
        const pair = override.split("|");
        if ( pair.length == 2 && pair[0] === destDef.credentials.destination ) {
            // found override now checking against whitelist
            const newDest = pair[1];
            if (destExp && !destExp.test(newDest)) {
                console.log("# warning: destOverride '"+newDest+"' not allowed by DEST_OVERRIDE_WHITELIST_EXP '"+destOverrideWhitelistExp+"'");
            } else {
                console.log("# info: override destination [" + newDestDef.credentials.destination + "] with [" + newDest + "]");
                newDestDef.credentials.destination = newDest;
                return newDestDef;
            }
        } else {
            console.log("# warning: cannot recognize destOverride pair ["+override+"]");
        }
    }
    return requiredDestination; // no override found, returning original destinaion
}

/**
 * Implementation for Risk Management service defined in ./risk-service.cds
 */
module.exports = cds.service.impl(async function () {
    this.on('READ', 'Diagnosis', async function (req) {
        console.log("# reading diagnosis");
        const service = await cds.connect.to(resolveDestination(req,"API_S4_HTTP_BASIC"));
        const result = await service.tx(req).get("/Diagnosis"); // service.run(req.query);
        if  (result && result.length)
            result.$count = result.length; // add inline $count otherise fiori element page wont show result
        console.log("# result = "+JSON.stringify(result || {}))
        return result;
    });
});