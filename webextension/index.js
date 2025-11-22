/**
 *
 * @param {string} text
 * @return {Promise<boolean>}
 */
async function writeIntoClipboard(text) {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch (error) {
		// strip-debug-ignore-next
		console.log(error);
		return false;
	}
}

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



async function updateMenu() {
	console.debug("updateMenu");
	await chrome.contextMenus.removeAll();
	await chrome.contextMenus.create({
		id: 'link_CopyTextLink',
		title: chrome.i18n.getMessage("copyLinkText"),
		contexts: ["link"],
		targetUrlPatterns: ["http://*/*", "https://*/*"]
	});
	await chrome.contextMenus.refresh();
}
let once = false;
chrome.contextMenus.onShown.addListener(function (context) {
	if (once || !context.menuIds.length || !context.contexts.includes('link')) return;
	once = true;
	updateMenu();
});



chrome.contextMenus.onClicked.addListener(async function (info) {
	const success = await writeIntoClipboard(info.linkText)
		// strip-debug-ignore-next
		.catch(console.error);
	if (!success) {
		doNotif(
			chrome.i18n.getMessage("errorTitle"),
			chrome.i18n.getMessage("errorDesc")
		)
			.then(console.debug)
			.catch(console.error);
	}
	// strip-debug-ignore-next
	console[(success) ? "debug" : "warn"](`Copy to clipboad ${(success) ? "success" : "error"}`);
});
