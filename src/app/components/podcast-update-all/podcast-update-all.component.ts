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
export class PodcastUpdateAllComponent implements OnInit {

	podcasts: Podcast[];
	newEps: NewEps[] = [];

	error: string;
  loading: boolean = true;
  timeout: number = 4000;
  addEps: boolean;
  addEpsProgress: number = 0;
  progressCounter: number = 0;
  progressTotal: number = 0;

  getPodcasts(): void {
    this.error = '';
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

  callSpotify(): void {
    this.newEps = [];
  	this.podcasts.forEach( (pod, index) => {
      if( pod.info.finished != true) {
  			this.spotifyService.searchPod( pod, 0 )
  				.subscribe( (res: any) => {
            const newEpisodes = this.sortNewEps( res.items, pod );
            if( newEpisodes.length > 0 && newEpisodes.length < 50 ) {
    					this.newEps.push({
    						title: pod.title,
    						newEps: newEpisodes 
    					});
            }
  				},
  				err => {
  					this.error = 'Tillgång till Spotify Api nekad, se konsolen';
            this.loading = false;
  				});
        }
		});
  }

  sortNewEps( data: any, podcast: Podcast ) : Episode[] {
  	const eps = data.map( ep => {
      return {
        name: ep.name,
        length: Math.round( parseInt(ep.duration_ms) / 1000 / 60 ),
        minutes: { 'min1': { nr:1, text:'' } },
        link: ep.uri,
        nr: 0
      }
    });
    const newEps = eps.filter( episode => {
      const found = podcast.episodes.find( ep => {
        if( ep !== undefined ) return episode.name.includes( ep.name );
      });
      if ( !found ) return episode;
    });
    var nrOfEps = podcast.episodes.length + newEps.length;
    newEps.map( ep => {
      if( ep.name.match(/^\d/) ) {
        const split = ep.name.split('.');
        ep.name = split[1];
        ep.nr = parseInt(split[0]);
      } else {
        ep.nr = nrOfEps-1;
        nrOfEps--;
      }
    });
  	return newEps;
  }


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
        this.newEps.forEach( pod => this.addEpsProgress += pod.newEps.length );
        this.progressTotal = this.addEpsProgress * (100/this.addEpsProgress);
        this.addEps = true;
        this.progress();
      }
    });
  }

  progress(): void {
    if( this.progressCounter !== this.progressTotal ) {
      this.progressCounter += (100/this.addEpsProgress);
      setTimeout( () => this.progress(), 500);
    } else {
      this.snackBar.open('Avsnitt tillagda', 'Klar!', {
        duration: 5000,
      });
    }
  }

  removeEp( ep: Episode, pod: Podcast): void {
    this.newEps.find( ( podcast, index ) => {
      if( podcast.title === pod.title ) {
        const newEpisodes = podcast.newEps.filter( episode => ep.name !== episode.name); 
        this.newEps[ index ].newEps = newEpisodes;
      }
    });
    this.newEps = this.newEps.filter( pod => pod.newEps.length !== 0 );
  }

  constructor(
  	private podcastService: PodcastService,
  	private spotifyService: SpotifyService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  	this.getPodcasts();
  }


}
