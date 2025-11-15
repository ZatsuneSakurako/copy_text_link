'use strict';

let _ = chrome.i18n.getMessage;

/**
 *
 * @param {string} title
 * @param {string} message
 * @return {Promise<void>}
 */
function doNotif(title, message) {
	const options = {
		type: "basic",
		title: title,
		message: message,
		contextMessage: chrome.runtime.getManifest().name,
		iconUrl: "/icon.png",
		isClickable: true
	};

	return new Promise((resolve, reject) => {
		chrome.notifications.create(options, function() {
			if (typeof chrome.runtime.lastError === "object" && chrome.runtime.lastError !== null && typeof chrome.runtime.lastError.message === "string" && chrome.runtime.lastError.message.length > 0) {
				const error = chrome.runtime.lastError;
				// strip-debug-ignore-next
				console.error(error);
				reject(error);
			} else {
				resolve();
			}
		});
	});
}
chrome.notifications.onClicked.addListener(function (notificationId) {
	console.info(`${notificationId} (onClicked)`);
	chrome.notifications.clear(notificationId);
});



await chrome.contextMenus.removeAll();
await chrome.contextMenus.create({
	id: 'link_CopyTextLink',
	title:_("copyLinkText"),
	contexts: ["link"],
	targetUrlPatterns: ["http://*/*", "https://*/*"]
});
chrome.contextMenus.onClicked.addListener(function (info, tab) {
	chrome.tabs.sendMessage(tab.id, {
		id: "copyLinkText",
		data: ""
	}, async function (responseData) {
		const success = responseData && responseData.error === false;
		if (!success) {
			doNotif(_("errorTitle"), _("errorDesc"));
		}

		console[(success) ? "debug" : "warn"](`Copy to clipboad ${(success) ? "success" : "error"} (${responseData?.error})`);
	});
})
