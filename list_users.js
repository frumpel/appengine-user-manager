function ae_p_perms_list_users() {
    var appnm = document.getElementById("ae-appbar-app-id").selectedOptions[0].innerHTML.replace(/\[[^\[\]]*\]/,'').replace(/\s/g,'');
    var table = document.getElementById("ae-admin-dev-table");

    if (table != null) {
        var lines = table.getElementsByTagName("tr");
        if (lines.length > 0) {
            var c = Array.prototype.slice.call(lines);
            c.forEach(
                function(entry) {
                    var e = entry.getElementsByTagName("td");
                    if (e.length == 4) {
                        var user = e[0].innerHTML.replace(/\s/g,'');
                        console.log(user);
                        chrome.runtime.sendMessage({method:'addUser',"user":user,"application":appnm})
                    }
                }
            )
        }
    }
};

function ae_p_perms_list_apps() {
    var options = document.getElementById("ae-appbar-app-id").options;
    if (options.length > 0) {
        var oarr = Array.prototype.slice.call(options);
        oarr.forEach(function(option){
            var appuri = option.value;
            console.log(appuri)
            chrome.runtime.sendMessage({method:'addApp',"application":appuri})
        })
    }              
};

ae_p_perms_list_users();
ae_p_perms_list_apps();
//alert("loaded")