import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Podcast } from './podcast';
import { PODCASTS } from './podcasts';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class PodcastService {
	getPodcasts(): Observable<Podcast[]> {
		this.messageService.add( 'Podcasts fetched!' );
		return of(PODCASTS);
	}

  constructor(private messageService: MessageService) { }
}
