(function(){
	'use strict';

	let linkText;
	document.addEventListener('contextmenu', function(event) {
		linkText = event.target.innerText;
	});

	function errorToString(error) {
		if (!(error instanceof Error)) {
			return JSON.stringify(error);
		}

		return `${error.message}\n${error.stack}`;
	}

	chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
		if (sender.id !== chrome.runtime.id) return;


		let messageData = null;
		if (typeof message == "string") {
			try {
				messageData = JSON.parse(message);
			} catch (err) {}
		} else if (typeof message === "object") {
			messageData = message
		}
		if (messageData === null) {
			return;
		}



		if (messageData.id === "copyLinkText") {
			navigator.clipboard.writeText(linkText)
				.then(() => {
					sendResponse({ error: false });
				})
				.catch(err => {
					sendResponse({ error: errorToString(err) });
				});
			return true;
		}
	});

})();
