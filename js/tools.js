if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define( function(require) {

    function normalize_name(name){
        var tmp = name.replace(/[^\x00-\x7F]/g, "");
        return tmp.replace(/\ /g, "_");
    }

    return {
            "normalize_name": normalize_name
    };
});
