import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Podcast } from './podcast';
import { PODCASTS } from './podcasts';
import { MessageService } from './message.service';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class PodcastService {
	getPodcasts(): Observable<Podcast[]> {
		this.firebaseService.getPodcasts();
		this.messageService.add( 'Podcasts fetched!' );
		return of(PODCASTS);
	}

	getPodcast( title: string ): Observable<Podcast> {
		this.messageService.add( `Podcast ${title} fetched!` );
		return of(PODCASTS.find(pod => pod.title === title ));
	}

  constructor(
  	private messageService: MessageService,
  	private firebaseService: FirebaseService
  ) { }
}
