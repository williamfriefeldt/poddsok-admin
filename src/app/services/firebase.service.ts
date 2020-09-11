import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { AngularFireDatabase } from '@angular/fire/database';
import { Podcast } from '../interfaces/podcast';
import { Minute } from '../interfaces/minute';
import { Episode } from '../interfaces/episode';

@Injectable({
  providedIn: 'root'
})

/**
 * @description Read and write data from Firebase Database.
 */

export class FirebaseService {

	items: Observable<any[]>;

  /**
   * @description Get all podcasts from Firebase Database.
   * @return { Observable } Return promise with podcasts.
   */
  getPodcasts(): Observable<any[]> {
  	this.items = this.db.list( '/' ).snapshotChanges();
  	return this.items;
  } 

  /**
   * @description
   * @paramk
   * @param
   * @return
   */
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

  removePod( podcast: string ): Promise<void> {
    return this.db.list(podcast).remove();
  }
  
  constructor( private db: AngularFireDatabase ) { }
}
