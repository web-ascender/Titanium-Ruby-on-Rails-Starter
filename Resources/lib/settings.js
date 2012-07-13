//---- Private API
function get(name, def) {
    return Ti.App.Properties.getString(name, def || '');
}

function getInt(name, def) {
    return Ti.App.Properties.getInt(name, def || -1);
}

function getBool(name, def) {
    return Ti.App.Properties.getBool(name, def);
}

function set(name, value) {
    Ti.App.Properties.setString(name, value);
}

function setInt(name, value) {
    Ti.App.Properties.setInt(name, value);
}

function setBool(name, value) {
    Ti.App.Properties.setBool(name, value);
}

//---- Public API
exports.get = get;
exports.getInt = getInt;
exports.getBool = getBool;
exports.set = set;
exports.setInt = setInt;
exports.setBool = setBool;