import pJson from "../package.json" with {type: "json"};
import fs from "node:fs";
import path from "node:path";

import webExt from "web-ext";

import {transformSync} from '@babel/core';
import stripDebug from 'strip-debug';


import {modifyFiles} from "./common/file-operations.js";
import {error, info, warning} from "./common/custom-console.js";

const pwd = path.dirname(import.meta.dirname);

if (fs.existsSync(path.join(pwd, `./copy_text_link-${pJson.version}.zip`))) {
	error(`Zip package already exist for version ${pJson.version}!`);
	process.exit(1);
}


const tmpPath = path.normalize(`${pwd}${path.sep}tmp`);
if (fs.existsSync(tmpPath)) {
	warning("Temporary folder already exist, deleting...");
	fs.rmSync(tmpPath, {
		recursive: true,
	});
}
fs.mkdirSync(tmpPath);


console.log("Copying into tmp folder");
try {
	fs.cpSync(path.join(pwd, "./webextension"), tmpPath, { recursive: true });
} catch (e) {
	error(e);
}



console.log("Ready to clean files!");

let excludeDirString = "data/js/lib";
if (process.platform === "win32") {
	excludeDirString = "data\\js\\lib";
}
const excludeDirAndJsFilter = function (item) {
	return !item.path.includes(excludeDirString) && item.stats.isFile() && path.extname(item.path) === '.js';
};

modifyFiles(tmpPath, function (data, filePath) {
	try {
		data = transformSync(data, {
			plugins: [
				stripDebug,
			]
		}).code;
	} catch (err) {
		console.trace();
		info(filePath);
		error(err);
		process.exit(1);
	}
	return data;
}, excludeDirAndJsFilter);


const ignoredFiles = [];
try {
	const packageJson = JSON.parse(fs.readFileSync(path.normalize(pwd + '/package.json')), {
		encoding: 'utf8',
	});
	if (Array.isArray(packageJson.webExt.ignoreFiles)) {
		ignoredFiles.push(...packageJson.webExt.ignoreFiles);
	}
} catch (e) {
	console.error(e);
}

await webExt.cmd.build({
	sourceDir: path.resolve(pwd, './tmp'),
	artifactsDir: '.',
	ignoreFiles: ignoredFiles,
}, {
	shouldExitProgram: false,
});
fs.rmSync(tmpPath, { recursive: true });
