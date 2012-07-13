var moment = require('/lib/moment');

function timestamp() {
    return moment().format('YYYY-MM-DD HH:mm:ss');
}

exports.info = function(str) {
    Ti.API.info(timestamp() + ': ' + str);
};

exports.warn = function(str) {
    Ti.API.warn(timestamp() + ': ' + str);
};

exports.error = function(str) {
    Ti.API.error(timestamp() + ': ' + str);
};

exports.debug = function(str) {
    Ti.API.debug(timestamp() + ': ' + str);
};

exports.mem = function() {
    Ti.API.info('Available memory: ' + Math.round( Ti.Platform.availableMemory ));
};
