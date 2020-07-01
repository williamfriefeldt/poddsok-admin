import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

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

/**
 * @description Add new podcast from SpotifyAPI to Firebase Database.
 * @TODO Add link to new podcast so user can enter it directly.
 */
export class PodcastNewComponent implements OnInit {

	podRes: Podcast[];
	query: string;
	podcast: Podcast;
  error: string;
  description: string;

  /**
   * @param { SpotifyService } - To get podcast from SpotifyAPI.
   * @param { MessageService } - To update user about events.
   * @param { FirebaseService } - To push data to Firebase Database.
   * @param { Dialog } - To open dialog modal.
   * @param { DonSanitizer } - To accepts forbidden urls.
   @ @param { SnackBar } - To show snackbar.
   */
  constructor(
  	private spotifyService: SpotifyService,
    private messageService: MessageService,
    private firebaseService: FirebaseService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void { }

  /**
   * @description To search SpotifyAPI for podcasts.
   * @param { string } query - Search string.
   */
  search( query: string ): void {
  	this.podcast = null;
  	this.spotifyService.findPod( query )
  		.subscribe( (res: any) => {
        this.error = '';
  			this.podRes = res.shows.items;
  		}, 
      err  => {
        this.messageService.add( err.message );
        this.error = 'Tillgång till Spotify Api nekad, se konsolen';
      });
  }

  /**
   * @description Set selected pod from Spotify results.
   * @param { object } pod - Selected podcast.
   */
  selectPod( pod ): void {
    this.description = pod.description;
  	this.podcast = {
  		title: pod.name,
  		episodes: [],
  		epsNr: 0,
  		info: { 
        spotifyID: pod.id, 
        finished: false, 
        image: pod.images[0].url,
        notEPs: [],
        name: pod.name
      },
  		image: pod.images[0].url,
      totalSegments: 0
  	};
  	this.podRes = [];
  }

  /**
   * @description Add podcast to Firebase Database.
   */
  addPodcast(): void {
    const podName = '/' + this.podcast.title;
    const info = this.podcast.info;
    this.firebaseService.addPodcast( podName, info )
      .then( () => {
        this.messageService.add(` Added podcast ${this.podcast.title}` );
        this.snackBar.open( 'Podcast tillagd!', 'Succé' );
      });
  }

  /**
   * @description Opens dialog to add podcast.
   */
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

  /**
   * @description Make SpotifyURI secure. 
   */
  sanitize( url: string ) {
    return this.sanitizer.bypassSecurityTrustUrl( url );
  }

}
