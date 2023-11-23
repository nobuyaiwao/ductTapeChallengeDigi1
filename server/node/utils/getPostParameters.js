const { CHECKOUT_APIKEY, CHECKOUT_URL, MERCHANT_ACCOUNT } = require('./config');
let MERCHANT_ACCOUNT_USE = '';

module.exports = (endpoint, request) => {
    console.log("Endpoint : " + endpoint );
    console.log("MERCHANT_ACCOUNT : " + MERCHANT_ACCOUNT );
    if ( endpoint == '/risk' ){
        const isRiskCheck = 'yes';
        endpoint = '/payments';
        MERCHANT_ACCOUNT_USE = MERCHANT_ACCOUNT + '_Risk';
        console.log("Changed endpoint to /payments");
        console.log("Merchant Account name changed to " + MERCHANT_ACCOUNT_USE );
    } else {
        MERCHANT_ACCOUNT_USE = MERCHANT_ACCOUNT ;
    }
    //console.log("Request Body");
    //console.log(request);

    const bodyObj = {
            merchantAccount: MERCHANT_ACCOUNT_USE,
            ...request
        };
    //console.log(bodyObj);
    const body = JSON.stringify(bodyObj);
    //const body = JSON.stringify({
    //    //merchantAccount: MERCHANT_ACCOUNT + '_Risk',
    //    merchantAccount: MERCHANT_ACCOUNT,
    //    ...request
    //});
    console.log("Body");
    console.log(body);

    return {
        body,
        url: `${CHECKOUT_URL}/${endpoint}`,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body, 'utf8'),
            'X-Api-Key': CHECKOUT_APIKEY
        }
    };
};
