if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["./tools.js"], function(tools) {

    function filter_events(event_response){
        var events = event_response.data;
        var filtered_events = [];
        var filtered_event = null;
        var event = null;
        for (var i=0; i < events.length; i++){
            event = events[i];
            filtered_event = { "group":{}, "event":{} };

            filtered_event.group.id = event.group.id;
            filtered_event.group.name = event.group.name;
            filtered_event.group.urlname = event.group.urlname;

            filtered_event.event.id = event.id;
            filtered_event.event.link = event.link;
            filtered_event.event.name = event.name;

            filtered_events.push(filtered_event);
        }
        return filtered_events;
    }

    function group_by_event(events, property="id"){
        var grouped_events = {}

        // Group events by group property ex. id
        for (var i=0; i < events.length; i++){
            var event = events[i];
            if (event.group[property] in grouped_events){
                grouped_events[event.group[property]].push(event);
            }
            else{
                grouped_events[event.group[property]] = [event];
            }
        }

        // Now flatten to a list
        var grouped_list = [];
        for (prop_id in grouped_events){
            var new_group = {};
            for (prop in grouped_events[prop_id][0].group){
                new_group[prop] = grouped_events[prop_id][0].group[prop];
            }

            events_list = [];
            for (var i = 0; i < grouped_events[prop_id].length; i++){
                var new_event = {};
                for (prop in grouped_events[prop_id][i].event){
                    new_event[prop] = grouped_events[prop_id][i].event[prop];
                }
                events_list.push(new_event);
            }
            new_group["events"] = events_list;
            grouped_list.push(new_group);
        }

        return grouped_list;
    }

    function get_links_from_photo_response(photo_response, resolution){

        var photo_response_data = photo_response.data;
        var photo_links = [];

        for (i in photo_response_data){
            photo_links.push({
                "url": photo_response_data[i][resolution],
                "id": photo_response_data[i].id,
                "author": (typeof photo_response_data[i].member.name === 'undefined') ?
                            "Unknown" :
                            tools.normalize_name(photo_response_data[i].member.name)
            });
        }

        return photo_links;
    }

    var photo_size = {
                "LOW_RES": "thumb_link",
                "NORM_RES": "photo_link",
                "HIGH_RES": "highres_link"
    }

    return {
            "filter_events": filter_events,
            "group_by_event": group_by_event,
            "get_links_from_photo_response": get_links_from_photo_response,
            "photo_size": photo_size
    };
});