/*
Guia para principiantes
http://nodeguide.com/beginner.html

Idea de como descargar las imagenes
http://www.henryalgus.com/reading-binary-files-using-jquery-ajax/
*/

//var JSZip = require("jszip");
//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


function split_image_name(url){
    return url.substr(url.lastIndexOf('/') + 1);
}

function parse_fragment(url){
    //http://stackoverflow.com/questions/4197591/parsing-url-hash-fragment-identifier-with-javascript
    //mccambridge amswer
    const hashObj = url.split('#')[1].split('&').reduce((prev, item) => Object.assign({[item.split('=')[0]]: item.split('=')[1]}, prev), {});
    return hashObj;
}

function postprocess_events(events){
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
    for (var i=0; i < events.length; i++){
        var event = events[i];
        if (event.group[property] in grouped_events){
            grouped_events[event.group[property]].push(event);
        }
        else{
            grouped_events[event.group[property]] = [event];
        }
    }
    return grouped_events;
}


test_photo_response

var photo_size = {
            "LOW_RES": "thumb_link",
            "NORM_RES": "photo_link",
            "HIGH_RES": "highres_link"
            }

function get_links_from_photo_response(photo_response, res_type){
    var photo_links = [];

    for (i in photo_response){
        photo_links.push({
            "url": photo_response[i][res_type],
            "id": photo_response[i].id,
            "author": (typeof photo_response[i].member.name === 'undefined') ? "Unknown" : photo_response[i].member.name
        });
    }

    return photo_links;
}

/*
    Returns a promise that, when done, will contain the blob
    representing the downloaded image.
*/
function download_photo(photo, zip_file){
    return $.ajax({
            url: photo.url,
            type: "GET",
            crossDomain: true,
            xhrFields: {cors: false},
            dataType: 'binary',
            processData: false
    })
    .done(function(result){
        var photo_file_name = photo.author+"_"+split_image_name(photo.url);
        zip_file.file(photo_file_name, result, {base64: true});
    })
    .fail(function(result){
        console.log("Failed");
        console.log(result);
    });
}

var test_photo_url = 'http://photos2.meetupstatic.com/photos/event/9/d/d/e/highres_455980414.jpeg';

function main(){

    // dummy response
    /*var test_url = "www.test.html#access_token=2a77f011f8a0726e046ed60c2b568810&token_type=bearer&expires_in=3600"
    console.log(parse_fragment(test_url));*/

    var f_events = postprocess_events(test_events.data);
    console.log(f_events);

    var g_by_events = group_by_event(f_events, "name");
    console.log(g_by_events);

    var photos = get_links_from_photo_response(test_photo_response, photo_size.HIGH_RES);
    console.log(photos);

    var zip_file = new JSZip();
    var promises = [];
    for (var i = 0; i < 5; i++){
        promises.push(download_photo(photos[i], zip_file));
    }

    Promise.all(promises)
        .then(result => {
            console.log(result);
            zip_file.generateAsync({type:"blob"})
               .then(function(content) {
                    // see FileSaver.js
                    saveAs(content, "photos.zip");
                    console.log("saveAs(content, 'photos.zip');");
               });
        },
        failure_reason => {
            console.log("failed");
            console.log(failure_reason);
        });
    return;

    if(window.location.hash) {
      // We come from oauth redirect
      console.log(parse_fragment(window.location.href));
      var hash_response = parse_fragment(window.location.href);
      var events_url = "https://api.meetup.com/self/events/";
      $.ajax({
            url: events_url,
            type: "GET",
            dataType: 'jsonp',
            processData: true,
            data: {"access_token": hash_response.access_token}
        }).done(function(result){
            console.log(result);
        }).fail(function(result){
            console.log("Failed");
            console.log(result);
        });

    } 
    else {
      // Entry point
      var consumer_key = "67lqbd3gqb4kmfrhm526ua5bke"
      var redirect_url = "http://www.thelostlib.com/MeetupPhotoDownloader"
      window.location = "https://secure.meetup.com/oauth2/authorize?client_id="+consumer_key+"&response_type=token&redirect_uri="+redirect_url;
      
      /*var zip = new JSZip();
        var promises = [];

        for (var i =0; i< test_images.length; i++){
            var image_url = test_images[i];
            console.log(image_url);

            var promise = $.ajax({
                url: image_url,
                type: "GET",
                crossDomain: true,
                xhrFields: {cors: false},
                dataType: 'binary',
                processData: false
            }).done(function(result){
                console.log("Downloaded");
            }).fail(function(result){
                console.log("Failed");
                console.log(result);
            });

            promises.push(promise);
        }

        Promise.all(promises)
            .then(responses => {
                // For each response (check names)
                //zip.file(split_image_name(image_url), imgData, {base64: true});
                
                console.log(values);
                // Then zip and show using saveAs
                zip.generateAsync({type:"blob"})
                    .then(function(content) {
                        // see FileSaver.js
                        saveAs(content, "example.zip");
                    });
              }, failure_reason => {
                console.log("failed")
                console.log(failure_reason)
              });*/

        }
}


