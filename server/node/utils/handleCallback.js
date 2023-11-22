module.exports = ({ error, response = {}, body }, res) => {
    if (error) {
        console.error(error);
        return res.send(error);
    }

    if (response.statusCode && response.statusMessage) {
        console.log(`Request to ${res.req.url} ended with status ${response.statusCode} - ${response.statusMessage}`);
        //console.log(response);
        //console.log(body);
    }

    res.send(body);
};
