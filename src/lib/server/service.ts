import { Logger } from './logger';

export abstract class Service {
	protected logger: Logger;

	protected constructor(name: string) {
		this.logger = new Logger(name);
	}
}
