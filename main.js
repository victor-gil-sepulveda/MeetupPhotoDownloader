/*
Guia para principiantes
http://nodeguide.com/beginner.html

Idea de como descargar las imagenes
http://www.henryalgus.com/reading-binary-files-using-jquery-ajax/
*/

//var JSZip = require("jszip");
//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


require(["js/meetup.tools.js", "js/url.tools.js"], function(meetup, url_tools) {

    function download_photo(photo, zip_file){
    /*
        Returns a promise that, when done, will contain the blob
        representing the downloaded image.
    */
        return $.ajax({
                url: photo.url,
                type: "GET",
                crossDomain: true,
                xhrFields: {cors: false},
                dataType: 'binary',
                processData: false
        })
        .done(function(result){
            var photo_file_name = photo.author+"_"+ url_tools.split_image_name(photo.url);
            zip_file.file(photo_file_name, result, {base64: true});
        })
        .fail(function(result){
            console.log("Failed");
            console.log(result);
        });
    }

    function process_event_response(result){
        var f_events = meetup.filter_events(result);
        var g_by_events = meetup.group_by_event(f_events, "name");

        return g_by_events;
    }

    function main(){

        if(window.location.hash) {

            // Display step 2
             $(".step_two").removeClass("is-disabled")

            // We come from oauth redirect
            /*var hash_response = url_tools.parse_fragment(window.location.href);
            var events_url = "https://api.meetup.com/self/events/";
            $.ajax({
                url: events_url,
                type: "GET",
                dataType: 'jsonp',
                processData: true,
                data: {"access_token": hash_response.access_token}
            }).done(function(result){

                var g_by_events = process_event_response(result);
                console.log(g_by_events);

                var chosen_event_id = "235422275";
                var chosen_url_name = "BarcelonaHikingGroup";
                var photo_url = "https://api.meetup.com/"+
                                chosen_url_name+
                                "/events/"+
                                chosen_event_id+
                                "/photos"//?&sign=true&photo-host=public&page=0"

                $.ajax({
                        url: photo_url,
                        type: "GET",
                        dataType: 'jsonp',
                        processData: true,
                        data: {
                            "access_token": hash_response.access_token,
                            "page": 0
                        }
                })
                .done(function(result){
                    console.log(result)
                    var photos = meetup.get_links_from_photo_response(result,
                                meetup.photo_size.HIGH_RES);
                    console.log(photos);

                    var zip_file = new JSZip();
                    var promises = [];
                    for (var i = 0; i < photos.length; i++){
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
                })
                .fail(function(result){
                    console.log("Failed photo data request");
                    console.log(result);
                });

            }).fail(function(result){
                console.log("Failed");
                console.log(result);
            });*/

        }
    }

    $(document).ready(function(){
        console.log("Main loaded")

        $( "#meetup_login_button" ).click(function() {
            // Main Entry point
            var consumer_key = "67lqbd3gqb4kmfrhm526ua5bke"
            var redirect_url = "http://www.thelostlib.com/MeetupPhotoDownloader"
            window.location = "https://secure.meetup.com/oauth2/authorize?client_id="+consumer_key+"&response_type=token&redirect_uri="+redirect_url;
            $(this).addClass("is-disabled")
        });

        main();
    });

});