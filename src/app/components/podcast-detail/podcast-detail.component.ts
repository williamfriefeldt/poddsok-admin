import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginatorIntl } from '@angular/material/paginator';

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

  sortEpsText: string = "Senaste";
  filter: string = "Filter";

  /**
   * @description Set range for number if episodes shown.
   */
  updateSlice(): void {
    this.sliceStart = this.pageEvent.pageIndex * this.pageEvent.pageSize;
    if( this.sliceStart + this.pageEvent.pageSize > this.podcast.episodes.length ) {
      this.pageEvent.pageSize = this.podcast.episodes.length - this.sliceStart -1;
    }
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
    private matpaginator: MatPaginatorIntl,
    public dialog: MatDialog
	) { }

  /**
  * @description When component is ready - get podcasts and set paginator tooltip.
  */
  ngOnInit(): void {
    this.matpaginator.nextPageLabel = 'Nästa sida';
    this.matpaginator.previousPageLabel = 'Föregående sida';
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
          let totalSegments = 0;
          podcast.episodes = podcast.episodes.map( episode => {
            if( episode !== undefined && episode.minutes !== undefined ) {
              const minList = episode.minutes.filter( min => min.text !== "" );
              totalSegments += minList.length;
              episode.minutes = minList.sort( this.sortNr );
              episode.countMin = minList.length;
              episode.minList = this.numbers( episode.length );
              return episode;
            }
          });
          this.podcast = podcast;
          this.podcast.totalSegments = totalSegments;
          if( podcast.episodes.length < 10 ) this.sliceEnd = podcast.episodes.length - 1;
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
   *              Applies for all four functions below.
   * @param { object } a - Segment with minute and text.
   * @param { object } b - Segment with minute and text.
   * @return { number } Sort number, 0 or 1.
   */
  sortNr( a: any, b:any ): number {
    return a.nr - b.nr;
  }

  sortNrHigh( a: any, b:any ): number {
    return b.nr - a.nr;
  }

  sortNrMin( a: any, b:any ): number {
    return a.countMin - b.countMin;
  }

  sortNrMinHigh( a: any, b:any ): number {
    return b.countMin - a.countMin;
  }

  /**
   * @description Sort the episodes depending on option. 
   */
  sortEps(): void {
    switch ( this.sortEpsText ) {
      case "Senaste":
        this.podcast.episodes.sort( this.sortNrHigh );
        this.sortEpsText = "Tidigast";
        break;
      case "Tidigast":
        this.podcast.episodes.sort( this.sortNr );
        this.sortEpsText = "Senaste";
        break;
      case "Mest antal":
        this.podcast.episodes.sort( this.sortNrMinHigh );
        this.sortEpsText = "Minst antal";
        break;
      case "Minst antal":
        this.podcast.episodes.sort( this.sortNrMin );
        this.sortEpsText = "Mest antal";
        break;
    }
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
