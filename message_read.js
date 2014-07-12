var odef = [
	["UNDEFINED","------"],
	["APP_VIEWER",   "Viewer"],
	["APP_DEVELOPER","Developer"],
	["APP_OWNER",    "Owner"]
];

var okDomains = [
	"smarttech.com",
	"smarttechuat.com",
	"smartwizardschool.com"
];

function sortAlphabetically(a,b) {
	return a.toLowerCase().localeCompare(b.toLowerCase());
}

// returns an ARRAY
function getFirstLevelKeys(hash) {
	return Object.keys(hash).sort(sortAlphabetically);
}

// returns an ARRAY
function getSecondLevelKeys(hash) {
	var keys1, keys2, users;
	keys1 = getFirstLevelKeys(hash);
	keys2 = {};

	keys1.forEach(function(app){
		users = getFirstLevelKeys(hash[app]);
		users.forEach(function(user){
			keys2[user] = true;
		});
	});
	return Object.keys(keys2).sort(sortAlphabetically);
}

function toggleUsers(toggleSource,toggleEnv,toggleUser) {
	var selections, ii, nn;

	console.log("toggle users " + toggleSource + " " + toggleUser + " " + toggleEnv);
	selections = document.getElementsByClassName(toggleUser + " " + toggleEnv + " APPSELECTOR");
    for(ii=0, nn=selections.length; ii<nn;ii++) {
    	selections[ii].value = toggleSource.value;
  	}
}

function deleteUser(userToDelete) {
	var appa, apps;

	appa = Array.prototype.slice.call(document.getElementsByClassName(userToDelete + " APPSELECTOR"));
	apps = [];

	appa.forEach(function(appi){
		if (appi.selectedIndex > 0) {
			apps.push(appi.className.replace(userToDelete,"").replace("APPSELECTOR","").replace(/\s/g,''));
		}
	});
	
	if (confirm("Would delete " + userToDelete + " from " + apps)) {
		// document.getElementById("messages").innerText="Would delete " + userToDelete + " from " + apps;
		openWindowDeleteUser(apps,userToDelete);
	}
}

function addUser(userToAdd) {
	var appa, apph, appn, rs;

	appa = Array.prototype.slice.call(document.getElementsByClassName("ADDUSER APPSELECTOR"));
	apph = {};
	appn = "";

	appa.forEach(function(appi){
		if (appi.value != "UNDEFINED") {
			appn = appi.className.replace(/(ADDUSER|APPSELECTOR|(NON)?PROD)/g,"").replace(/\s/g,'');
			apph[appn] = appi.value;
		}
	});

	rs = "Add user  " + userToAdd.value +"\n";
	Object.keys(apph).forEach(function(key) {
		rs += key + ":" + apph[key] + "\n";
	});
	if (confirm(rs)) {
		openWindowAddUser(apph,userToAdd.value);
	}
}

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
}

function formatUserHash(userHash) {
	var apps, appclass, users, tptr, eptr, xptr, trow, tcel, usertable;

	apps = getFirstLevelKeys(userHash);
	appclass = "";
	users = getSecondLevelKeys(userHash);

	tptr = document.createElement("table");
	eptr = null;

	// Header
	trow = tptr.insertRow(-1);
	tcel = trow.insertCell(-1);
	tcel.className = "ch rh";
	tcel.innerText = "apps:" + apps.length + " users:" + users.length;
	apps.forEach(function(app){
		appclass = ((app.replace(/^.*-prod$/,"prod") == "prod") ? "PROD" : "NONPROD" );
		tcel = trow.insertCell(-1);
		tcel.className = "ch " + appclass;
		tcel.innerText = app;
	});

	// Existing Users
	users.forEach(function(user){

		trow = tptr.insertRow(-1);
		if (okDomains.indexOf(user.replace(/^.*@/,'')) == -1) {
			trow.className = "error";
		}

		tcel = trow.insertCell(-1);
		tcel.className = "rh email";

		eptr = document.createElement("button");
		eptr.appendChild(document.createTextNode("DELETE"));
		eptr.className = "delete " + user;
		eptr.onclick = function(){ deleteUser(user); };
		tcel.appendChild(eptr);

		eptr = createOwnershipSelector(0);
		eptr.className = "toggle NONPROD " + user;
		eptr.onchange = function(){ toggleUsers(this,"NONPROD",user); };
		tcel.appendChild(eptr);

		eptr = createOwnershipSelector(0);
		eptr.className = "toggle PROD " + user;
		eptr.onchange = function(){ toggleUsers(this,"PROD",user); };
		tcel.appendChild(eptr);

		eptr = document.createTextNode(user);
		tcel.appendChild(eptr);

		apps.forEach(function(app){
			appclass = ((app.replace(/^.*-prod$/,"prod") == "prod") ? "PROD" : "NONPROD" );
			tcel = trow.insertCell(-1);
			tcel.className = appclass;
			// tcel.className = "";
			// eptr = document.createElement("input")
			// eptr.type = "checkbox";
			// eptr.className = app + " " + user + " " + appclass; // should have prod/nonprod
			// eptr.checked = (userHash[app][user] == true);

			// eptr = document.createTextNode(userHash[app][user]);

			eptr = createOwnershipSelector(userHash[app][user]);
			eptr.className = user + " " + app + " " + "APPSELECTOR" + " " + appclass;

			tcel.appendChild(eptr);
		});
	});

	// Footer
	trow = tptr.insertRow(-1);
	tcel = trow.insertCell(-1);
	tcel.className = "ch rf";

	xptr = document.createElement("input");
	xptr.type = "text";
	xptr.id = "rp-adduser";

	eptr = document.createElement("button");
	eptr.appendChild(document.createTextNode("ADD"));
	eptr.className = "add";
	eptr.onclick = function(){ addUser(xptr); };
	tcel.appendChild(eptr);

	eptr = createOwnershipSelector(0);
	eptr.className = "toggle NONPROD ADDUSER";
	eptr.onchange = function(){ toggleUsers(this,"NONPROD","ADDUSER"); };
	tcel.appendChild(eptr);

	eptr = createOwnershipSelector(0);
	eptr.className = "toggle PROD ADDUSER";
	eptr.onchange = function(){ toggleUsers(this,"PROD","ADDUSER"); };
	tcel.appendChild(eptr);

	tcel.appendChild(xptr);
     
	apps.forEach(function(app){
		appclass = ((app.replace(/^.*-prod$/,"prod") == "prod") ? "PROD" : "NONPROD" );
		tcel = trow.insertCell(-1);
		tcel.className = "cf " + appclass;

		eptr = createOwnershipSelector(0);
		eptr.className = "ADDUSER" + " " + app + " " + "APPSELECTOR" + " " + appclass;

		tcel.appendChild(eptr);
	});


	usertable = document.getElementById("usertable");
	while (usertable.firstChild) {
    	usertable.removeChild(usertable.firstChild);
	}
	usertable.appendChild(tptr);
}

function openWindowTabsScraper(appHash) {
	var rs, apps, urls;

	rs = "<H1>Applications to check</H1><P>";
	apps = getFirstLevelKeys(appHash);
	urls = [];

	console.log("Open scraper window " +  apps);

	apps.forEach(function(app){
		urls.push("https://appengine.google.com/permissions?app_id=" + app);
		rs += app + "<br>";
	});
	document.getElementById("apptable").innerHTML=rs;
	// chrome.windows.create({focused:false,url:urls},closeWindowTabs);
	openWindowTabs(urls);
}

function openWindowDeleteUser(appArray,userToDelete) {
	var rs, urls;

	rs = "<H1>Applications do delete user from</H1><P>";
	urls = [];

	appArray.forEach(function(app){
		urls.push(
			"https://appengine.google.com/permissions?app_id=" + encodeURIComponent(app) + 
			"&rp-user-delete=" + encodeURIComponent(userToDelete));
		rs += app + "<br>";
	});
	document.getElementById("apptable").innerHTML=rs;
	// chrome.windows.create({focused:false,url:urls});
	openWindowTabs(urls);
}

function openWindowAddUser(appHash,userToAdd) {
	var rs, urls;

	rs = "<H1>Applications do add user to</H1><P>";
	urls = [];

	console.log("openWindowAddUser: args: " + userToAdd);
	console.log("openWindowAddUser: args: " + appHash);
	console.log("openWindowAddUser: args: " + Object.keys(appHash));

	Object.keys(appHash).forEach(function(app) {
		urls.push(
			"https://appengine.google.com/permissions?app_id=" + encodeURIComponent(app) + 
			"&rp-user-add=" + encodeURIComponent(userToAdd + ":" + appHash[app]));
		rs += app + ":" + appHash[app] + "<BR>";
	});
	document.getElementById("apptable").innerHTML=rs;
	// chrome.windows.create({focused:false,url:urls});
	openWindowTabs(urls);
}


function openWindowTabs(urlList) {
	console.log("open window " + urlList);
	chrome.windows.create({focused:false,url:urlList},closeWindowTabs);
}

function closeWindowTabs(tabsWindow) {
	console.log("tabsWindow:" + Object.keys(tabsWindow).toString());
	displayKnownInfo();
	window.setTimeout(function(){ chrome.windows.remove(tabsWindow["id"]); },60000);
}

function updateInfo() {
	console.log("send message: clear old user list");
	chrome.runtime.sendMessage(
		{method:'clearUserList'}
		);
	console.log("send message: read list of known apps with callback for scraping");
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
}

window.addEventListener('load',displayKnownInfo);
document.getElementById('getdata').addEventListener('click',updateInfo);


