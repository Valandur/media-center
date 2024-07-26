import { format } from 'date-fns/format';
import { inspect } from 'node:util';
import chalk from 'chalk';

export class Logger {
	private readonly moduleLowerName;
	public constructor(private readonly moduleName: string) {
		this.moduleLowerName = moduleName.toLowerCase();
	}

	private getDate() {
		return chalk.grey(format(new Date(), 'HH:mm:ss'));
	}

	public debug(message: unknown, ...params: unknown[]) {
		const msg = chalk.gray(typeof message === 'string' ? message : inspect(message));
		console.log(
			`${this.getDate()} [${chalk.gray('DEBUG')}] [${chalk.green(this.moduleName)}] ${msg}`,
			...params
		);
	}
	public info(message: unknown, ...params: unknown[]) {
		const msg = typeof message === 'string' ? message : inspect(message);
		console.log(
			`${this.getDate()} [${chalk.cyan('INFO')}] [${chalk.green(this.moduleName)}] ${msg}`,
			...params
		);
	}
	public warn(message: unknown, ...params: unknown[]) {
		const msg = chalk.yellow(typeof message === 'string' ? message : inspect(message));
		console.log(
			`${this.getDate()} [${chalk.yellow('WARN')}] [${chalk.green(this.moduleName)}] ${msg}`,
			...params
		);
	}
	public error(message: unknown, ...params: unknown[]) {
		const msg = chalk.red(typeof message === 'string' ? message : inspect(message));
		console.error(
			`${this.getDate()} [${chalk.red('ERROR')}] [${chalk.green(this.moduleName)}] ${msg}`,
			...params
		);
	}
}
