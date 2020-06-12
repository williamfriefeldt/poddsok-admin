import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { PodcastService} from '../../services/podcast.service';
import { MessageService } from '../../services/message.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

import { Episode } from '../../interfaces/episode';
import { Podcast } from '../../interfaces/podcast';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-podcast-update',
  templateUrl: './podcast-update.component.html',
  styleUrls: ['./podcast-update.component.css']
})
export class PodcastUpdateComponent implements OnInit {

  episodes: Episode[];
  podcast: Podcast;
  newEps: Episode[];
  error: string;

  constructor(
  	private spotifyService: SpotifyService,
  	private podcastService: PodcastService,
  	private messageService: MessageService,
    private router: ActivatedRoute,
    private location: Location,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const pod = this.router.snapshot.paramMap.get('title');
    this.getPodcast( pod );
  }

  getEpsisodes(): void {
    this.spotifyService.searchPod( this.podcast ).subscribe( (res: any) => {
      if(res) {
        this.episodes = res.items.map( ep => {
          return {
            name: ep.name,
            length: Math.round( parseInt(ep.duration_ms) / 1000 / 60 ),
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
      this.messageService.add( err.message );
      this.error = 'Tillgång till Spotify Api nekad, se konsolen';
    });
  }

  getPodcast( pod ): void {
    this.podcastService.getPodcast( pod )
      .subscribe( podcast => {
        this.podcast = podcast;
        this.getEpsisodes();
      });
  }

  mapNewEps(): void {
    this.newEps = this.episodes.filter( episode => {
      const found = this.podcast.episodes.find( ep => {
        if( ep !== undefined ) return episode.name.includes( ep.name );
      });
      if ( !found ) return episode;
    });
    var nrOfEps = this.podcast.episodes.length + this.newEps.length;
    this.newEps.map( ep => {
      ep.nr = nrOfEps-1;
      nrOfEps--;
    });
  }

  addNewEps(): void {
    this.podcastService.addNewEps( this.podcast, this.newEps )
      .subscribe( res => console.log('added') );
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
        this.addNewEps();
      }
    });
  }
}
