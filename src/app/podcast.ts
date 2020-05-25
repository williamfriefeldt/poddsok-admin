import { Episode } from './episode';

export interface Podcast {
	episodes: Episode[];
	title: string;
	epsNr: number;
}