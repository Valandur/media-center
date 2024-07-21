export interface ErrorResponse {
	error: string;
	input: unknown;
	path: string;
	status: number;
}
