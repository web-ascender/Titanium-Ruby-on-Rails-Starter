var _ = require('/lib/underscore')._;
var log = require('/lib/log');
var app = require('/context');

function WebWindow(title, url, options) {

	options = options || {};
	if( !_.has(options,'closeOnAndroidBack') ) {
		options.closeOnAndroidBack = false;
	}
	if( url.indexOf('http') ===-1 ) {
		url = app.settings.get('network.host') + url;
	}

	var self = Ti.UI.createWindow(_.defaults({
		title:title,
		backgroundColor:'white'
	}, options));

	var webView = Ti.UI.createWebView({url:url});
	self.add(webView);

	var history = [];
	var back = Titanium.UI.createButton({
	    title:'Back'
	});
	back.addEventListener('click', function(e){
		webView.goBack();
	});
	webView.addEventListener('load', function(){
		if(!app.isAndroid){
			if(webView.canGoBack()){
				self.leftNavButton = back;
			}else{
				self.leftNavButton = null;
			}
		}
	});

	self.addEventListener('android:back', function(e) {
		if(options.closeOnAndroidBack) {
			self.close();
		} else {
			webView.goBack();
		}
	});

	self.reload = function() {
		log.info('WebWindow -> reload()');
		webView.reload();
	};

	return self;
}

module.exports = WebWindow;
