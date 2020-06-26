import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { SpotifyService } from '../../services/spotify.service';
import { FirebaseService } from '../../services/firebase.service';
import { MessageService } from '../../services/message.service';

import { Podcast } from '../../interfaces/podcast';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-podcast-new',
  templateUrl: './podcast-new.component.html',
  styleUrls: ['./podcast-new.component.css']
})
export class PodcastNewComponent implements OnInit {

	podRes: Podcast[];
	query: string;
	podcast: Podcast;

  constructor(
  	private spotifyService: SpotifyService,
    private messageService: MessageService,
    private firebaseService: FirebaseService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
  }

  search( query: string ): void {
  	this.podcast = null;
  	this.spotifyService.findPod( query )
  		.subscribe( (res: any) => {
  			this.podRes = res.shows.items;
  		});
  }

  selectPod( pod ): void {
  	this.podcast = {
  		title: pod.name,
  		episodes: [],
  		epsNr: 0,
  		info: { 
        spotifyID: pod.id, 
        finished: false, 
        image: pod.images[2].url,
        notEPs: [],
        name: pod.name
      },
  		image: pod.images[0].url,
      totalSegments: 0
  	};
  	this.podRes = [];
  }

  addPodcast(): void {
    const podName = '/' + this.podcast.title;
    const info = this.podcast.info;
    this.firebaseService.addPodcast( podName, info )
      .then( () => {
        this.messageService.add(`Added podcast ${this.podcast.title}`);
      });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open( DialogComponent, {
      data: { type: 'addPod' }
    });
    dialogRef.afterClosed().subscribe( res => {
      if( res && res.val ) {
        this.addPodcast();
      }
    });
  }
}
