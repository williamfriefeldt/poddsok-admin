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

	private callFirebase(): void {
		this.firebaseService.getPodcasts()
			.subscribe( res => {
				PODCASTS.length = 0;
				res.forEach( podcast => {
					const episodes = <Episode[]> Object.values(podcast.payload.val());
					episodes.forEach( ep => {
						ep.minutes = <Minute[]> Object.values(ep.minutes);
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
	}

	getPodcasts(): Observable<Podcast[]> {
		if ( PODCASTS.length === 0 ) {
			this.callFirebase();
		} else {
			this.messageService.add( 'Podcasts fetched from service!' );
		}
		return of(PODCASTS);	
	}

	getPodcast( title: string ): Observable<Podcast> {
		this.messageService.add( `Podcast ${title} fetched!` );
		return of(PODCASTS.find(pod => pod.title === title ));
	}

	updatePodcast( podcast: Podcast, episode: Episode, min: Minute ): Promise<void> {
		const updateString = '/'+podcast.title+'/ep'+episode.nr+'/minutes';
		return this.firebaseService.updateItem( updateString, min )
			.then( () => {
				this.messageService.add( `Updated podcast ${podcast.title}!` );
				return;
			});
	}

  constructor(
  	private messageService: MessageService,
  	private firebaseService: FirebaseService
  ) { }
}
