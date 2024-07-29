import { format } from 'date-fns/format';
import { inspect } from 'node:util';
import chalk from 'chalk';
import { env } from '$env/dynamic/private';

enum LogLevel {
	'debug' = 0,
	'info' = 1,
	'warn' = 2,
	'error' = 3
}

const LEVEL: LogLevel = LogLevel[env.LOG_LEVEL as keyof typeof LogLevel] ?? LogLevel.debug;

export class Logger {
	private readonly moduleLowerName;
	public constructor(private readonly moduleName: string) {
		this.moduleLowerName = moduleName.toLowerCase();
	}

	private getDate() {
		return chalk.grey(format(new Date(), 'HH:mm:ss'));
	}

	public debug(message: unknown, ...params: unknown[]) {
		if (LEVEL > 0) {
			return;
		}
		const msg = chalk.gray(typeof message === 'string' ? message : inspect(message));
		console.log(
			`${this.getDate()} [${chalk.gray('DEBUG')}] [${chalk.green(this.moduleName)}] ${msg}`,
			...params
		);
	}
	public info(message: unknown, ...params: unknown[]) {
		if (LEVEL > 1) {
			return;
		}
		const msg = typeof message === 'string' ? message : inspect(message);
		console.log(
			`${this.getDate()} [${chalk.cyan('INFO')}] [${chalk.green(this.moduleName)}] ${msg}`,
			...params
		);
	}
	public warn(message: unknown, ...params: unknown[]) {
		if (LEVEL > 2) {
			return;
		}
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
