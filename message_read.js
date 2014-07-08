function get_info() {
	chrome.runtime.sendMessage(
		{method:'getUserList'}, 
		function(response){
			// $('.output').innerText=response;
			var rs = "Response:<P>" ;
			var rskeys = Object.keys(response).sort(
				function (a, b) { return a.toLowerCase().localeCompare(b.toLowerCase())});
			rskeys.forEach(function(entry){
				rs += entry.toString() + "<BR>";
			})
			document.getElementsByClassName("output")[0].innerHTML=rs;
		});
};

window.addEventListener('load',get_info);