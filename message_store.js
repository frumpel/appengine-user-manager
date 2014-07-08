var accessHash = {};

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
	if (message.method == 'userAdd') {
		if (accessHash[message.application] == undefined) {
			accessHash[message.application] = {};
		}
		accessHash[message.application][message.user] = true;
	}
	else if(message.method == 'getUserList')
		sendResponse(accessHash);
});
