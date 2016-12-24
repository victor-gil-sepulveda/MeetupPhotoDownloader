var expect = require('chai').expect
var events = require("../js/meetup.tools.js")
var test_data = require("../tests/data.js")

describe('postprocess_events function', function() {

	it('should filter the response from meetup', function(){
        var result = events.filter_events(test_data.test_events);
        var expected = test_data.filtered_event_data;
        expect(result).to.deep.equal(expected);
    });

    it('should group the events by meetup group', function(){
        var result = events.group_by_event(test_data.filtered_event_data);
        var expected = test_data.grouped_event_data;
        expect(result).to.deep.equal(expected);
    });

    it('should extract a given set of links from a meetup photo response', function(){
        var result = events.get_links_from_photo_response(test_data.test_photo_response,
                        events.photo_size.HIGH_RES);
        var expected = test_data.photo_links;
        expect(result).to.deep.equal(expected);
    });
});
