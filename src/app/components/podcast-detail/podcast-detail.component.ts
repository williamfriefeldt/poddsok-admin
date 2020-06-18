import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

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

/**
 * @description Handles episodes from selected podcast.
 */
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

  pageEvent: PageEvent = {
     length: 100,
     pageSize: 10,
     pageIndex: 0
  };

  sliceStart: number = this.pageEvent.pageIndex;
  sliceEnd: number = this.pageEvent.pageSize;

  /**
   * @description Set range for number if episodes shown.
   */
  updateSlice(): void {
    this.sliceStart = this.pageEvent.pageIndex * this.pageEvent.pageSize;
    this.sliceEnd = this.sliceStart + this.pageEvent.pageSize;
  }

  /**
   * @param { ActivatedRoute } - To get param from URL
   * @param { PodcastService } - To get all podcasts
   * @param { Location } - To go navigate from view
   * @param { Dialog } - Create dialog in component
   */
  constructor(
  	private router: ActivatedRoute,
  	private podcastService: PodcastService,
  	private location: Location,
    public dialog: MatDialog
	) { }

  /**
  * @description When component is ready - get podcasts.
  */
  ngOnInit(): void {
    this.getPodcast();
  }

  /**
   * @description Get podcast from PodcastService according to podcast sepcified in URL.
   */
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

  /**
   * @description Set number arrays for number of minuts in episode.
   * @param { number } num - Length of episode.
   * @return { array } Array with numbers from 1 - input.
   */
  numbers( num: number ): number[] {
    return Array( num ).fill( 0 ).map( ( x, i ) => i+1 );
  }

  /**
   * @description Go back to previous page.
   * TODO: If previous location is another site, redirect to start page.
   */
  goBack(): void {
    this.location.back();
  } 

  /**
   * @description Update podcast with given segment.
   * @param { Minute } min - Minute that should be updated.
   * @param { Episode } ep - Episode that should be updated.
   */
  updatePodcast( min: Minute, ep: Episode ): void {
    this.podcastService.updatePodcast( this.podcast, ep, min )
      .then( () => {
        this.getPodcast();
        this.addMin = { nr: 0, text: '' };
        this.epOpen = ep.nr;
      });
  }

  /**
   * @description Sort array from lowest to highest number.
   * @param { Object } a - Segment with minute and text.
   * @param { Object } b - Segment with minute and text.
   */
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

  /**
   * @description Opens dialog to add / remove / change episode.
   * @param { Minute } min - Minute that should be updated.
   * @param { Episode } ep - Episode that should be updated.
   */
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
