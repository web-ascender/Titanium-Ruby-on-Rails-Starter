var _ = require('/lib/underscore')._;
var log = require('/lib/log');

var baseUrl = '';

//---- PRIVATE API

function setBaseUrl(url) {
	baseUrl = url;
}

/*
 * callbacks
 * 	complete(e) : e is a 'user' object
 * 	error(e)	: e is an 'error' object with properties 'response' and 'error'
 */
function userLogin(username, password, callbacks) {

    var params = {
        user: {
            username: username,
            password: password
        }
    };

    var xhr = Ti.Network.createHTTPClient({
        onload: function(e) {
            //Ti.API.debug(this.responseText);
            try {
            	var json = JSON.parse(this.responseText);
            }
            catch(jsonError) {
				if(_.isFunction(callbacks.error)) {
            		callbacks.error({
                        response: this.responseText,
                        error: 'Unable to parse response as JSON'
                    });
            	}
            }
            var user = {
                authToken: json.authentication_token,
                email: json.email,
                username: json.username
            };
            log.info('network -> userLogin:complete | ' + JSON.stringify(user));

            if(_.isFunction(callbacks.complete)) {
            	callbacks.complete(user);
            }
        },
        onerror: function(e) {
        	log.error('network -> userLogin:error | status:' + xhr.status +
                ', response:' + this.responseText + ', error: ' + e.error);

            if(_.isFunction(callbacks.error)) {
	        	var errorArgs = {
	        		response: this.responseText,
	        		error: e.error
	        	};

	            try {
	            	var json = JSON.parse(this.responseText);
	            	if(json.error) {
	            		errorArgs.error = json.error;
	            	}
	            }
	            catch(jsonError) {
	            	// empty
	            }

            	callbacks.error(errorArgs);
            }
        }
    });

    var url = baseUrl + '/users/sign_in.json';
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    log.info('network -> userLogin | ' + url);
    xhr.send( JSON.stringify(params) );
}

function userLogout(callbacks) {

    var xhr = Ti.Network.createHTTPClient({
        onload: function(e) {
            log.info('network -> userLogout:complete');

            if(_.isFunction(callbacks.complete)) {
            	callbacks.complete(this.responseText);
            }
        },
        onerror: function(e) {
        	log.error('network -> userLogout:error | status:' + xhr.status +
                ', response:' + this.responseText + ', error: ' + e.error);

            if(_.isFunction(callbacks.error)) {
            	callbacks.error({
	        		response: this.responseText,
	        		error: e.error
	        	});
            }
        }
    });

    var url = baseUrl + '/users/sign_out';

	xhr.open('GET', url);
	xhr.setRequestHeader('Accept', 'text/html');
	log.info('network -> userLogout | ' + url);
	xhr.send();
}

//---- PUBLIC API
exports.setBaseUrl = setBaseUrl;
exports.userLogin = userLogin;
exports.userLogout = userLogout;