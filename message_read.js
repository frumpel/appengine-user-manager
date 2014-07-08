function get_info() {
	chrome.runtime.sendMessage(
		{method:'getUserList'}, 
		function(response){
			$('.output').innerText=response;
		});
};

window.addEventListener('load',get_info);