// List of domains we accept in emails
var okDomains = [
	"smarttech.com",
	"smarttechuat.com",
	"smartwizardschool.com",
	"gserviceaccount.com",
	"appspot.gserviceaccount.com"
];

// Global variables - don't touch ----------------------------------------------

var odef = [
	["UNDEFINED","------"],
	["APP_VIEWER",   "Viewer"],
	["APP_DEVELOPER","Developer"],
	["APP_OWNER",    "Owner"]
];

var accessHash = {}; // a local copy of known info ... populated by formatUserHash

// Utility functions -----------------------------------------------------------

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

// URL formatters --------------------------------------------------------------

function createScraperURL(app) {
	return "https://appengine.google.com/permissions?" + 
		"app_id=" + encodeURIComponent(app);
}

function createAddURL(app,userToAdd,userPermissions) {
	return "https://appengine.google.com/permissions?" +
		"app_id=" + encodeURIComponent(app) + 
		"&rp-user-add=" + encodeURIComponent(userToAdd + ":" + userPermissions);
}

function createDeleteURL(app,userToDelete) {
	return "https://appengine.google.com/permissions?" +
		"app_id=" + encodeURIComponent(app) + 
		"&rp-user-delete=" + encodeURIComponent(userToDelete);
}

function createFixURL(app,userToFix,userPermissions) {
	return "https://appengine.google.com/permissions?" +
		"app_id=" + encodeURIComponent(app) + 
		"&rp-user-fix=" + encodeURIComponent(userToFix + ":" + userPermissions);
}

// tab/window handlers ---------------------------------------------------------



// function openWindowDeleteUser(appArray,userToDelete) {
// 	var rs, urls;

// 	rs = "<H1>Applications do delete user from</H1><P>";
// 	urls = [];

// 	appArray.forEach(function(app){
// 		urls.push(createDeleteURL(app,userToDelete));
// 		rs += app + "<br>";
// 	});
// 	document.getElementById("apptable").innerHTML=rs;
// 	openWindowTabs(urls);
// }

// function openWindowAddUser(appHash,userToAdd) {
// 	var rs, urls;

// 	rs = "<H1>Applications to add user to</H1><P>";
// 	urls = [];

// 	console.log("openWindowAddUser: args: " + userToAdd);
// 	console.log("openWindowAddUser: args: " + appHash);
// 	console.log("openWindowAddUser: args: " + Object.keys(appHash));

// 	Object.keys(appHash).forEach(function(app) {
// 		urls.push(createAddURL(app,userToAdd,appHash[app]));
// 		rs += app + ":" + appHash[app] + "<BR>";
// 	});
// 	document.getElementById("apptable").innerHTML=rs;
// 	openWindowTabs(urls);
// }

// function openWindowFixUser(appHash,userToAdd) {
// 	var rs, urls;

// 	rs = "<H1>Applications to fix user in</H1><P>";
// 	urls = [];

// 	console.log("openWindowFixUser: args: " + userToAdd);
// 	console.log("openWindowFixUser: args: " + appHash);
// 	console.log("openWindowFixUser: args: " + Object.keys(appHash));

// 	Object.keys(appHash).forEach(function(app) {
// 		urls.push(
// 			"https://appengine.google.com/permissions?app_id=" + encodeURIComponent(app) + 
// 			"&rp-user-fix=" + encodeURIComponent(userToAdd + ":" + appHash[app]));
// 		rs += app + ":" + appHash[app] + "<BR>";
// 	});
// 	document.getElementById("apptable").innerHTML=rs;
// 	// chrome.windows.create({focused:false,url:urls});
// 	openWindowTabs(urls);
// }

function openWindowTabs(urlList) {
	console.log("open window with tabs:");
	urlList.forEach(function(entry) { console.log(entry); } );
	chrome.windows.create({focused:false,url:urlList},closeWindowTabs);
}

function closeWindowTabs(tabsWindow) {
	console.log("tabsWindow:" + Object.keys(tabsWindow).toString());
	displayKnownInfo();
	window.setTimeout(function(){ chrome.windows.remove(tabsWindow["id"]); },60000);
}

// click handlers --------------------------------------------------------------

function toggleUsers(toggleSource,toggleEnv,toggleUser) {
	var selections, ii, nn;

	console.log("toggle users " + toggleSource + " " + toggleUser + " " + toggleEnv);
	selections = document.getElementsByClassName(toggleUser + " " + toggleEnv + " APPSELECTOR");
    for(ii=0, nn=selections.length; ii<nn;ii++) {
    	selections[ii].value = toggleSource.value;
  	}
}

function scrapeInfo(appHash) {
	var rs, apps, urls;

	rs = "<H1>Applications to check</H1><P>";
	apps = getFirstLevelKeys(appHash);
	urls = [];

	console.log("Open scraper window " +  apps);

	apps.forEach(function(app){
		urls.push(createScraperURL(app));
		rs += app + "<br>";
	});
	document.getElementById("apptable").innerHTML=rs;
	openWindowTabs(urls);
}
function deleteUser(userToDelete) {
	var appa, apps, appn, urls;

	appa = Array.prototype.slice.call(document.getElementsByClassName(userToDelete + " APPSELECTOR"));
	apps = [];
	urls = [];

	appa.forEach(function(appi){
		if (appi.selectedIndex > 0) {
			appn = appi.className.replace(userToDelete,"").replace(/(APPSELECTOR|(NON)?PROD)/g,"").replace(/\s/g,'');
			apps.push(appn);
			urls.push(createDeleteURL(appn,userToDelete));
		}
	});
	
	if (confirm("Would delete " + userToDelete + " from " + apps)) {
		// document.getElementById("messages").innerText="Would delete " + userToDelete + " from " + apps;
		openWindowTabs(urls);
	}
}

function addUser(userToAddInput) {
	var appa, appn, rs, urls, userToAdd;

	appa = Array.prototype.slice.call(document.getElementsByClassName("ADDUSER APPSELECTOR"));
	appn = "";
	urls = [];
	userToAdd = userToAddInput.value;

	rs = "Add user  " + userToAdd + "\n";
	appa.forEach(function(appi){
		if (appi.value != "UNDEFINED") {
			appn = appi.className.replace(/(ADDUSER|APPSELECTOR|(NON)?PROD)/g,"").replace(/\s/g,'');
			rs += appn + ":" + appi.value + "\n";
			urls.push(createAddURL(appn,userToAdd,appi.value))
		}
	});

	if (confirm(rs)) {
		openWindowTabs(urls);
	}
}

function fixUser(userToFix) {
	var appa, apph, appn, rs, urls;

	appa = Array.prototype.slice.call(document.getElementsByClassName("APPSELECTOR " + userToFix));
	apph = {};
	appn = "";
	urls = [];

    apps = getFirstLevelKeys(accessHash);

    rs = "Fix user  " + userToFix + "\n";
	appa.forEach(function(appi){
		// console.log("userToFix: " + userToFix);
		// console.log("appi.classname: " + appi.className);
		appn = appi.className.replace(/(ADDUSER|APPSELECTOR|(NON)?PROD)/g,"").replace(userToFix,'').replace(/\s/g,'');
		// console.log("appn: " + appn)
		pcur = (typeof(accessHash[appn][userToFix]) == "undefined" ? "UNDEFINED" : accessHash[appn][userToFix]);
		pnew = (typeof(appi.value                 ) == "undefined" ? "UNDEFINED" : appi.value                 );

		console.log("Fix user: " + pcur + " to " + pnew)
		if (pnew != pcur) {
			if (pnew == "UNDEFINED") { 
				console.log(" ... DELETE");
				urls.push(createDeleteURL(appn,userToFix));
				rs += "delete:" + userToFix + ":" + appn + "\n";
			}
			else if (pcur == "UNDEFINED") {
				console.log(" ... ADD");
				urls.push(createAddURL(appn,userToFix,pnew));				
				rs += "add:" + userToFix + ":" + appn + ":" + pnew + "\n";
			}
			else {
				console.log(" ... MODIFY")
				urls.push(createFixURL(appn,userToFix,pnew));
				rs += "modify:" + userToFix + ":" + appn + ":" + pnew + "\n";
			}
		}
	});

	if (confirm(rs)) {
		openWindowTabs(urls);
	}	
}

// Data formatters / document content ------------------------------------------

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

    accessHash = userHash; // is this safe? Will the data be retained?

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

		eptr = document.createElement("button");
		eptr.appendChild(document.createTextNode("FIX"));
		eptr.className = "fix " + user;
		eptr.onclick = function(){ fixUser(user); };
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



// ??? -------------------------------------------------------------------------

function updateInfo() {
	console.log("send message: clear old user list");
	chrome.runtime.sendMessage(
		{method:'clearUserList'}
		);
	console.log("send message: read list of known apps with callback for scraping");
	chrome.runtime.sendMessage(
		{method:'getAppList'}, 
		scrapeInfo
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


