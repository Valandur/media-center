import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { add } from 'date-fns/add';

export function getSize(bytes: number): [string, string] {
	if (bytes > 1e12) {
		return [(bytes / 1e12).toFixed(2), 'TB'];
	} else if (bytes > 1e9) {
		return [(bytes / 1e9).toFixed(2), 'GB'];
	} else if (bytes > 1e6) {
		return [(bytes / 1e6).toFixed(2), 'MB'];
	} else if (bytes > 1e3) {
		return [(bytes / 1e3).toFixed(2), 'KB'];
	} else {
		return [bytes.toFixed(0), 'B'];
	}
}

export function formatSize(bytes: number) {
	const [size, unit] = getSize(bytes);
	return `${size} ${unit}`;
}

export function getSpeed(bytes: number): [string, string] {
	const [size, unit] = getSize(bytes);
	return [size, `${unit}/s`];
}

export function formatSpeed(bytesPerSecond: number) {
	const [size, unit] = getSize(bytesPerSecond);
	return `${size} ${unit}/s`;
}

export function formatEta(seconds: number | null) {
	return typeof seconds === 'number'
		? seconds === 0
			? 'now'
			: formatDistanceToNow(add(new Date(), { seconds }), { includeSeconds: true })
		: 'unknown';
}
