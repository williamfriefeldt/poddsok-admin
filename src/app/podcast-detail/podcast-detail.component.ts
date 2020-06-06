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
  activeMin: boolean = false;

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
          podcast.episodes = podcast.episodes.map(episode => {
            if( episode !== undefined && episode.minutes !== undefined ) {
              const minList = episode.minutes.filter( min => min.text !== "");
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

}
	