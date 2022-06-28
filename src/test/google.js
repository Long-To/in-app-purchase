var assert = require('assert'); 
var fs = require('fs');
var fixedPath = process.cwd() + '/test/receipts/google';
var fixedPkPath = process.cwd() + '/test/receipts/google_pub/';

describe('#### Google ####', function () {

    it('Can validate Unity google in-app-purchase w/ auto-service detection', function (done) {
    
        var path = process.cwd() + '/test/receipts/unity_google';    
        var pkPath = process.argv[process.argv.length - 1].replace('--pk=', '');

        if (pkPath === 'false') {
            pkPath = fixedPkPath;
        }

        var iap = require('../');
        iap.config({
            verbose: true,
            googlePublicKeyPath: pkPath
        });
        iap.setup(function (error) {
            assert.equal(error, undefined);
            fs.readFile(path, function (error, data) {
                assert.equal(error, undefined);
                var receipt = JSON.parse(data.toString());
                iap.validate(receipt, function (error, response) {
                console.log('>>>>>>>>>>>>>>>>', response);
                    assert.equal(error, undefined);
                    assert.equal(iap.isValidated(response), true);
                    var data = iap.getPurchaseData(response);
                    for (var i = 0, len = data.length; i < len; i++) {
                        console.log('parsed purchased data', i, data[i]);
                        assert(data[i].productId);
                        assert(data[i].transactionId || 'undefined');
                        assert(data[i].purchaseDate);
                        assert(data[i].quantity);
                    }
                    done();
                });
            });
        });
    
    });
    
});
