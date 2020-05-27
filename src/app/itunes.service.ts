import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ItunesService {

	url: string = 'https://itunes.apple.com/search?term=';

  constructor( private http: HttpClient ) { }

  searchPod( podcast: string ): Observable<Object> {
  	console.log(this.url + podcast);
  	return this.http.get( this.url + podcast );
  }
}
