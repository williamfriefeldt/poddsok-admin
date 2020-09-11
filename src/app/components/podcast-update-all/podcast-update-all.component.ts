import { Component, OnInit } from '@angular/core';
import { Podcast } from '../../interfaces/podcast';
import { PodcastService } from '../../services/podcast.service';
import { SpotifyService } from '../../services/spotify.service';
import { Episode } from '../../interfaces/episode';
import { NewEps } from '../../interfaces/neweps';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-podcast-update-all',
  templateUrl: './podcast-update-all.component.html',
  styleUrls: ['./podcast-update-all.component.css']
})

/**
 * @description Update all podcasts with new episodes from SpotifyAPI.
 */
export class PodcastUpdateAllComponent implements OnInit {

	podcasts: Podcast[];
	newEps: NewEps[] = [];
  notEPs: NewEps[] = [];
  epsAdded: Episode[] = [];
  epsAddedToNot: Episode[] = [];

	error: boolean;
  loading: boolean = true; 
  timeout: number = 4000;
  addEps: boolean;
  addEpsProgress: number[] = [ 0, 0 ];
  progressCounter: number[] = [ 0, 0 ];
  progressTotal: number[] = [ 0, 0 ];

  /**
   * @description Get all podcasts (if not fetched from Firebase Database, wait for that).
   */
  getPodcasts(): void {
    this.error = false;
    this.loading = true;
    this.podcastService.getPodcasts()
      .subscribe( podcasts => {
      	this.podcasts = podcasts;
        if( this.podcasts.length > 0) {
          this.callSpotify();
          this.loading = false;
        } else {
          setTimeout(() => {
            this.callSpotify();
            this.loading = false;
          }, this.timeout );
        }
      });  
  }

  /**
   * @description Call SpotifyAPI for each pod to get new episodes.
   */
  callSpotify(): void {
    this.newEps = [];
  	this.podcasts.forEach( ( pod, index ) => {
      if( pod.info.finished !== true) {
  			this.spotifyService.searchPod( pod, 0 )
  				.subscribe( ( res: any ) => {
            const newEpisodes = this.sortNewEps( res.items, pod );
            const latestEp = pod.episodes.length > 1 ? pod.episodes[ pod.episodes.length - 2 ] : { nr:0, name: 'Inga avsnitt' };
            if( newEpisodes.length > 0 && newEpisodes.length < 49 ) {
    					this.newEps.push({
    						title: pod.title,
                podcast: pod,
    						newEps: newEpisodes,
                latestEp: latestEp.nr + ' - ' + latestEp.name
    					});
            }
  				},
  				err => {
  					this.error = true;
            this.loading = false;
  				}); 
        }
		});
    this.newEps.sort( (a, b) => {
      return ( '' + a.title ).localeCompare( b.title );
    });
  }

  /**
   * @description Sort out new episodes depenidng if thet already exsists in Firebase Database or not.
   * @param { any } data - Result from SpotifyAPI.
   * @param { Podcast } podcast - The current podcast.
   * @return { Episode[] } The new episodes for current podcast.
   */
  sortNewEps( data: any, podcast: Podcast ) : Episode[] {
  	const eps = data.map( ep => {
      return {
        name: ep.name,
        length: Math.round( parseInt( ep.duration_ms ) / 1000 / 60 ),
        minutes: { 'min1': { nr:1, text:'' } },
        link: ep.uri,
        nr: 0
      }
    });
    let newEps = eps.filter( episode => {
      const found = podcast.episodes.find( ep => {
        if( ep !== undefined ) return episode.name.includes( ep.name );
      });
      if ( !found ) return episode;
    });
    if( podcast.info.notEPs !== undefined ) {
      newEps = newEps.filter( episode => {
        const notEPs = Object.values( podcast.info.notEPs );
        const found = notEPs.find( ep => {
          const title  = Object.values( ep );
          if( ep !== undefined ) return episode.name.includes( title[0].toString() );
        });
        if ( !found ) {
          return episode;
        }
      });
    }
    var nrOfEps = podcast.episodes.length + newEps.length;
    newEps.map( ep => {
      if( ep.name.match( /^\d/ ) ) {
        const split = ep.name.split( '.' );
        ep.name = split[1];
        ep.nr = parseInt( split[0] );
      } else {
        ep.nr = nrOfEps - 1;
        nrOfEps--;
      }
    });
    newEps = newEps.filter( ep => {
      if( ep.name !== undefined ) return ep;
    });
  	return newEps;
  }

  /**
   * @description Opens dialog to add episodes.
   * @param { string } type - type of dialog that should be opened.
   */
  openDialog( type: string ): void {
    const dialogRef = this.dialog.open( DialogComponent, {
      data: {
        min: {},
        ep: {},
        type: type
      }
    });
    dialogRef.afterClosed().subscribe( res => {
      if( res && res.val ) {
        if( this.notEPs.length > 0) {
          this.notEPs.forEach( ep => {
            const podcast = this.podcasts.find( pod => pod.title === ep.title );
            ep.newEps.forEach( episode =>  {
              this.removeEp( episode, podcast );
            });
          });
        }
        this.newEps.forEach( pod => this.addEpsProgress[0] += pod.newEps.length );
        this.notEPs.forEach( pod => this.addEpsProgress[1] += pod.newEps.length );
        this.progressTotal[0] = this.addEpsProgress[0] !== 0 ? this.addEpsProgress[0] * ( 100/this.addEpsProgress[0] ) : 0;
        this.progressTotal[1] = this.addEpsProgress[1] !== 0 ? this.addEpsProgress[1] * ( 100/this.addEpsProgress[1] ) : 0;
        this.addEps = true;
        this.progress();
      }
    });
  }

  /**
   * @description Calculating progress in adding episodes to Firebase Database.
   */
  progress(): void {     
    if( this.newEps.length > 0 ) {
      this.podcastService.addNewEps( this.newEps[0].podcast, [ this.newEps[0].newEps[0] ] )
        .subscribe( res => {
          this.epsAdded.push( this.newEps[0].newEps[0] );
          this.newEps[0].newEps.shift();
          if( this.newEps[0].newEps.length === 0 ) {
            this.newEps.shift();
          }
          setTimeout( () => {
            this.progressCounter[0] += ( 100/this.addEpsProgress[0] );
            this.progress();
          }, 500 );       
        });
    } else if( this.notEPs.length > 0 ) {
      this.podcastService.addNotEps( this.notEPs[0].podcast, [ this.notEPs[0].newEps[0] ] )
        .subscribe( res => {
          this.epsAddedToNot.push( this.notEPs[0].newEps[0] );
          this.notEPs[0].newEps.shift();
          if( this.notEPs[0].newEps.length === 0 ) {
            this.notEPs.shift();
          }
          setTimeout( () => {
            this.progressCounter[1] += ( 100/this.addEpsProgress[1] );
            this.progress();
          }, 500 );          
        });
    } else {
      this.snackBar.open('Avsnitt tillagda', 'Klar!', {
        duration: 15000,
      });
    }
  }

  /**
   * @description Remove new episode from 'episodes to be added'.
   * @param { Episode } ep - Episode to be removed.
   * @param { Podcast } pod - Podcast from which to remove the episode.
   */
  removeEp( ep: Episode, pod: Podcast): void {
    this.newEps.find( ( podcast, index ) => {
      if( podcast.title === pod.title ) {
        const newEpisodes = podcast.newEps.filter( episode => ep.name !== episode.name); 
        this.newEps[ index ].newEps = newEpisodes;
      }
    });
    this.newEps = this.newEps.filter( pod => pod.newEps.length !== 0 );
  }

  /**
   * @description Handle states of checkbox. Checked - add episode to 'episodes not to be added to Firebase Database'.
   *                                         Not checked - remove episode from 'episodes not to be added to Firebase Database'.
   */
  clickCheckBox( event, podTitle: string, ep: Episode ): void {
    if( event.checked ) {
      const podcast = this.notEPs.find( ( pod, index ) => {
        if( pod.title === podTitle ) {
          this.notEPs[ index ].newEps.push( ep );
          return true;
        }
      });
      if( podcast === undefined ) {
        const newEps = [];
        newEps.push( ep );
        const pod = this.podcasts.find( pod => pod.title === podTitle );
        this.notEPs.push( { title: podTitle, newEps: newEps, latestEp: '', podcast: pod } );
      }
    } else {
      this.notEPs.find( ( pod, index ) => {
        if( pod.title === podTitle ) {
          const newEpisodes = pod.newEps.filter( episode => ep.name !== episode.name); 
          this.notEPs[ index ].newEps = newEpisodes;
        }
      });
      this.notEPs = this.notEPs.filter( pod => pod.newEps.length !== 0 );
    }
  }

  /**
   * @param { PodcastService } - To get all podcasts
   * @param { SpotifyService } - To get episodes from SpotifyAPI
   * @param { Dialog } - Create dialog in component
   * @param { SnackBar } - SnackBar to show user when completed task.
   */
  constructor(
  	private podcastService: PodcastService,
  	private spotifyService: SpotifyService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  /**
  * @description When component is ready - get podcasts.
  */
  ngOnInit(): void {
  	this.getPodcasts();
  }

}
