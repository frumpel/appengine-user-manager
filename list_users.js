function ae_p_perms_list_users() {
    
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
                        chrome.runtime.sendMessage({method:'userAdd',user:user})
                    }
                }
            )
        }
    }
}

ae_p_perms_list_users();
//alert("loaded")