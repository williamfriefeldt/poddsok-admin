import { Episode } from './episode';
import { Podcast } from './podcast';

export interface NewEps {
	title: string,
	name: string,
	newEps: Episode[],
	podcast: Podcast,
	latestEp: string
}