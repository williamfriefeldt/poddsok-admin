import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Podcast } from './podcast';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

	private clientID = 'a15e3712d52f40edb5cd1644f543cef1';
	private spotifyURL = 'https://api.spotify.com/v1/shows/';
  private authURL = 'http://localhost:8888/login';

  constructor(
  	private http: HttpClient,
    private cookie: CookieService
  ) { }

  searchPod(pod: Podcast): Observable<Object> {
    const accessToken = this.cookie.get( 'accessToken' );
    if( pod ) { 
      const podcastID = pod.info.spotifyID;
      return this.http.get( this.spotifyURL + podcastID + '/episodes?limit=50', { headers: { Authorization: 'Bearer ' + accessToken} } );
    } else {
      return of(undefined);
    }
  }
}
