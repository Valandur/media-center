import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { add } from 'date-fns/add';

export function getSize(bytes: number, decimals = 2): [string, string] {
	if (bytes >= 1e12) {
		return [(bytes / 1e12).toFixed(decimals), 'TB'];
	} else if (bytes >= 1e9) {
		return [(bytes / 1e9).toFixed(decimals), 'GB'];
	} else if (bytes >= 1e6) {
		return [(bytes / 1e6).toFixed(decimals), 'MB'];
	} else if (bytes >= 1e3) {
		return [(bytes / 1e3).toFixed(decimals), 'KB'];
	} else {
		return [bytes.toFixed(0), 'B'];
	}
}

export function formatSize(bytes: number, decimals = 2) {
	const [size, unit] = getSize(bytes, decimals);
	return `${size} ${unit}`;
}

export function getSpeed(bytes: number, decimals = 2): [string, string] {
	const [size, unit] = getSize(bytes, decimals);
	return [size, `${unit}/s`];
}

export function formatSpeed(bytesPerSecond: number, decimals = 2) {
	const [size, unit] = getSize(bytesPerSecond, decimals);
	return `${size} ${unit}/s`;
}

export function formatEta(seconds: number | null) {
	return typeof seconds === 'number'
		? seconds <= 5
			? 'now'
			: formatDistanceToNow(add(new Date(), { seconds }), { includeSeconds: true })
		: 'unknown';
}
