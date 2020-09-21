import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { PodcastService} from '../../services/podcast.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Episode } from '../../interfaces/episode';
import { Podcast } from '../../interfaces/podcast';
import { DialogComponent } from '../dialog/dialog.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-podcast-update',
  templateUrl: './podcast-update.component.html',
  styleUrls: ['./podcast-update.component.css']
})

/**
 * @description Update given podcast with new episodes from SpotifyAPI.
 */
export class PodcastUpdateComponent implements OnInit {

  episodes:      Episode[];
  podcast:       Podcast;
  newEps:        Episode[] = [];
  notEPs:        Episode[] = [];
  remEPs:        Episode[] = [];
  epsAdded:      Episode[] = [];
  epsAddedToNot: Episode[] = [];
  latestEp:      Episode;

  error:           string;
  offset:          number   = 0;
  loading:         boolean  = true;
  addEps:          boolean  = false;
  addEpsProgress:  number[] = [ 0, 0 ];
  progressCounter: number[] = [ 0, 0 ];
  progressTotal:   number[] = [ 0, 0 ];

  /**
   * @param { SpotifyService } - To get episodes from SpotifyAPI.
   * @param { PodcastService } - To get all podcasts.
   * @param { MessageService } - To update user what is happening.
   * @param { ActivatedRoute } - To get param from URL.
   * @param { Location } - To go navigate from view.
   * @param { SnackBar } - SnackBar to show user when completed task.
   * @param { Dialog } - Create dialog in component.
   */
  constructor(
  	private spotifyService: SpotifyService,
  	private podcastService: PodcastService,
    private router: ActivatedRoute,
    private location: Location,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  /**
  * @description When component is ready - get podcasts from title in URL.
  */
  ngOnInit(): void {
    const pod = this.router.snapshot.paramMap.get( 'title' );
    this.getPodcast( pod );
  }

  /**
   * @description Go back to previous page.
   * @TODO If previous location is another site, redirect to start page.
   */
  goBack(): void {
    this.location.back();
  } 

  /**
   * @description Get episodes for given podcast.
   */
  getEpsisodes(): void {
    this.spotifyService.searchPod( this.podcast, this.offset )
      .subscribe( (res: any) => {
        this.loading = false;
        if(res) {
          this.offset += 50;
          this.episodes = res.items.map( ep => {
            return {
              name: ep.name,
              length: Math.round( parseInt( ep.duration_ms ) / 1000 / 60 ),
              minutes: { 'min1': { nr:1, text:'' } },
              link: ep.uri,
              nr: 0
            }
          }); 
          this.mapNewEps();
        } else {
          this.location.back();
        }
      },
        err => {
          console.log(err.message);
          this.error = 'Tillgång till Spotify Api nekad, se konsolen';
      });
  }

  /**
   * @description Get podcast based on input title.
   * @param { string } pod - title for podcast.
   */
  getPodcast( pod ): void {
    this.podcastService.getPodcast( pod )
      .subscribe( podcast => {
        this.podcast = podcast;
        if( this.podcast ) this.latestEp = podcast.episodes.length > 1 ? podcast.episodes[ podcast.episodes.length - 2 ] : null;
        this.getEpsisodes();
      });
  }

  /**
   * @description Filter out new episodes that are already in Firebase Database.
   */
  mapNewEps(): void {
    this.newEps = this.episodes.filter( episode => {
      const found = this.podcast.episodes.find( ep => {
        if( ep !== undefined ) return episode.name.includes( ep.name );
      });
      if ( !found ) return episode;
    });
    if( this.podcast.info.notEPs !== undefined ) {
      this.newEps = this.newEps.filter( episode => {
        const notEPs = Object.values( this.podcast.info.notEPs );
        const found = notEPs.find( ep => {
          const title  = Object.values( ep );
          if( ep !== undefined ) return episode.name.includes( title[0].toString() );
        });
        if ( !found ) return episode;
      });
    }
    var nrOfEps = this.podcast.episodes.length + this.newEps.length;
    this.newEps.map( ep => {
      if( ep.name.match(/^\d/) ) {
        const split = ep.name.split('.');
        ep.name = split[1];
        ep.nr = parseInt( split[0] );
      } else {
        ep.nr = nrOfEps-1;
        nrOfEps--;
      }
    });
  }

  /**
   * @description Add new episodes to Firebase Database.
   * @TODO Change the response on subscribe.
   */
  addNewEps(): void {
    this.podcastService.addNewEps( this.podcast, this.newEps )
      .subscribe( res => console.log('added to eps') );
  }

  /**
   * @description Add episodes to Firebase Database for episodes NOT to be shown.
   * @TODO Change the response on subscribe.
   */
  addNotEps(): void {
    this.podcastService.addNotEps( this.podcast, this.notEPs )
      .subscribe( res => console.log('added to eps') );
  }

  /**
   * @description Opens dialog to add episodes.
   * @param { string } type - If user wants to add episodes.
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
            this.newEps = this.newEps.filter( episode => episode.name !== ep.name ); 
          });
        }
        this.newEps.forEach( ep => this.addEpsProgress[0] ++ );
        this.notEPs.forEach( ep => this.addEpsProgress[1] ++ );
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
      this.podcastService.addNewEps( this.podcast, [ this.newEps[0] ] )
        .subscribe( res => {
          this.epsAdded.push( this.newEps[0] );
          this.newEps.shift();
          setTimeout( () => {
            this.progressCounter[0] += ( 100/this.addEpsProgress[0] );
            this.progress();
          }, 500 );       
       });
    } else if( this.notEPs.length > 0 ) {
      this.podcastService.addNotEps( this.podcast, [ this.notEPs[0] ] )
        .subscribe( res => {
          this.epsAddedToNot.push( this.notEPs[0] );
          this.notEPs.shift();
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
   * @description Drag n drop funciton. Determine if div is in drop area.
   * @param { string[] } event - The div that is moved.
   */
  drop( event: CdkDragDrop<string[]> ) {
    if( event.previousContainer === event.container ) {
      moveItemInArray( event.container.data, 
                       event.previousIndex, 
                       event.currentIndex );
    } else {
      transferArrayItem( event.previousContainer.data,
                         event.container.data,
                         event.previousIndex,
                         event.currentIndex );
    }
  }
}
