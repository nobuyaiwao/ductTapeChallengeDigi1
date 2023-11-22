// 0. Get clientKey
getClientKey().then(clientKey => {
    getPaymentMethods().then(async paymentMethodsResponse => {
         const cardConfiguration = {
            hasHolderName: true,
            //holderNameRequired: true,
            //billingAddressRequired: true, // Set to true to show the billing address input fields.
            onBinLookup: ( cbobj ) => {
                console.log("onBinLookup called :-)");
                console.log(cbobj);
            },
            onBrand: ( cbobj ) => {
                console.log("onBrand called :-)");
                console.log(cbobj);
            }
        };
        const configuration = {
            environment: 'test',
            clientKey: clientKey, // Mandatory. clientKey from Customer Area
            paymentMethodsResponse,
            removePaymentMethods: ['paysafecard', 'c_cash'],
            onChange: state => {
                updateStateContainer(state); // Demo purposes only
            },
            onSubmit: (state, dropin) => {
                // state.data;
                // state.isValid;
                //makePayment(state.data);
                makePayment(state.data)
                    .then(response => {
                        if (response.action) {
                            console.log("Action Object");
                            console.dir(response.action);
                            console.log(response.action);
                            alert("Check paymentDatea");
                            console.log(response.action.paymentData);
                            dropin.handleAction(response.action);
                        } else {
                            console.log("Response without Action");
                            console.dir(response);
                        }
                    })
                    .catch(error => {
                        throw Error(error);
                    });
            },
            paymentMethodsConfiguration: {
                card: cardConfiguration
            }
        };

        // 1. Create an instance of AdyenCheckout
            const checkout = await AdyenCheckout(configuration);

            // 2. Create and mount the Component
            const dropin = checkout
                .create('dropin', {
                    // Events
                    onSelect: activeComponent => {
                        if (activeComponent.state && activeComponent.state.data) updateStateContainer(activeComponent.data); // Demo purposes only
                    }
                })
                .mount('#dropin-container');

    });
});
