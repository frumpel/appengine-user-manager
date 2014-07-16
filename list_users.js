function ae_p_perms_list_users() {
    var appnm, table, lines, c, e, user, access, disabled;

    console.log(arguments.callee.name);

    appnm = document.getElementById("ae-appbar-app-id").selectedOptions[0].innerHTML.replace(/\[[^\[\]]*\]/,'').replace(/\s/g,'');
    table = document.getElementById("ae-admin-dev-table");

    // this could probably be simplified with XPath
    if (table != null) {
        lines = table.getElementsByTagName("tr");
        if (lines.length > 0) {
            c = Array.prototype.slice.call(lines);
            c.forEach(
                function(entry) {
                    e = entry.getElementsByTagName("td");
                    if (e.length == 4) {
                        // note: this is an mdash, not a dash!
                        user = e[0].innerHTML.replace(/—.*/,'').replace(/\s/g,'');
                        access = e[1].getElementsByTagName("select")[0].value;
                        disabled = e[1].getElementsByTagName("select")[0].disabled;
                        console.log(arguments.callee.name + ": " + user);
                        chrome.runtime.sendMessage({
                            "method":"addUser",
                            "user":user,
                            "application":appnm,
                            "access":access,
                            "disabled":disabled});
                    }
                }
            );
        }
    }
}

function ae_p_perms_list_apps() {
    var options, oarr, appuri;
    
    console.log(arguments.callee.name);

    options = document.getElementById("ae-appbar-app-id").options;
    if (options.length > 0) {
        oarr = Array.prototype.slice.call(options);
        oarr.forEach(function(option){
            appuri = option.value;
            console.log(arguments.callee.name + ": " + appuri);
            chrome.runtime.sendMessage({method:'addApp',"application":appuri});
        });
    }              
}

function ae_p_user_delete() {
    var getargs, deleteUser, ii, appnm, table, lines, c, e, user, funSelected;

    funSelected = false;
    getargs = window.location.search.substr(1).split("&");
    console.log(arguments.callee.name + ": " + getargs);

    for (ii=0; ii<getargs.length; ii++) {
        if (getargs[ii].match(/^rp-user-delete=/)) {
            deleteUser = decodeURIComponent(getargs[ii].replace(/^rp-user-delete=/,''));
            funSelected = true;
        }
    }

    if (funSelected) {

        console.log(arguments.callee.name + ": delete user params: " + deleteUser);

        // this is a large amount of code replication with ae_p_perms_list_users()
        // even more to the point this would be much more obvious with a single xpath query
        appnm = document.getElementById("ae-appbar-app-id").selectedOptions[0].innerHTML.replace(/\[[^\[\]]*\]/,'').replace(/\s/g,'');
        table = document.getElementById("ae-admin-dev-table");

        if (table != null) {
            lines = table.getElementsByTagName("tr");
            if (lines.length > 0) {
                c = Array.prototype.slice.call(lines);
                c.forEach(
                    function(entry) {
                        e = entry.getElementsByTagName("td");
                        if (e.length == 4) {
                            // note: this is an mdash, not a dash!
                            user = e[0].innerHTML.replace(/—.*/,'').replace(/\s/g,'');

                            if (user == deleteUser) {
                                // alert(e[3].getElementsByTagName("form")[0]);
                                console.log(e[3].getElementsByTagName("form")[0]);
                                e[3].getElementsByTagName("form")[0].submit();
                            }
                        }
                    }
                );
            }
        }    
    }

//       // // Once we cliced the button we will either get an error or a 302 to
//       // // the version page. Either way we want to close the window. Do so
//       // // after a sensible timeout
//       // setTimeout(function() { window.close(); },5000);
}


function ae_p_user_add() {
    var getargs, addUser, addType, ii, funSelected;

    funSelected = false;
    getargs = window.location.search.substr(1).split("&");
    console.log(arguments.callee.name + ": " + getargs);

    for (ii=0; ii<getargs.length; ii++) {
        if (getargs[ii].match(/^rp-user-add=/)) {
            addUser = decodeURIComponent(getargs[ii]).replace(/^rp-user-add=/,'').replace(/:.*$/,'');
            addType = decodeURIComponent(getargs[ii]).replace(/^rp-user-add=/,'').replace(/^.*:/,'');
            funSelected = true;
        }
    }

    if (funSelected) {
        console.log(arguments.callee.name + ": adding" +  + addUser + " with type " + addType);

        if ((addUser != undefined) && (addType != undefined)) {
            document.getElementById("new_admin").value=addUser;
            document.getElementById("ae-admin-dev-role-new").value=addType;
            document.getElementsByClassName("ae-form")[0].submit();
        }
    }

    // this is a large amount of code replication with ae_p_perms_
//       // // Once we cliced the button we will either get an error or a 302 to
//       // // the version page. Either way we want to close the window. Do so
//       // // after a sensible timeout
//       // setTimeout(function() { window.close(); },5000);
}


function ae_p_user_fix() {
    var getargs, fixUser, fixType, ii, funSelected, XPathRes, selector;

    funSelected = false;
    getargs = window.location.search.substr(1).split("&");
    console.log(arguments.callee.name + ": " + getargs);

    for (ii=0; ii<getargs.length; ii++) {
        if (getargs[ii].match(/^rp-user-fix=/)) {
            fixUser = decodeURIComponent(getargs[ii]).replace(/^rp-user-fix=/,'').replace(/:.*$/,'');
            fixType = decodeURIComponent(getargs[ii]).replace(/^rp-user-fix=/,'').replace(/^.*:/,'');
            funSelected = true;
        }
    }

    if (funSelected) {
        console.log(arguments.callee.name + ": fixing" +  + fixUser + " with type " + fixType);

        // ... this seems more straightforward ...
        XPathRes = document.evaluate(
            '//select[../input[@name="update_role"] and ../input[@value="' + fixUser + '"]]', 
            document, null, XPathResult.ANY_TYPE, null );

        // Set the value
        selector = XPathRes.iterateNext();
        selector.value = fixType;

        // Find and submit
        XPathRes = document.evaluate(
            '//form[input[@name="update_role"] and input[@value="' + fixUser + '"]]', 
            document, null, XPathResult.ANY_TYPE, null );
        roleForm = XPathRes.iterateNext();
        roleForm.submit();


        // if ((addUser != undefined) && (addType != undefined)) {
        //     document.getElementById("new_admin").value=addUser;
        //     document.getElementById("ae-admin-dev-role-new").value=addType;
        //     document.getElementsByClassName("ae-form")[0].submit();
        // }
    }

    // this is a large amount of code replication with ae_p_perms_
//       // // Once we cliced the button we will either get an error or a 302 to
//       // // the version page. Either way we want to close the window. Do so
//       // // after a sensible timeout
//       // setTimeout(function() { window.close(); },5000);
}

ae_p_perms_list_users();
ae_p_perms_list_apps();
ae_p_user_delete();
ae_p_user_add();
ae_p_user_fix();
//alert("loaded")