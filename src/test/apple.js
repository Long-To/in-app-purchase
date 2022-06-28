var assert = require('assert'); 
var fs = require('fs');
var fixedPath = process.cwd() + '/test/receipts/apple';

describe('#### Apple ####', function () {

    it('Can validate Unity apple in-app-purchase w/ auto-service detection', function (done) {

        var path = process.cwd() + '/test/receipts/unity_apple';
        var iap = require('../');
        iap.config({
            verbose: true
        });
        iap.setup(function (error) {
            assert.equal(error, undefined);
            fs.readFile(path, function (error, data) {
                assert.equal(error, undefined);
                var receipt = data.toString();
                iap.validate(receipt, function (error, response) {
                    if (error) {
                        console.error('Error >>>>', error);
                    }
                    assert.equal(error, undefined);
                    assert.equal(iap.isValidated(response), true);
                    var data = iap.getPurchaseData(response, { ignoreExpired: true });
                    for (var i = 0, len = data.length; i < len; i++) {
                        console.log('parsedPurchaseData:', i, data);
                        assert(data[i].productId);
                        assert(data[i].purchaseDate);
                        assert(data[i].quantity);
                    }
                    done();
                });
            });
        });
    
    });

});
