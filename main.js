/*
Guia para principiantes
http://nodeguide.com/beginner.html

Idea de como descargar las imagenes
http://www.henryalgus.com/reading-binary-files-using-jquery-ajax/


*/

//var JSZip = require("jszip");
//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var test_images = [
    "http://drawingimage.com/files/1/Robot-Art.jpg",
    "http://pad3.whstatic.com/images/thumb/c/ca/Draw-a-Robot-Step-6-Version-2.jpg/aid753954-728px-Draw-a-Robot-Step-6-Version-2.jpg",
    "https://github.com/victor-gil-sepulveda/victor-gil-sepulveda.github.io/blob/master/theme/images/bitbucket.png?raw=true",
    "https://victor-gil-sepulveda.github.io/theme/images/google-plus.png"
]

function split_image_name(url){
    return url.substr(url.lastIndexOf('/') + 1);
}


function main(){

    if(window.location.hash) {
      // We come from oauth redirect
      console.log(window.location.hash)
      
    } else {
      // Normal behaviour
      var consumer_key = "67lqbd3gqb4kmfrhm526ua5bke"
      var redirect_url = "http://www.thelostlib.com/MeetupPhotoDownloader"
      window.location = "https://secure.meetup.com/oauth2/authorize?client_id="+consumer_key+"&response_type=token&redirect_uri="+redirect_url;
      
      var zip = new JSZip();
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
                /*zip.file(split_image_name(image_url),
                                    imgData,
                                    {base64: true});*/
                console.log(values);
                // Then zip and show using saveAs
                /*zip.generateAsync({type:"blob"})
                    .then(function(content) {
                        // see FileSaver.js
                        saveAs(content, "example.zip");
                    });*/
              }, failure_reason => {
                console.log("failed")
                console.log(failure_reason)
              });

        }

    
}
