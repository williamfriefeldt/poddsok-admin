import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Podcast } from '../interfaces/podcast';

@Injectable({
  providedIn: 'root'
})

/**
* @description Handles Spotify API calls.
* Requires accessToken:
* - Start 'node app.js' in main folder
* - Enter 'localhost:8888' in browser
*/
export class SpotifyService {

  private clientID       = 'a15e3712d52f40edb5cd1644f543cef1';
  private spotifyURLeps  = 'https://api.spotify.com/v1/shows';
  private spotifyURLshow = 'https://api.spotify.com/v1/search?type=show&q=';
  private authURL        = 'http://localhost:8888';

  /**
   * @param { HttpClient } - To make HTTP requests.
   * @param { CookieService } - To get cookies.
   */
  constructor( 
    private http:   HttpClient,
    private cookie: CookieService
  ) { }

  /**
   * @description Get episodes from podcasts through Spotify API.
   * @param { Podcast } pod - Podcast to search episodes for.
   * @param { number } offset - Set search range per 50 episodes.
   * @return { Observable<Object> } - Result from API call.
   */
  searchPod( pod: Podcast, offset: number ): Observable<Object> {
    const accessToken = this.cookie.get( 'accessToken' );
    if( pod ) { 
      if( accessToken === 'null' || accessToken === '') {
        return throwError( 'No access token' );
      } else {
        const podcastID = pod.info.spotifyID;
        return this.http.get( this.spotifyURLeps + '/' + podcastID + '/episodes?limit=50&offset=' + offset, { 
          headers: { Authorization: 'Bearer ' + accessToken } 
        } );
      }
    } else {
      return of( undefined );
    }
  }

  /**
   * @description Find new podcasts from Spotify API.
   * @param { string } query - Search query as input to API call.
   * @return { Observable<Object> } - Result from API call.
   */
  findPod( query: string ): Observable<Object> {
    const accessToken = this.cookie.get( 'accessToken' );
    if( accessToken === 'null' || accessToken === '') {
      return throwError( 'No access token' );
    } else {
      return this.http.get( this.spotifyURLshow + query, { headers: { 
        Authorization: 'Bearer ' + accessToken }
      } );
    }
  }

}