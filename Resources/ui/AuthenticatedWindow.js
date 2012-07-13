var _ = require('/lib/underscore')._;
var log = require('/lib/log');
var app = require('/context');
var dp = 'dp';

function AuthenticatedWindow(options) {
	var self = Ti.UI.createWindow(_.defaults({
		backgroundColor: 'white'
	}));

	var successLbl = Ti.UI.createLabel({
		text: 'You have successfully authenticated!',
		font: {fontSize: 30+dp},
		color: 'blue',
		center: { y: 50+dp, x: (app.platformWidth/2)+dp },
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
	});
	self.add(successLbl);

	return self;
}

module.exports = AuthenticatedWindow;