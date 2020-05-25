import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { PodcastService } from '../podcast.service';
import { Podcast }  from '../podcast';
import { Episode } from '../episode';
import { Minute } from '../minute';

@Component({
  selector: 'app-podcast-detail',
  templateUrl: './podcast-detail.component.html',
  styleUrls: ['./podcast-detail.component.css']
})
export class PodcastDetailComponent implements OnInit {
	
	podcast: Podcast;
  selectedEp: Episode;
  selectedMin: Minute;
  minText = '';

  constructor(
  	private router: ActivatedRoute,
  	private podcastService: PodcastService,
  	private location: Location
	) { }

  ngOnInit(): void {
  	this.getPodcast();
  }

  getPodcast(): void {
  	const title = this.router.snapshot.paramMap.get('title');
  	this.podcastService.getPodcast( title ) 
  		.subscribe(podcast => this.podcast = podcast );
  }

  goBack(): void {
    this.location.back();
  }

  selectEp( ep: Episode ): void {
    if ( this.selectedEp && ep.name === this.selectedEp.name ) {
      this.selectedEp = null;
    } else {
      this.selectedEp = ep;
    }
    this.selectedMin = null;
  }

  selectMin( min: Minute ): void {
    this.selectedMin = min;
  }

  removeMinText( min: Minute ): void {
    this.podcastService.removeMinText(
      this.podcast,
      this.selectedEp,
      min
    )
      .subscribe( res => console.log(res) );
  }

}
	