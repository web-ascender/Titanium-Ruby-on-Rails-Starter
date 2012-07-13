var _ = require('/lib/underscore')._;
var log = require('/lib/log');
var app = require('/context');
var Network = require('/services/network');
var LoginWindow = require('/ui/LoginWindow');
var WebWindow = require('/ui/WebWindow');

function AccountWindow(title) {
	var self = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white',
		navbarHidden: true
	});

	var appVersionLabel = Ti.UI.createLabel({
		text: Ti.App.version,
		textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
		font: { fontSize: 13 },
		color: '#444444',
		right: '5dp',
		bottom: '2dp',
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		zIndex: 999
	});
	self.add(appVersionLabel);

	if(app.hasCurrentUser()) {
		var currentUser = app.getCurrentUser();

		var currentUserView = Ti.UI.createView({});
		var currentUserLabel = Ti.UI.createLabel({
			text: currentUser.email,
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			font: { fontSize: 13 },
			color: '#444444',
			top: '15dp',
			left: '0dp',
			width: '100%'
		});
		currentUserView.add(currentUserLabel);

		var settingsLabel = Ti.UI.createLabel({
			text: 'Your cool account settings here',
			center:{ x: (app.platformWidth/2), y: 100+'dp' },
			font: { fontSize: 18+'dp', fontWeight: 'bold' },
			color: 'blue',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
		});
		currentUserView.add(settingsLabel);

		var logoutBtn = Ti.UI.createButton({
			title: 'Log out',
			bottom: '20dp',
			width: '200dp',
			height: '50dp',
			borderRadius: '8dp',
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

		logoutBtn.addEventListener('click', onLogout);
	} else {
		var anonymousUserView = Ti.UI.createView({
		   width: '90%',
		   height: 'auto'
		});
		var loginBtn = Ti.UI.createButton({
			title: 'Login',
			top: '10dp',
			width: '200dp',
			height: '50dp',
			borderRadius: '8dp',
			// backgroundImage: app.imagePath('login_green.png')
			borderColor: app.os({ android: 'transparent', def: '#00567F' }),
			style: app.os({ iphone: Ti.UI.iPhone.SystemButtonStyle.PLAIN, android: null }),
			backgroundGradient: app.os({
				iphone: {
					type: 'linear',
					startPoint: { x: '0%', y: '0%' },
					endPoint: { x: '0%', y: '100%' },
					colors: [ { color: '#00CD66', offset: 0.0}, { color: '#008B45', offset: 1.0 } ]
				},
				android: null
			})
		});
		anonymousUserView.add(loginBtn);
		self.add(anonymousUserView);

		loginBtn.addEventListener('click', function(){
			var loginWin = new LoginWindow();
			loginWin.addEventListener('login', onLogin);

				loginWin.open({ modal: true });
		});
	}

	function onLogin(user) {
		log.info('onLogin -> user = ' + user);
		app.setCurrentUser(user);
		Ti.App.fireEvent('app:user.login', user);
	}

	function onLogout() {
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

	return self;
}

module.exports = AccountWindow;
