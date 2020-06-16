import { Component, OnInit } from '@angular/core';
import { Podcast } from '../../interfaces/podcast';
import { PodcastService } from '../../services/podcast.service';
import { SpotifyService } from '../../services/spotify.service';
import { Episode } from '../../interfaces/episode';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-podcast-update-all',
  templateUrl: './podcast-update-all.component.html',
  styleUrls: ['./podcast-update-all.component.css']
})
export class PodcastUpdateAllComponent implements OnInit {

	podcasts: Podcast[];
	newEps: Object[] = [];

	error: string;
  loading: boolean = true;
  timeout: number = 4000;

  getPodcasts(): void {
    this.error = '';
    this.loading = true;
    this.podcastService.getPodcasts()
      .subscribe( podcasts => {
      	this.podcasts = podcasts;
      	setTimeout(() => {
      		if( this.podcasts.length > 0) {
      			this.callSpotify();
	      	} else { 
	      		this.error = 'Kunde inte ladda podcast, försök igen.';
            this.loading = false;
	      	}
      	}, this.timeout );
      });  
  }

  callSpotify(): void {
  	this.podcasts.forEach( (pod, index) => {
      if( pod.info.finished != true) {
  			this.spotifyService.searchPod( pod, 0 )
  				.subscribe( (res: any) => {
  					this.newEps.push({
  						title: pod.title,
  						newEps: this.sortNewEps( res.items, pod )
  					});
            this.loading = false;
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
      ep.nr = nrOfEps-1;
      nrOfEps--;
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
        console.log( res );
      }
    });
  }

  constructor(
  	private podcastService: PodcastService,
  	private spotifyService: SpotifyService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  	this.getPodcasts();
  }


}