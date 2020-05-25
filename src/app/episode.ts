import { Minute } from './minute';

export interface Episode {
	length: number,
	minutes: Minute[],
	name: string,
	link: string,
	nr: number
}