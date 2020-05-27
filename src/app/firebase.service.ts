import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { AngularFireDatabase } from '@angular/fire/database';
import { Podcast } from './podcast';
import { Minute } from './minute';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

	items: Observable<any[]>;

  getPodcasts(): Observable<any[]> {
  	this.items = this.db.list('/').snapshotChanges();
  	return this.items;
  } 

  updateItem(podcast: string, min: Minute): Promise<void> {
  	return this.db.list(podcast).set( 'min' + min.nr , min );
  }
  
  constructor( private db: AngularFireDatabase ) { }
}
