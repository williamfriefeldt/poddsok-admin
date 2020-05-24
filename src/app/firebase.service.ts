import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { AngularFireDatabase } from '@angular/fire/database';
import { Podcast } from './podcast';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  podcasts: Observable<Podcast[]>;

  getPodcasts(): Observable<Podcast[]> {
  	this.podcasts = this.db.list('/');
  	console.log(this.podcasts);
  }

  constructor( private db: AngularFireDatabase ) {
  	
  }
}
