// 0. Get clientKey
getClientKey().then(async clientKey => {

    // Optional, define custom placeholders for the Card fields
    // https://docs.adyen.com/online-payments/web-components/localization-components
    // const translations = {
    //     "en-GB": {
    //         "creditCard.numberField.placeholder": "1234 5678 9012 3456",
    //         "creditCard.expiryDateField.placeholder": "MM/YY",
    //     }
    // };

    // 1. Create an instance of AdyenCheckout
    const checkout = await AdyenCheckout({
        environment: 'test',
        locale: "en-GB",
        // Optional, define custom placeholders for the Card fields
        // https://docs.adyen.com/online-payments/web-components/localization-components
        // translations: translations,
        clientKey: clientKey // Mandatory. clientKey from Customer Area
    });

    // 2. Create and mount the Component
    const card = checkout
        .create('card', {
            // Optional Configuration
            // hasHolderName: true,

            // Optional. Customize the look and feel of the payment form
            // https://docs.adyen.com/developers/checkout/api-integration/configure-secured-fields/styling-secured-fields
            styles: {},

            // Optionally show a Pay Button
            showPayButton: true,

            // Events
            onSubmit: (state, component) => {
                if (state.isValid) {
                    // 1st Risk check to determin challenge indicator
                    // Custom Routing Flag for 1st call
                    const customRoutingFlagObj = {
                       "additionalData": {
                            "customRoutingFlag": "forRiskCalc"
                       }
                    };
                    let testCaseName = document.getElementById('testCase').value;
                    console.log('Selected Test Case : ' + testCaseName);
                    let deliveryAddressObj = {};
                    switch(testCaseName){
                        case 'challenge':
                            deliveryAddressObj = {
                               city: 'Shibuya-ku',
                               country: 'JP',
                               stateOrProvince: 'Tokyo',
                               houseNumberOrName: 'Shibuya Scramble Square 39F',
                               postalCode: '1506139',
                               street: '2-24-12 Shibuya'
                            };
                        break;
                        case 'default':
                            deliveryAddressObj = {
                               city: 'Singapore',
                               country: 'SG',
                               stateOrProvince: '',
                               houseNumberOrName: '#10-22 Funan',
                               postalCode: '179097',
                               street: '109 North Bridge Road'
                            };
                            // Change PAN to frictionless 
                            //card.data.paymentMethod.encryptedCardNumber = 'test_4111111111111111';
                            //console.log(card.data.paymentMethod.encryptedCardNumber);
                        break;
                    }
                    const testcardData = {
                        "paymentMethod" : card.data.paymentMethod,
                        //"paymentMethod" : {
                        //     "type": "scheme",
                        //     "encryptedCardNumber": "test_4917 6100 0000 0000",
                        //     "encryptedExpiryMonth": "test_03",
                        //     "encryptedExpiryYear": "test_2030",
                        //     "encryptedSecurityCode": "test_737",
                        //     "holderName": "one"
                        //},
                        "origin" : card.data.origin,
                        "deliveryAddress" : deliveryAddressObj
                    };
                    makePaymentForRisk(testcardData,customRoutingFlagObj)
                        .then(response => {
                            console.log("Respone for Risk Check");
                            console.log(response);
                            let threeDSChallengeInd = '02';
                            if (response.fraudResult.results){
                                const fraudResultArr = response.fraudResult.results ;
                                fraudResultArr.forEach(function(fraudResult,index){
                                    let ruleName = fraudResult.name ;
                                    let riskScore = fraudResult.accountScore ;
                                    //console.log(ruleName);
                                    //console.log(ruleName + ' - ' + riskScore);
                                    if ( ruleName == 'BillingAddressDeliveryAddress' && riskScore > 0 ){
                                        console.log(ruleName + ' - ' + riskScore);
                                        alert(ruleName + ' - ' + riskScore + ' \nThis shopper needs to be challenged!');
                                        // Challenge Indicator
                                        threeDSChallengeInd = '04';
                                    } 
                                });
                            }
                            // 2nd /payments call
                            const threeDS2RequestDataObj = {
                               "threeDS2RequestData": {
                                    "threeDSRequestorChallengeInd": threeDSChallengeInd
                               }
                            };
                            console.log("threeDSChallengeInd : " + threeDSChallengeInd);
                            let testcardData2 = testcardData ;
                            if (testCaseName == 'default'){
                                testcardData2.paymentMethod.encryptedCardNumber = 'test_5201 2815 0512 9736';
                            }
                            makePayment(testcardData2,threeDS2RequestDataObj)
                                .then(response => {
                                    if (response.action) {
                                        console.log("Actoion Object");
                                        console.log(response.action);
                                        console.dir(response.action);
                                        card.handleAction(response.action);
                                    } else {
                                        console.log("Response without Action");
                                    }
                                })
                                .catch(error => {
                                    throw Error(error);
                                });
                            //if (response.action) {
                            //    card.handleAction(response.action);
                            //} else {
                            //    console.log("Response without Action");
                            //}
                        })
                        .catch(error => {
                            throw Error(error);
                        });

                    ////makePayment(card.data,localizedStatementObject);
                    ////makePayment(testcardData,threeDS2RequestDataObj);
                    //makePayment(testcardData,threeDS2RequestDataObj,customRoutingFlagObj)
                    //    .then(response => {
                    //        if (response.action) {
                    //            console.log("Actoion Object");
                    //            console.log(response.action);
                    //            console.dir(response.action);
                    //            card.handleAction(response.action);
                    //        } else {
                    //            console.log("Response without Action");
                    //        }
                    //    })
                    //    .catch(error => {
                    //        throw Error(error);
                    //    });
                }
            },
            onChange: (state, component) => {
                // state.data;
                // state.isValid;

                updateStateContainer(state); // Demo purposes only
            }
        })
        .mount('#card-container');
});
