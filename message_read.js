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
	var checkboxes = document.getElementsByClassName(toggleUser); // this should also select for prod/nonprod but we don't have that tagged yet
    for(var ii=0, nn=checkboxes.length; ii<nn;ii++) {
    	checkboxes[ii].checked = toggleSource.checked;
  	};
};

function formatUserHash(userHash) {
	var rs = "<H1>Appengine Users</H1><P>";
	var apps = getFirstLevelKeys(userHash);
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

		eptr = document.createElement("input")
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
			tcel = trow.insertCell(-1);
			// tcel.class = "";
			eptr = document.createElement("input")
			eptr.type = "checkbox";
			eptr.className = app + " " + user; // should have prod/nonprod
			eptr.checked = (userHash[app][user] == true);
			tcel.appendChild(eptr);
		});
	});

	var usertable = document.getElementById("usertable");
	while (usertable.firstChild) {
    	usertable.removeChild(usertable.firstChild);
	}
	usertable.appendChild(tptr);
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
		{method:'clearUserList'}
		);
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

