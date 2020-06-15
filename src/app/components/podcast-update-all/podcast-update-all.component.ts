import { Component, OnInit } from '@angular/core';
import { Podcast } from '../../interfaces/podcast';
import { PodcastService } from '../../services/podcast.service';
import { SpotifyService } from '../../services/spotify.service';
import { Episode } from '../../interfaces/episode';

@Component({
  selector: 'app-podcast-update-all',
  templateUrl: './podcast-update-all.component.html',
  styleUrls: ['./podcast-update-all.component.css']
})
export class PodcastUpdateAllComponent implements OnInit {

	podcasts: Podcast[];
	newEps: Object[] = [];

	error: string;

  getPodcasts(): void {
    this.podcastService.getPodcasts()
      .subscribe( podcasts => {
      	this.podcasts = podcasts;
      	setTimeout(() => {
      		if( this.podcasts.length > 0) {
      			this.callSpotify();
	      	} else {
	      		this.error = "Kunde inte ladda podcast, försök igen.";
	      	}
      	}, 2000);
      });  
  }

  callSpotify(): void {
  	this.podcasts.forEach( (pod, index) => {
			this.spotifyService.searchPod( this.podcasts[index], 0 )
				.subscribe( (res: any) => {
					this.newEps.push({
						title: this.podcasts[index].title,
						newEps: this.sortNewEps( res.items, this.podcasts[index] )
					})
				},
				err => {
					this.error = 'Tillgång till Spotify Api nekad, se konsolen';
				});
		});
		console.log(this.newEps);
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

  constructor(
  	private podcastService: PodcastService,
  	private spotifyService: SpotifyService
  ) { }

  ngOnInit(): void {
  	this.getPodcasts();
  }


}
