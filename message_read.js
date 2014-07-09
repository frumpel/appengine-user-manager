function sortAlphabetically(a,b) {
	return a.toLowerCase().localeCompare(b.toLowerCase())
};

// returns an ARRAY
function getFirstLevelKeys(hash) {
	return Object.keys(hash).sort(sortAlphabetically)
}

// returns an ARRAY
function getSecondLevelKeys(hash) {
	var keys1 = getFirstLevelKeys(hash);
	var keys2 = {};

	keys1.forEach(function(app){
		var users = getFirstLevelKeys(hash[app]);
		users.forEach(function(user){
			keys2[user] = true;
		});
	});
	return Object.keys(keys2).sort(sortAlphabetically);
}

function formatUserHash(userHash) {
	var rs = "<H1>Appengine Users</H1><P>";
	var apps = getFirstLevelKeys(userHash);
	var users = getSecondLevelKeys(userHash);

    rs += "<table>";
    rs += "<tr><th>" + "apps:" + apps.length + " users:" + users.length + "</th>"
    apps.forEach(function(app){
		rs += "<th>" + app + "</td>"
	});
	rs += "</tr>";
	users.forEach(function(user){
		rs += "<tr><td class=email>" + user + "</td>";
		apps.forEach(function(app){
			if (userHash[app][user] == true) {
			  rs += '<td><input type=checkbox value="' + app + ":" + user +'" checked></td>';
			} else {
			  rs += '<td><input type=checkbox value="' + app + ":" + user +'" ></td>';
			}
		});
		rs += "</tr>";
	});
	rs += "</table>";
	// apps.forEach(function(app){
	// 	rs += app.toString() + ": [";
	// 	// rs += typeof(app);
	// 	rs += Object.keys(userHash[app]).toString();
	// 	rs += "]<BR>";
	// });
	// users.forEach(function(user){
	// 	rs += "--" + user.toString() + "--<BR>"
	// })
	// // rs += typeof(users)

	document.getElementById("usertable").innerHTML=rs;
};

function openAppTabs(appHash) {
	var rs = "<H1>Applications to check</H1><P>";
	var apps = getFirstLevelKeys(appHash);
	var urls = [];
	apps.forEach(function(app){
		urls.push("https://appengine.google.com/permissions?app_id=" + app);
		rs += app + "<br>"
	});
	document.getElementById("apptable").innerHTML=rs;
	chrome.windows.create({focused:false,url:urls},closeAppTabs);
};

function closeAppTabs(tabsWindow) {
	console.log("tabsWindow:" + Object.keys(tabsWindow).toString());
	displayKnownInfo();
	window.setTimeout(function(){ chrome.windows.remove(tabsWindow["id"]) },60000);
};

function updateInfo() {
		chrome.runtime.sendMessage(
		{method:'getAppList'}, 
		openAppTabs
		);
}

function displayKnownInfo() {
	chrome.runtime.sendMessage(
		{method:'getUserList'}, 
		formatUserHash
		);
};

window.addEventListener('load',displayKnownInfo);
document.getElementById('getdata').addEventListener('click',updateInfo);

