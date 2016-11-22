var expect = require('chai').expect
var url_tools = require("../js/url.tools.js")

describe('split_image_name function', function() {

	it('should separate the image file name from url', function(){
        var test_url = 'http://photos4.meetupstatic.com/photos/event/a/e/9/d/highres_455984701.jpeg';
        expect(url_tools.split_image_name(test_url))
            .to.equal('highres_455984701.jpeg');
    });

});

describe('parse_fragment function', function() {

	it('should get the contents from a correct url containing a hash-fragment', function(){
        var test_url = "www.test.html#access_token=2a77f011f8a0726e046ed60c2b568810&token_type=bearer&expires_in=3600"
        var result = url_tools.parse_fragment(test_url);

        expect(result).to.be.an('object');
        expect(result)
            .to.deep.equal({
                access_token: "2a77f011f8a0726e046ed60c2b568810",
                token_type: "bearer",
                expires_in: "3600"
            });
    });

    it('should get an undefined attributes with malformed urls', function(){
        var malformed_test_url = "www.test.html#access_token&token_type=bearer&expires_in=3600";
        var result = url_tools.parse_fragment(malformed_test_url);

        expect(result).to.be.an('object');
        expect(result)
            .to.deep.equal({
                access_token: undefined,
                token_type: "bearer",
                expires_in: "3600"
            });
    });

    it('should get an empty object if the fragment is not present', function(){
        var regular_test_url = "www.test.html";
        var result = url_tools.parse_fragment(regular_test_url);

        expect(result).to.be.an('object');
        expect(result)
            .to.deep.equal({});
    });

});

