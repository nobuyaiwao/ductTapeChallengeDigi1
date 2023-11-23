const handleCallback = require('../utils/handleCallback');

module.exports = (res, request) => {
    console.log("returnUrl called");
    handleCallback({ body: { request } }, res);
};
