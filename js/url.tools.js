if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define( function(require) {

        function split_image_name(url){
            return url.substr(url.lastIndexOf('/') + 1);
        };

        function parse_fragment(url){
            //http://stackoverflow.com/questions/4197591/parsing-url-hash-fragment-identifier-with-javascript
            //mccambridge amswer
            var hashObj = null;
            try{
                hashObj = url.split('#')[1].split('&').reduce((prev, item) => Object.assign({[item.split('=')[0]]: item.split('=')[1]}, prev), {});
            }
            catch (err){
                console.log("[ERROR @ parse_fragment] "+err);
                hashObj = {};
            }
            return hashObj;
        };

        return {
            "split_image_name": split_image_name,
            "parse_fragment": parse_fragment
        };
});