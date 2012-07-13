var _ = require('/lib/underscore')._;
var log = require('/lib/log');
var settings = require('/lib/settings');

var appName = 'Shuttle Pad';

var resourcesPath = Ti.Filesystem.resourcesDirectory;
var dataPath = Ti.Filesystem.applicationDataDirectory;
var osname = Ti.Platform.osname;
var osversion = Ti.Platform.version;
var osmodel = Ti.Platform.model;

var isAndroid = (osname === 'android');
var isIPhone  = (osname === 'iphone');
var isIPad    = (osname === 'ipad');
var isIOS     = (isIPhone || isIPad);
var isSimulator = (osmodel === 'Simulator' || osmodel.indexOf('sdk') !== -1 );

// used for determinig the correct sizes on Android
var displayCaps = Ti.Platform.displayCaps;
var width  = displayCaps.platformWidth;
var height = displayCaps.platformHeight;
var df = displayCaps.logicalDensityFactor;
if( osname === 'android' ) {
	width  = (width  / df);
	height = (height / df);
}

var currentUser = null;



//--- PRIVATE API

/*
 * Branching function to easily define and return os-specific properties
 * Usage:  os({ android: 100, ipad: 90, iphone: 50 })
 */
function os(/*Object*/ map) {
	var def = map.def||null; //default function or value
	if (typeof map[osname] != 'undefined') {
		if (typeof map[osname] == 'function') { return map[osname](); }
		else { return map[osname]; }
	}
	else {
		// return default value
		if (typeof def == 'function') { return def(); }
		else { return def; }
	}
};

function imagePath(_filename) {
	return resourcesPath + 'images/' + _filename;
}
function getCurrentUser() {
	if(currentUser === null) {
		var u = settings.get('currentUser','');
		if(u !== '') {
			currentUser = JSON.parse(u);
		}
	}
	// Ti.API.info('context -> getCurrentUser = ' + JSON.stringify(currentUser));
	return currentUser;
}

function hasCurrentUser() {
	var u = getCurrentUser();
	if(_.isObject(u)) {
		return true;
	}
	return false;
}

function setCurrentUser(u) {
	currentUser = u;
	Ti.API.info('context -> setCurrentUser = ' + JSON.stringify(currentUser));
	if(u === null) {
		settings.set('currentUser','');
	} else {
		settings.set('currentUser', JSON.stringify(u));
	}
}


//---------------------
//--- PUBLIC API
//---------------------
// if you export a VALUE type (number, string, etc.) then it's value will NOT UPDATE for
// callers, even if we set the variable to a new value! reference types (objects, json structures,
// etc.) will be updated as expected, however.

// properties
exports.appName = appName;
exports.resourcesPath = resourcesPath;
exports.dataPath = dataPath;
exports.osname = osname;
exports.osversion = osversion;
exports.isAndroid = isAndroid;
exports.isIPhone = isIPhone;
exports.isIPad = isIPad;
exports.isIOS = isIOS;
exports.isSimulator = isSimulator;
exports.platformHeight = height;
exports.platformWidth = width;
exports.settings = settings;

// functions
exports.os = os;
exports.imagePath = imagePath;
exports.getCurrentUser = getCurrentUser;
exports.hasCurrentUser = hasCurrentUser;
exports.setCurrentUser = setCurrentUser;
