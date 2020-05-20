import { Component, OnInit } from '@angular/core';
import { Podcast } from '../podcast';
import { PodcastService } from '../podcast.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
	podcasts: Podcast[] = [];

  constructor( private podcastService: PodcastService ) { }

  ngOnInit(): void {
  	this.getPodcasts();
  }

  getPodcasts(): void {
  	this.podcastService.getPodcasts()
  		.subscribe( podcasts => this.podcasts = podcasts.slice( 1 , 4 ) );
  }

}
