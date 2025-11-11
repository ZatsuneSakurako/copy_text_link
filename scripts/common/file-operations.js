import fs from "node:fs";
import klawSync from "klaw-sync";

/**
 *
 * @param {string} filePath
 * @param {(data:object, filePath: string) => string} fn
 * @return {void}
 */
export function modifyFile(filePath, fn) {
	let data = fs.readFileSync(filePath, 'utf-8');
	data = fn.call(this, data, filePath);

	if (data === undefined) {
		fs.unlinkSync(filePath);
	} else {
		fs.writeFileSync(filePath, data, 'utf-8');
	}
}


/**
 *
 * @param {string} path
 * @param excludePipe
 * @return {klawSync.Item[]}
 */
function getFilesRecursively(path, excludePipe = null) {
	return klawSync(path, {
		nodir: true,
		filter: excludePipe,
	});
}


/**
 *
 * @param {string} path
 * @param {(data:object, filePath: string) => string} fn
 * @param excludePipe
 * @return {void}
 */
export async function modifyFiles(path, fn, excludePipe = null) {
	const items = getFilesRecursively(path, excludePipe);

	for (const data of items) {
		modifyFile(data.path, fn);
	}
}
