import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Podcast } from '../interfaces/podcast';
import { Episode } from '../interfaces/episode';
import { Minute } from '../interfaces/minute';
import { PODCASTS } from '../interfaces/podcasts';
import { MessageService } from './message.service';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})

/*
* Handles Podcasts
*  - Calls FirebaseService to get podcasts
*  - Podcasts stored in interface PODCASTS
*  - Functions to get, add, update podcast/episodes
*  - Updates MessageService on events
*/

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
					const episodes = <Episode[]> Object.values( podcast.payload.val() );
					var info;
					episodes.forEach( ep => {
						if( ep.minutes !== undefined ) {
							ep.minutes = <Minute[]> Object.values( ep.minutes );
						} else {
							info = ep;
						}
					})
					PODCASTS.push({
						title: podcast.key,
						episodes: episodes.sort( this.sortNr ),
						epsNr: Object.keys(episodes).length,
						info: info,
						image: 'assets/images/' + podcast.key + '.png',
						totalSegments: 0
					});
				});
				PODCASTS.sort( (a, b) => {
          			return ( '' + a.info.name ).localeCompare( b.info.name );
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

	addNewEps( podcast: Podcast, episodes: Episode[]): Observable<Boolean> {
		episodes.forEach( ep => {
			const updateString = '/' + podcast.title;
			this.firebaseService.addNewEps( updateString, ep ).then( () => {
				this.messageService.add( `Updated podcast ${podcast.title} with episode ${ep.name}!` );
				return;				
			});		
		});
		return of(true);
	}

	addNotEps( podcast: Podcast, episodes: Episode[]): Observable<Boolean> {
		episodes.forEach( ep => {
			const updateString = '/' + podcast.title;
			this.firebaseService.addNotEps( updateString, ep ).then( () => {
				this.messageService.add( `Updated podcast ${podcast.title} with episode ${ep.name} to not episodes!` );
				return;				
			});		
		});		
		return of(true);
	}

  constructor(
  	private messageService: MessageService,
  	private firebaseService: FirebaseService
  ) { }
}
