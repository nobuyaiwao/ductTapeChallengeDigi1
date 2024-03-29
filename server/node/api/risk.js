const { post } = require('request');
const getPostParameters = require('../utils/getPostParameters');
const handleCallback = require('../utils/handleCallback');

module.exports = (res, request) => {
    const params = getPostParameters('/risk', request);
    console.log(params);

    post(params, (err, response, body) => handleCallback({ err, response, body }, res));
};
