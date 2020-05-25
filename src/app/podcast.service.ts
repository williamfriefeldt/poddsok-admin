import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Podcast } from './podcast';
import { Episode } from './episode';
import { Minute } from './minute';
import { PODCASTS } from './podcasts';
import { MessageService } from './message.service';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class PodcastService {

	sortNr( a: any, b:any ): number {
		if ( a.nr < b.nr ) {
        	return -1;
        } else if ( a.nr > b.nr ) {
            return 1;
        } else{
            return 0;
        }
		return 0;
	}

	getPodcasts(): Observable<Podcast[]> {
		if ( PODCASTS.length === 0 ) {
			this.firebaseService.getPodcasts()
				.subscribe( res => {
					res.forEach( podcast => {
						const episodes = <Episode[]> Object.values(podcast.payload.val());
						episodes.forEach( ep => {
							const epMin = <Minute[]> Object.values(ep.minutes).filter(
								min => min.text !== ''
							);
							ep.minutes = epMin;
						})
						PODCASTS.push(
						{
							title: podcast.key,
							episodes: episodes.sort( this.sortNr ),
							epsNr: Object.keys(episodes).length
						})
					});
					this.messageService.add( 'Podcast fetched from Firebase!' );
				});
		} else {
			this.messageService.add( 'Podcasts fetched from service!' );		
		}
		return of(PODCASTS);
	}

	getPodcast( title: string ): Observable<Podcast> {
		this.messageService.add( `Podcast ${title} fetched!` );
		return of(PODCASTS.find(pod => pod.title === title ));
	}

	removeMinText( podcast: Podcast, episode: Episode, min: Minute ): Observable<Podcast> {
		const removeMinText = podcast.episodes[ episode.nr - 1 ].minutes
			.filter( minute => minute.nr !== min.nr );
		return of(podcast);
	}

  constructor(
  	private messageService: MessageService,
  	private firebaseService: FirebaseService
  ) { }
}
