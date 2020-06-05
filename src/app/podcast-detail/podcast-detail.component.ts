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
  countMinutes: Minute[];

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

  updatePodcast( min: Minute, ep: Episode ): void {
    this.podcastService.updatePodcast(
      this.podcast,
      ep,
      min
    ).then( () => this.getPodcast() );
  }

  countMin( minutes: Minute[] ): number {
    this.countMinutes = minutes.map( min => {
      if( min.text !== '' ) { return min;};
    });
    console.log(this.countMinutes);
    return this.countMinutes.length;
  }

}
	