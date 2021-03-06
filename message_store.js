var accessHash = {};   // key value store: { app: { user: { access: TYPE, ... }, ...}
var appHash = {};      // key value store" { app: T/F, ... }

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    // user list 
    if (message.method == 'addUser') {
        if (accessHash[message.application] == undefined) {
            accessHash[message.application] = {};
        }
        accessHash[message.application][message.user] = { "access":message.access, "disabled":message.disabled }
    }
    else if(message.method == 'clearUserList') {
        accessHash = {};
    }
    else if(message.method == 'getUserList') {
        sendResponse(accessHash);
    }
    // application list
    else if (message.method == 'addApp') {
        appHash[message.application] = true;
    }
    else if(message.method == 'getAppList') {
        sendResponse(appHash);
    }
    // error handling
    else {
        console.log("unknown method " + message.method);
    }
});
