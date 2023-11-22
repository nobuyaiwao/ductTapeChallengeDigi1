// Function to set returnUrl, for standard Drop-in and Components, return to placeholder,
// else redirect back to sessions where we handle the redirectResult
function setReturnUrl(){
    if(window.location.pathname === '/sessions/') {
        return window.location.href
    } else {
        return 'https://your-company.com/'
    }
}

const paymentMethodsConfig = {
    shopperReference: 'Checkout Components sample code test',
    reference: 'Checkout Components sample code test',
    countryCode: 'JP',
    amount: {
        value: 100,
        currency: 'JPY'
    }
};

const paymentsDefaultConfig = {
    shopperReference: 'Checkout Components sample code test',
    reference: 'Checkout Components sample code test',
    countryCode: 'JP',
    channel: 'Web',
    returnUrl: setReturnUrl(),
    //additionalData: {
    //        allow3DS2 : false
    //},
    // challenge flow
    //threeDS2RequestData: {
    //    deviceChannel: 'browser',
    //    threeDSCompInd: 'Y',
    //    threeDSRequestorChallengeInd: '04'
    //},
    threeDS2RequestData: {
        threeDSRequestorChallengeInd: '02'
    },
    amount: {
        value: 100,
        currency: 'JPY'
    },
    billingAddress: {
        city: 'City',
        country: 'MX',
        stateOrProvince: '',
        houseNumberOrName: '住所２',
        postalCode: '5454545',
        street: '住所１'
    },
    deliveryAddress: {
        city: 'Suginami-ku',
        country: 'JP',
        stateOrProvince: 'Tokyo',
        houseNumberOrName: '401',
        postalCode: '1660013',
        street: '1-2-3 Seibisho'
    }
};

// Generic POST Helper
const httpPost = (endpoint, data) =>
    fetch(`/${endpoint}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json());

// Get all available payment methods from the local server
const getPaymentMethods = () =>
    httpPost('paymentMethods', paymentMethodsConfig)
        .then(response => {
            if (response.error) throw 'No paymentMethods available';

            return response;
        })
        .catch(console.error);

// Posts a new payment into the local server
const makePayment = (paymentMethod, config = {}) => {
    const paymentsConfig = { ...paymentsDefaultConfig, ...config };
    const paymentRequest = { ...paymentsConfig, ...paymentMethod };

    updateRequestContainer(paymentRequest);

    return httpPost('payments', paymentRequest)
        .then(response => {
            if (response.error) throw 'Payment initiation failed';

            alert(response.resultCode);

            updateResponseContainer(response);

            return response;
        })
        .catch(console.error);
};

// Posts a new payment into the local server
const sessions = (paymentMethod, config = {}) => {
    const paymentsConfig = { ...paymentsDefaultConfig, ...config };
    const sessionRequest = { ...paymentsConfig, ...paymentMethod };

    return httpPost('sessions', sessionRequest)
        .then(response => {
            if (response.error) throw 'Payment initiation failed';
            return response;
        })
        .catch(console.error);
};


// Fetches an originKey from the local server
const getOriginKey = () =>
    httpPost('originKeys')
        .then(response => {
            if (response.error || !response.originKeys) throw 'No originKey available';

            return response.originKeys[Object.keys(response.originKeys)[0]];
        })
        .catch(console.error);

// Fetches a clientKey from the 
const getClientKey = () =>
    httpPost('clientKeys')
        .then(response => {
            if (response.error || !response.clientKey) throw 'No clientKey available';

            return response.clientKey;
        })
        .catch(console.error);
