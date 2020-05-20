import { Component, OnInit } from '@angular/core';
import { Podcast } from '../podcast';
import { PodcastService } from '../podcast.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-podcasts',
  templateUrl: './podcasts.component.html',
  styleUrls: ['./podcasts.component.css']
})
export class PodcastsComponent implements OnInit {

	podcasts: Podcast[];

  getPodcasts(): void {
    this.podcastService.getPodcasts()
      .subscribe( podcasts => this.podcasts = podcasts);
  }

  constructor(private podcastService: PodcastService, private messageService: MessageService) { } 

  ngOnInit(): void {
    this.getPodcasts();
  }

}
