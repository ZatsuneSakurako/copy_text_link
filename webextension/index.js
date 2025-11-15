'use strict';

let _ = chrome.i18n.getMessage;

/**
 *
 * @param {string} title
 * @param {string} message
 * @return {Promise<string>}
 */
function doNotif(title, message) {
	return (self.browser ?? chrome).notifications.create({
		type: "basic",
		title: title,
		message: message,
		contextMessage: chrome.runtime.getManifest().name,
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
	chrome.tabs.sendMessage(tab.id, { id: "copyLinkText" }, async function (responseData) {
		const success = responseData && responseData.error === false;
		if (!success) {
			doNotif(_("errorTitle"), _("errorDesc"))
				.then(console.debug)
				// strip-debug-ignore-next
				.catch(console.error);
		}
		console[(success) ? "debug" : "warn"](`Copy to clipboad ${(success) ? "success" : "error"} (${responseData?.error})`);
	});
})
