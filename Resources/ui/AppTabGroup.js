var _ = require('/lib/underscore')._;
var log = require('/lib/log');
var app = require('/context');
var AccountWindow = require('/ui/AccountWindow');
var WebWindow = require('/ui/WebWindow');
var AuthenticatedWindow = require('/ui/AuthenticatedWindow');
var LoginWindow = require('/ui/LoginWindow');

function AppTabGroup() {
	var self = Ti.UI.createTabGroup();

	function createTabs() {
		var currentUser = app.hasCurrentUser() ? app.getCurrentUser() : { authToken: '' };
		var hasUser = app.hasCurrentUser();

		var home_win = new WebWindow('Search', "http://www.webascender.com", {
				title: 'Home',
				navBarHidden: true
		});
		var home_tab = Ti.UI.createTab({
			title: 'Home',
			icon: '/images/icons/28-star.png',
			window: home_win
		});

		var account_win = hasUser ? new AccountWindow('My Account') : new LoginWindow();
		var account_tab = Ti.UI.createTab({
			title: 'My Account',
			icon: '/images/icons/111-user.png',
			window: account_win
		});

		if( hasUser ){
			var auth_win = new AuthenticatedWindow({
				title: 'Secure Tab'
			});
			var auth_tab = Ti.UI.createTab({
				title: 'Authenticated',
				icon: '/images/icons/172-pricetag.png',
				window: auth_win
			});
		}

		self.addTab(home_tab);
		hasUser ? self.addTab(auth_tab) : null;
		self.addTab(account_tab);
	}

	createTabs();

	return self;
}

module.exports = AppTabGroup;
