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
  changeText: string;
  addMin: Minute = {
    nr:0,
    text:''
  };
  changeMin: Minute = {
    nr:0,
    text:''
  }

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
  		.subscribe(podcast => {
        if ( podcast ) {
          this.podcast = podcast;
        } else {
          this.goBack();
        }
      });

  }

  numbers( num: number ): number[] {
    return Array(num).fill(0).map((x,i)=>i+1);
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

  updatePodcast( min: Minute ): void {
    this.podcastService.updatePodcast(
      this.podcast,
      this.selectedEp,
      min
    ).then( () => this.getPodcast() );
  }

}
	