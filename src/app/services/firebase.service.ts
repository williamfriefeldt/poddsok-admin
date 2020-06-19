import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { AngularFireDatabase } from '@angular/fire/database';
import { Podcast } from '../interfaces/podcast';
import { Minute } from '../interfaces/minute';
import { Episode } from '../interfaces/episode';

@Injectable({
  providedIn: 'root'
})

/*
* Read and write data from Firebase Database.
*  - Get, add and update podcast/episodes
*/

export class FirebaseService {

	items: Observable<any[]>;

  getPodcasts(): Observable<any[]> {
  	this.items = this.db.list('/').snapshotChanges();
  	return this.items;
  } 

  updateItem( podcast: string, min: Minute ): Promise<void> {
  	return this.db.list(podcast).set( 'min' + min.nr , min );
  }

  addNewEps( podcast: string, episode: Episode ): Promise<void> {
    return this.db.list(podcast).set( 'ep' + episode.nr, episode );
  }

  addPodcast( podcast: string, info: Object ): Promise<void> {
    return this.db.list(podcast).set( 'info', info );
  }

  addNotEps( podcast: string, notEp: Episode ): Promise<void> {
    return this.db.list(podcast).set( 'info/notEPs/' + notEp.nr, { title: notEp.name } );
  }
  
  constructor( private db: AngularFireDatabase ) { }
}
