import { Episode } from './episode';

export interface Podcast {
	episodes: Episode[];
	title: string;
	epsNr: number;
	info: {
		spotifyID: string,
		finished: boolean,
		image: string
	};
	image: string;
}