import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

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

  searchPod(pod: string): Observable<any[]> {
    const accessToken = this.cookie.get( 'accessToken');
    pod = '6teK7JLdnMLmCqs95AYsz5/episodes?limit=50';
    console.log(accessToken);
    this.http.get( this.spotifyURL + pod, { headers: { Authorization: 'Bearer ' + accessToken} } ).subscribe( res => { console.log(res) })
  	return of();
  }
}
