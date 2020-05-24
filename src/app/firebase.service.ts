import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { AngularFireDatabase } from '@angular/fire/database';
import { Podcast } from './podcast';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  getPodcasts(): Observable<any[]> {
  	return this.db.list('/').snapshotChanges();
  }

  constructor( private db: AngularFireDatabase ) { }
}
