const xmlrpc = require('xmlrpc');

/**
 *
 */
class TLAPIClient {
    // _host = null;
    // _port = null;
    // _path = null;
    xmlrpc_client;

    constructor(host, port, path) {
        // this._host = host;
        // this._port = port;
        // this._path = path;
        this.xmlrpc_client = xmlrpc.createClient({host, port, path})
    }

    setDevKey(devKey) {
        this.devKey = devKey;
    }

    sendRequest(tlMethod, params) {
        return new Promise((resolve, reject) => {
            this.xmlrpc_client.methodCall('tl.' + tlMethod, [{devKey: this.devKey, ...params}], (error, value) => {
                if (error || value.isArray() && value.length > 0 && value[0].code) {
                    reject(error || value);
                } else {
                    resolve(value)
                }
            })
        })
    };
}

function createTLClient(host, port = 80, path = 'lib/api/xmlrpc/v1/custom_xmlrpc.php') {
    return new TLAPIClient(host, port, path)
}


module.exports.createTLClient = createTLClient;
