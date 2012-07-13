var _ = require('/lib/underscore')._;
var log = require('/lib/log');
var app = require('/context');
var Network = require('/services/Network');
var dp = 'dp';

function AccountWindow(title) {
	var self = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white',
		navbarHidden: true
	});

	var appVersionLabel = Ti.UI.createLabel({
		text: Ti.App.version,
		textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
		font: { fontSize: 13+dp },
		color: '#444444',
		right: 5+dp,
		bottom: 2+dp,
		zIndex: 999
	});
	self.add(appVersionLabel);

	var currentUser = app.getCurrentUser();

	var currentUserView = Ti.UI.createView({});
	var currentUserLabel = Ti.UI.createLabel({
		text: currentUser.email,
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		font: { fontSize: 13 },
		color: '#444444',
		top: 15+dp,
		left: 0+dp,
		width: Ti.UI.FILL
	});
	currentUserView.add(currentUserLabel);

	var settingsLabel = Ti.UI.createLabel({
		text: 'Your cool account settings here',
		center:{ x: (app.platformWidth/2)+dp, y: 100+'dp' },
		font: { fontSize: 18+dp, fontWeight: 'bold' },
		color: 'blue',
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
	});
	currentUserView.add(settingsLabel);

	var logoutBtn = Ti.UI.createButton({
		title: 'Log out',
		bottom: 20+dp,
		width: 200+dp,
		height: 50+dp,
		borderRadius: 8+dp,
		// backgroundImage: app.imagePath('logout_red.png')
		borderColor: app.os({ android: 'transparent', def: '#00567F' }),
		style: app.os({ iphone: Ti.UI.iPhone.SystemButtonStyle.PLAIN, android: null }),
		backgroundGradient: app.os({
			iphone: {
				type: 'linear',
				startPoint: { x: '0%', y: '0%' },
				endPoint: { x: '0%', y: '100%' },
				colors: [ { color: '#FF3030', offset: 0.0}, { color: '#CD2626', offset: 1.0 } ]
			},
			android: null
		})
	});
	currentUserView.add(logoutBtn);
	self.add(currentUserView);

	var onLogout = function() {
		Network.userLogout({
			complete: function(user) {
				app.setCurrentUser(null);
				currentUserView.hide();
				Ti.App.fireEvent('app:user.logout', {});
			},
			error: function(e) {
				var msg = Ti.UI.createAlertDialog({
					title: 'Logout Error',
					message: e.error
				});
				msg.show();
				setTimeout(function() { msg.hide(); }, 4000);
			}
		});
	}
	logoutBtn.addEventListener('click', onLogout);

	return self;
}

module.exports = AccountWindow;
