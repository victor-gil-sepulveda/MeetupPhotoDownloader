var test_images = [
    "http://drawingimage.com/files/1/Robot-Art.jpg",
    "http://pad3.whstatic.com/images/thumb/c/ca/Draw-a-Robot-Step-6-Version-2.jpg/aid753954-728px-Draw-a-Robot-Step-6-Version-2.jpg"
]

function split_image_name(url){
    return url.substr(url.lastIndexOf('/') + 1))
}

var zip = new JSZip();

for (var image_url in test_images){
    zip.file("smile.gif", imgData, {base64: true});
}

zip.generateAsync({type:"blob"})
.then(function(content) {
    // see FileSaver.js
    saveAs(content, "example.zip");
});
