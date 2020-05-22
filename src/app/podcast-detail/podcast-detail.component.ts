import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { PodcastService } from '../podcast.service';
import { Podcast }  from '../podcast';

@Component({
  selector: 'app-podcast-detail',
  templateUrl: './podcast-detail.component.html',
  styleUrls: ['./podcast-detail.component.css']
})
export class PodcastDetailComponent implements OnInit {
	
	podcast: Podcast;

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

}
	