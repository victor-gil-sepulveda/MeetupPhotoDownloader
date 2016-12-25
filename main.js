/*
Guia para principiantes
http://nodeguide.com/beginner.html

Idea de como descargar las imagenes
http://www.henryalgus.com/reading-binary-files-using-jquery-ajax/
*/

//var JSZip = require("jszip");
//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

require([   "js/meetup.tools.js",
            "js/url.tools.js"],
        function(meetup, url_tools) {

    /*
        Gets the result from Meetup API and processes it
        to make it easier to handle.
    */
    function process_event_response(result){
        var f_events = meetup.filter_events(result);
        var grouped_events = meetup.group_by_event(f_events, "id");
        return grouped_events;
    }

    /*
        Creates the table cell div that holds a group.
    */
    function create_group_cell(cell_data, cell_index){
        return "<div class='group_cell selectable_info_cell' data-groupid='" +
                cell_data[cell_index].id +
                "' data-urlname='" + cell_data[cell_index].urlname + "' " +
                " data-groupindex='" + cell_index + "'><p>" +
                cell_data[cell_index].name +
                "</p></div>" +
                "<hr class='info_cell_line'>"
    }

    /*
        Creates the table cell div that holds an event.
    */
    function create_event_cell(cell_data, cell_index){
        return "<div class='event_cell selectable_info_cell' data-eventid='" +
               cell_data[cell_index].id + "'><p>" +
               cell_data[cell_index].name +
               "</p></div><hr class='info_cell_line'>"
    }

    /*
        Generalized function to populate the groups or events table
        (both work with lists of cells).
    */
    function populate_cells(cell_data, table_id, cell_template){
        $(table_id).empty();
        $(table_id).append("<hr class='info_cell_line'>");
        for( var i = 0; i < cell_data.length; i++){
            $(table_id).append(cell_template(cell_data, i));
        }
    }

    /*

    */
    function onGroupCellClicked( event ){
        // Select the guy
        $( ".group_cell" ).removeClass('selected');
        $(this).addClass('selected');

        // As all events become unselected, we deactivate Step 3
        $( ".step_three").removeClass('is-disabled');
        $( ".step_three").addClass('is-disabled');

        // Get the group index in order to retrieve the events
        var group_index = parseInt($(this).attr('data-groupindex'));

        // Populate event cells
        var grouped_events = event.data.grouped_events;
        populate_cells( grouped_events[group_index].events, "#events_table", create_event_cell);

        // Add callback to the events
        $( ".event_cell" ).click(function(){
            $( ".event_cell" ).removeClass('selected');
            $(this).addClass('selected');

            // Now we are prepared to get the photos
            $( ".step_three").removeClass('is-disabled');
        });
    }

    function main(){
        if(window.location.hash) {
            // Go to the second step
            go_to_second_step();

            // Deactivate 1st step login button
            $( ".step_one").addClass('is-disabled');

            // Activate step 2
            $(".step_two").removeClass("is-disabled")

            // We come from oauth redirect
            var hash_response = url_tools.parse_fragment(window.location.href);

            // Prepare the download button
            $( "#get_photos_button" ).click(function() {
                $( this ).addClass('is-disabled');
                get_photos(hash_response);
            });

            // Get the events using Meetup API
            var events_url = "https://api.meetup.com/self/events/";
            $.ajax({
                url: events_url,
                type: "GET",
                dataType: 'jsonp',
                processData: true,
                data: {"access_token": hash_response.access_token}
            })
            .done(function(result){
                var grouped_events = process_event_response(result);

                // populate group cells
                populate_cells( grouped_events, "#groups_table", create_group_cell);

                // Then add the callback for clicks
                $( ".group_cell" ).click({"grouped_events": grouped_events}, onGroupCellClicked);
            })
            .fail(function(result){
                console.log("Failed gathering group info");
                console.log(result);
            });
        }
    }

    /*
        Returns a promise that, when done, will contain the blob
        representing the downloaded image.
    */
    function download_photo(photo, zip_file, progress){
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
            progress.add_one(progress);
        })
        .fail(function(result){
            console.log("Failed");
            console.log(result);
        });
    }

    function get_photos(hash_response){
        // Obtain the data for the request
        var chosen_url_name = $(".group_cell.selected").attr("data-urlname");
        var chosen_event_id = $(".event_cell.selected").attr("data-eventid");

        // Mount the url
        var photo_url = "https://api.meetup.com/"+
                        chosen_url_name+
                        "/events/"+
                        chosen_event_id+
                        "/photos"//?&sign=true&photo-host=public&page=0"
        // And do it!
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
            request_and_pack_photos( result );
        })
        .fail(function(result){
            console.log("Failed photo data request");
            console.log(result);
        });
    }

    function do_progress(num_photos){
        $(".dialog_text").html("Please wait. <br>  Downloading "+num_photos+ " photos ");

        // Return a pseudo-object (I got experimental here :D )
        return {
            element: $(".dialog_text"),
            value: 0,
            n: num_photos,
            add_one: function(me){
                me.value += 1;
                me.element.html("Please wait. <br> Downloading " + me.value + "/" + me.n+ " ");
            }
        }
    }

    function request_and_pack_photos( result ){
        var photos = meetup.get_links_from_photo_response(result,
                                meetup.photo_size.HIGH_RES);

        var number_of_photos = photos.length;

        console.log(photos);

        if(number_of_photos == 0){
            // Warn the user the event has not photos
            show_dialog( "It looks like this event has no photo albums. "+
             "Please try with another one." );
            go_to_second_step();
            $("#get_photos_button").removeClass('is-disabled');
            return;
        }

        // else, download them
        show_dialog( "Please wait." );
        var progress = do_progress(number_of_photos);
        $("#dialog_ok").addClass('is-disabled');

        // Add the loading class to the text
        $(".dialog_text").addClass("loading");

        var zip_file = new JSZip();
        var promises = [];
        for (var i = 0; i < photos.length; i++){
            promises.push(download_photo(photos[i], zip_file, progress));
        }

        Promise.all(promises)
            .then(result => {
                zip_file.generateAsync({type:"blob"})
                   .then(function(content) {
                        // see FileSaver.js
                        saveAs(content, "photos.zip");
                        $("#dialog_ok").click(function(){

                            // Change to thanks
                            $("#thanks_page").css("display","");
                            $("#main_page").css("display","none");

                            // Change advertisement
                            $("#thanks_advertising_space").append($("#advertising_space").html());
                            $("#advertising_space").empty();
                            $("#thanks_advertising_space").css("display","");
                        });
                        $("#dialog_ok").removeClass('is-disabled');
                   });
            },
            failure_reason => {
                console.log("failed");
                console.log(failure_reason);
            });
    }

    function add_chitika_adds() {
        if (window.CHITIKA === undefined) { window.CHITIKA = { 'units' : [] }; };
        var unit = {"calltype":"async[2]","publisher":"vgil","width":728,"height":90,"sid":"Chitika Default"};
        var placement_id = window.CHITIKA.units.length;
        window.CHITIKA.units.push(unit);
        $("#advertising_space").append('<div id="chitikaAdBlock-' + placement_id + '"></div>');
        $.getScript("//cdn.chitika.net/getads.js");
    }

    $(document).ready(function(){
        add_chitika_adds();

        prepare_dialog();

        $( "#meetup_login_button" ).click(function() {
            // Main Entry point
            var consumer_key = "67lqbd3gqb4kmfrhm526ua5bke";
            var redirect_url = "http://www.thelostlib.com/MeetupPhotoDownloader";
            window.location = "https://secure.meetup.com/oauth2/authorize?client_id="+consumer_key+"&response_type=token&redirect_uri="+redirect_url;
            // Deactivate meetup login button
            $( "#meetup_login_button").addClass('is-disabled');
        });

        main();
    });

    function go_to_second_step(){
        $('html, body').animate({
            scrollTop: $("#second_step_header").offset().top
        }, 2000);
    }

    // From overflow.com/questions/3656592/how-to-programmatically-disable-page-scrolling-with-jquery
    function disable_scrolling(){
        $('html, body').css({
            overflow: 'hidden',
            height: '100%'
        });
    }

    function restore_scrolling(){
        $('html, body').css({
            overflow: 'auto',
            height: 'auto'
        });
    }

    function prepare_dialog(){
        $("#dialog_ok").click(function(){
            close_dialog()
        });
        $(".full_screen_overlay").css("display","none");
    }

    function show_dialog( text ){
        disable_scrolling();
        $(".dialog_text").html(text);
        $(".full_screen_overlay").css("display","");
    }

    function close_dialog( ){
        restore_scrolling();
        $(".full_screen_overlay").css("display","none");
    }
});
