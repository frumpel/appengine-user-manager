var accessHash = {};
var appHash = {};

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
	if (message.method == 'addUser') {
		if (accessHash[message.application] == undefined) {
			accessHash[message.application] = {};
		}
		accessHash[message.application][message.user] = true;
	}
	else if (message.method == 'addApp') {
		appHash[message.application] = true;
	}
	else if(message.method == 'getUserList') {
		sendResponse(accessHash);
	}
	else if(message.method == 'getAppList') {
		sendResponse(appHash);
	}
	else {
		console.log("unknown method " + message.method)
	}
});
