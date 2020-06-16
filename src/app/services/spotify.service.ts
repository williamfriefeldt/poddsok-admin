import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Podcast } from '../interfaces/podcast';

@Injectable({
  providedIn: 'root'
})

/*
* Handles Spotify API calls.
* Requires accessToken:
* - Start 'node app.js' in main folder
* - Enter 'localhost:8888' in browser
*/

export class SpotifyService {

	private clientID = 'a15e3712d52f40edb5cd1644f543cef1';
	private spotifyURLeps = 'https://api.spotify.com/v1/shows';
  private spotifyURLshow = 'https://api.spotify.com/v1/search?type=show&q='
  private authURL = 'http://localhost:8888/login';

  constructor(
  	private http: HttpClient,
    private cookie: CookieService
  ) { }

  searchPod(pod: Podcast, offset: number): Observable<Object> {
    const accessToken = this.cookie.get( 'accessToken' );
    if( pod ) { 
      const podcastID = pod.info.spotifyID;
      return this.http.get( this.spotifyURLeps + '/' + podcastID + '/episodes?limit=50&offset=' + offset, { headers: { Authorization: 'Bearer ' + accessToken} } );
    } else {
      return of(undefined);
    }
  }

  findPod(query: string): Observable<Object> {
    const accessToken = this.cookie.get( 'accessToken' );
    return this.http.get( this.spotifyURLshow + query, { headers: { Authorization: 'Bearer ' + accessToken} } );
  }

}