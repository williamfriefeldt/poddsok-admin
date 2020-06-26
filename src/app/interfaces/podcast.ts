import { Episode } from './episode';

export interface Podcast {
	episodes: Episode[];
	title: string;
	epsNr: number;
	info: {
		spotifyID: string,
		finished: boolean,
		image: string,
		notEPs: [],
		name: string
	};
	image: string;
	totalSegments: number;
}