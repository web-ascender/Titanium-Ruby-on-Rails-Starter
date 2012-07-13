var _ = require('/lib/underscore')._;
var log = require('/lib/log');
var app = require('/context');
var Network = require('/services/network');
var dp = 'dp';

function LoginWindow(options) {
	options = options || {};

	var self = Ti.UI.createWindow(_.defaults({
		title: 'Login',
		backgroundColor: '#EFEFEF',
		navBarHidden: true
	}, options));

	var headHeight = 60;
	var headerBar = Ti.UI.createView({
		backgroundColor: '#2B76A2',
		width: app.platformWidth,
		height: headHeight+dp,
		top: '0dp',
		left: '0dp'
	});
	var headerLabel = Ti.UI.createLabel({
		text: 'Sign In',
		center: {
			x: (app.platformWidth / 2)+dp,
			y: 30+dp
		},
		font: {fontSize: 18+dp, fontWeight: 'bold'},
		color: 'white'
	});
	headerBar.add(headerLabel);
	self.add(headerBar);


	var view = Ti.UI.createView({
		width: '90%',
		height: 'auto',
		top: headHeight + dp
	});

	var emailInput = Ti.UI.createTextField({
		top: 10+dp,
		left: '0dp',
		width: '100%',
		height: 45+dp,
		hintText: 'Username',
		autocorrect: false,
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
		keyboardType: Ti.UI.KEYBOARD_EMAIL,
		returnKeyType: Ti.UI.RETURNKEY_GO
	});

	var passwordInput = Ti.UI.createTextField({
		top: 65+dp,
		left: '0dp',
		width: '100%',
		height: 45+dp,
		hintText: 'Password',
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		passwordMask: true,
		returnKeyType: Ti.UI.RETURNKEY_GO
	});

	var loginButton = Ti.UI.createButton({
		title: 'Log in',
	   	top: 120+dp,
	   	left: 0+dp,
	   	width: 200+dp,
	   	height: 45+dp,
		borderRadius: 8+dp,
		borderColor: app.os({ android: 'transparent', def: '#00567F' }),
		style: app.os({ iphone: Ti.UI.iPhone.SystemButtonStyle.PLAIN, android: null }),
		backgroundGradient: app.os({
			iphone: {
				type: 'linear',
				startPoint: { x: '0%', y: '0%' },
				endPoint: { x: '0%', y: '100%' },
				colors: [ { color: '#00CD66', offset: 0.0}, { color: '#008B45', offset: 1.0 } ],
			},
			android: null
	  })
	});

	var signUpLabel = Ti.UI.createLabel({
	   top: 180+dp,
	   left: 0+dp,
	   width: Ti.UI.FILL,
	   height: Ti.UI.SIZE,
	   font: {fontSize: 14},
	   color: 'black',
	   text: 'Create a free account at www.gobusybee.com'
	});

	view.add(emailInput);
	view.add(passwordInput);
	view.add(loginButton);
	view.add(signUpLabel);

	self.add(view);

	function loginUser() {
		if(emailInput.value === '' || passwordInput.value === '') {
			var msg = Ti.UI.createAlertDialog({
				title: app.appName,
				message: 'Username and Password are required'});
			msg.show();
			return;
		}
		Network.userLogin(emailInput.value, passwordInput.value, {
			complete: function(user) {
				app.setCurrentUser(user);
				Ti.App.fireEvent('app:user.login')
			},
			error: function(e) {
				var msg = Ti.UI.createAlertDialog({
					title: app.appName,
					message: e.error
				});
				msg.show();
				setTimeout(function() { msg.hide(); }, 4000);
			}
		});
	}

	//---- Events
	emailInput.addEventListener('return', function() {
		passwordInput.focus();
	});
	passwordInput.addEventListener('return', loginUser);
	loginButton.addEventListener('click', loginUser);

	return self;
};

module.exports = LoginWindow;