import chalk from "chalk";

/**
 *
 * @param {String} msg
 */
export function error(msg){
	return console.log(chalk.bold.red(msg));
}

/**
 *
 * @param {String} msg
 */
export function warning(msg){
	return console.log(chalk.keyword('orange')(msg));
}

/**
 *
 * @param {String} msg
 */
export function info(msg) {
	return console.log(chalk.blueBright(msg));
}

/**
 *
 * @param {String} msg
 */
export function success(msg){
	return console.log(chalk.green(msg));
}
