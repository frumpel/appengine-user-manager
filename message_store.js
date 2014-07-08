var user_list = {};

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
  if(message.method == 'userAdd')
    user_list[message.user] = true;
  else if(message.method == 'getUserList')
    sendResponse(user_list);
});
