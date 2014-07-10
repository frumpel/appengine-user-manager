var odef = [
	["UNDEFINED","------"],
	["APP_VIEWER",   "Viewer"],
	["APP_DEVELOPER","Developer"],
	["APP_OWNER",    "Owner"],
];

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

function toggleUsers(toggleSource,toggleEnv,toggleUser) {
	var checkboxes = document.getElementsByClassName(toggleUser + " " + toggleEnv);
    for(var ii=0, nn=checkboxes.length; ii<nn;ii++) {
    	checkboxes[ii].checked = toggleSource.checked;
  	};
};

function deleteUser(userToDelete) {
	var appa = Array.prototype.slice.call(document.getElementsByClassName(userToDelete + " appselector"));
	var apps = [];
	appa.forEach(function(appi){
		if (appi.selectedIndex > 0) {
			apps.push(appi.className.replace(userToDelete,"").replace("appselector","").replace(/\s/g,''));
		}
	})
	
	if (confirm("Would delete " + userToDelete + " from " + apps)) {
		// document.getElementById("messages").innerText="Would delete " + userToDelete + " from " + apps;
		openWindowDeleteUser(apps,userToDelete);
	};
};

function createOwnershipSelector(selection) {

	var tptr = document.createElement("select");
	odef.forEach(function attachOption(info) {
		var option = document.createElement("option");
		option.value = info[0];
		option.text = info[1];
		option.selected = (selection == info[0]);
		tptr.appendChild(option);
	});
	return tptr;
};

function formatUserHash(userHash) {
	var rs = "<H1>Appengine Users</H1><P>";
	var apps = getFirstLevelKeys(userHash);
	var appclass = "";
	var users = getSecondLevelKeys(userHash);

	var tptr = document.createElement("table");
	var eptr = null;
	var trow = tptr.insertRow(-1);
	var tcel = trow.insertCell(-1);
	tcel.class = "ch rh";
	tcel.innerText = "apps:" + apps.length + " users:" + users.length;
	apps.forEach(function(app){
		tcel = trow.insertCell(-1);
		tcel.class = "ch";
		tcel.innerText = app;
	});
	users.forEach(function(user){
		trow = tptr.insertRow(-1);

		tcel = trow.insertCell(-1);
		tcel.class = "rh email";

		eptr = document.createElement("button");
		eptr.appendChild(document.createTextNode("DELETE"));
		eptr.className = "delete " + user;
		eptr.onclick = function(){ deleteUser(user); };
		tcel.appendChild(eptr);

		eptr = document.createElement("input");
		eptr.type = "checkbox";
		eptr.className = "toggle nonprod";
		eptr.onclick = function(){ toggleUsers(this,"nonprod",user); };
		eptr.checked = false;
		tcel.appendChild(eptr);

		eptr = document.createElement("input")
		eptr.type = "checkbox";
		eptr.className = "toggle prod";
		eptr.onclick = function(){ toggleUsers(this,"prod",user); };
		eptr.checked = false;
		tcel.appendChild(eptr);

		eptr = document.createTextNode(user);
		tcel.appendChild(eptr);

		apps.forEach(function(app){
			appclass = ((app.replace(/^.*-prod$/,"prod") == "prod") ? "prod" : "nonprod" );
			tcel = trow.insertCell(-1);
			// tcel.class = "";
			// eptr = document.createElement("input")
			// eptr.type = "checkbox";
			// eptr.className = app + " " + user + " " + appclass; // should have prod/nonprod
			// eptr.checked = (userHash[app][user] == true);

			// eptr = document.createTextNode(userHash[app][user]);

			eptr = createOwnershipSelector(userHash[app][user]);
			eptr.className = user + " " + app + " " + "appselector";

			tcel.appendChild(eptr);
		});
	});

	var usertable = document.getElementById("usertable");
	while (usertable.firstChild) {
    	usertable.removeChild(usertable.firstChild);
	}
	usertable.appendChild(tptr);
};

function openWindowTabsScraper(appHash) {
	var rs = "<H1>Applications to check</H1><P>";
	var apps = getFirstLevelKeys(appHash);
	var urls = [];

	console.log("Open scraper window " +  apps);

	apps.forEach(function(app){
		urls.push("https://appengine.google.com/permissions?app_id=" + app);
		rs += app + "<br>"
	});
	document.getElementById("apptable").innerHTML=rs;
	// chrome.windows.create({focused:false,url:urls},closeWindowTabs);
	openWindowTabs(urls);
};

function openWindowDeleteUser(appArray,userToDelete) {
	var rs = "<H1>Applications do delete user from</H1><P>";
	var urls = [];
	appArray.forEach(function(app){
		urls.push(
			"https://appengine.google.com/permissions?app_id=" + encodeURIComponent(app) + 
			"&rp-user-delete=" + encodeURIComponent(userToDelete));
		rs += app + "<br>"
	});
	document.getElementById("apptable").innerHTML=rs;
	// chrome.windows.create({focused:false,url:urls});
	openWindowTabs(urls);
};

function openWindowTabs(urlList) {
	console.log("open window " + urlList)
	chrome.windows.create({focused:false,url:urlList},closeWindowTabs);
};

function closeWindowTabs(tabsWindow) {
	console.log("tabsWindow:" + Object.keys(tabsWindow).toString());
	displayKnownInfo();
	window.setTimeout(function(){ chrome.windows.remove(tabsWindow["id"]) },15000);
};

function updateInfo() {
	console.log("send message: clear old user list")
	chrome.runtime.sendMessage(
		{method:'clearUserList'}
		);
	console.log("send message: read list of known apps with callback for scraping")
	chrome.runtime.sendMessage(
		{method:'getAppList'}, 
		openWindowTabsScraper
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


