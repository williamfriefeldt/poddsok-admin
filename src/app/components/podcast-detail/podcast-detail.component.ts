import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogActions } from '@angular/material/dialog';

import { PodcastService } from '../../services/podcast.service';
import { Podcast }  from '../../interfaces/podcast';
import { Episode } from '../../interfaces/episode';
import { Minute } from '../../interfaces/minute';

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
        if ( podcast ) {
          podcast.episodes = podcast.episodes.map( episode => {
            if( episode !== undefined && episode.minutes !== undefined ) {
              const minList = episode.minutes.filter( min => min.text !== "" );
              episode.minutes = minList.sort( this.sortNr );
              episode.countMin = minList.length;
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
    if ( a.nr < b.nr ) {
          return -1;
        } else if ( a.nr > b.nr ) {
            return 1;
        } else{
            return 0;
        }
    return 0;
  }

  openDialog( min: Minute, ep: Episode): void {
    const dialogRef = this.dialog.open(PodcastDetailDialog, {
      data: {
        min: min,
        ep: ep
      }
    });
    dialogRef.afterClosed().subscribe( res => {
      if( res && res.val === 'yes') {
        this.updatePodcast( res.min, res.ep );
      }
    });
  }

}

/* Dialog for add / change ep */
@Component({
  selector: 'podcast-detail-dialog',
  templateUrl: './podcast-detail-dialog.html'
})

export class PodcastDetailDialog {

  constructor(
    public dialogRef: MatDialogRef<PodcastDetailDialog>,
    @Inject( MAT_DIALOG_DATA ) private data: Object
  ) {}

  close( val ): void {
    this.data['val'] = val;
    this.dialogRef.close( this.data );
  }
}