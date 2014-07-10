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
                        // note: this is an mdash, not a dash!
                        var user = e[0].innerHTML.replace(/—.*/,'').replace(/\s/g,'');
                        var access = e[1].getElementsByTagName("select")[0].value;
                        console.log(user);
                        chrome.runtime.sendMessage({method:'addUser',"user":user,"application":appnm,"access":access})
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

function ae_p_user_delete() {
    var getargs = window.location.search.substr(1).split("&");
    var deleteUser = undefined;

    console.log("args: " + getargs)
    for (var ii=0; ii<getargs.length; ii++) {
        if (getargs[ii].match(/^rp-user-delete=/)) {
            deleteUser = decodeURIComponent(getargs[ii].replace(/^rp-user-delete=/,''));
        }
    }
    console.log("delete user: " + deleteUser)

    // if (deleteUser) {
    //    alert("Will delete " + deleteUser);
    // }

    // this is a large amount of code replication with ae_p_perms_list_users()
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
                        // note: this is an mdash, not a dash!
                        var user = e[0].innerHTML.replace(/—.*/,'').replace(/\s/g,'');

                        if (user == deleteUser) {
                            // alert(e[3].getElementsByTagName("form")[0]);
                            console.log(e[3].getElementsByTagName("form")[0]);
                            e[3].getElementsByTagName("form")[0].submit();
                        }
                    }
                }
            )
        }
    }    

//       // // Once we cliced the button we will either get an error or a 302 to
//       // // the version page. Either way we want to close the window. Do so
//       // // after a sensible timeout
//       // setTimeout(function() { window.close(); },5000);
};

ae_p_perms_list_users();
ae_p_perms_list_apps();
ae_p_user_delete();
//alert("loaded")