import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

import { PodcastService } from '../../services/podcast.service';
import { Podcast }  from '../../interfaces/podcast';
import { Episode } from '../../interfaces/episode';
import { Minute } from '../../interfaces/minute';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-podcast-detail',
  templateUrl: './podcast-detail.component.html',
  styleUrls: ['./podcast-detail.component.css']
})

export class PodcastDetailComponent implements OnInit {
	
	podcast: Podcast;
  minText = '';
  changeText: string;
  addMin: Minute = {
    nr:0,
    text:''
  };
  changeMin: Minute = {
    nr:0,
    text:''
  }
  activeMin: boolean = false;
  epOpen: number;

  constructor(
  	private router: ActivatedRoute,
  	private podcastService: PodcastService,
  	private location: Location,
    public dialog: MatDialog
	) { }

  ngOnInit(): void {
    this.getPodcast();
  }

  getPodcast(): void {
  	const title = this.router.snapshot.paramMap.get( 'title' );
  	this.podcastService.getPodcast( title )
  		.subscribe( podcast => {
        if( podcast ) {
          podcast.episodes = podcast.episodes.map( episode => {
            if( episode !== undefined && episode.minutes !== undefined ) {
              const minList = episode.minutes.filter( min => min.text !== "" );
              episode.minutes = minList.sort( this.sortNr );
              episode.countMin = minList.length;
              episode.minList = this.numbers( episode.length );
              return episode;
            }
          });
          this.podcast = podcast;
        } else {
          this.goBack();
        }
      });
  }

  numbers( num: number ): number[] {
    return Array( num ).fill( 0 ).map( ( x, i ) => i+1 );
  }

  goBack(): void {
    this.location.back();
  } 

  updatePodcast( min: Minute, ep: Episode ): void {
    this.podcastService.updatePodcast( this.podcast, ep, min )
      .then( () => {
        this.getPodcast();
        this.addMin = { nr: 0, text: '' };
        this.epOpen = ep.nr;
      });
  }

  sortNr( a: any, b:any ): number {
    if( a.nr < b.nr ) {
      return -1;
    } else if ( a.nr > b.nr ) {
      return 1;
    } else{
      return 0;
    }
    return 0;
  }

  openDialog( min: Minute, ep: Episode, type: string): void {
    const dialogRef = this.dialog.open( DialogComponent, {
      data: {
        min: min,
        ep: ep,
        type: type
      }
    });
    dialogRef.afterClosed().subscribe( res => {
      if( res && res.val ) {
        this.updatePodcast( res.min, res.ep );
      }
    });
  }

}
