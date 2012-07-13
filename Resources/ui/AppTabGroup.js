var _ = require('/lib/underscore')._;
var log = require('/lib/log');
var app = require('/context');
var AccountWindow = require('/ui/AccountWindow');
var WebWindow = require('/ui/WebWindow');
var AuthenticatedWindow = require('/ui/AuthenticatedWindow');
var LoginWindow = require('/ui/LoginWindow');
var tabGroup = null;

function AppTabGroup() {
	if(tabGroup) {
		tabGroup = null;
	}
	tabGroup = Ti.UI.createTabGroup();

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

	tabGroup.addTab(home_tab);
	hasUser ? tabGroup.addTab(auth_tab) : null;
	tabGroup.addTab(account_tab);

	log.info(home_win);
	hasUser ? log.info(auth_win) : null;
	log.info(account_win);

	log.info(home_tab);
	hasUser ? log.info(auth_tab) : null;
	log.info(account_tab);

	return tabGroup;
}

module.exports = AppTabGroup;
