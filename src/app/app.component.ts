import { Component } from '@angular/core';
import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

/*
* 'title' is currently not used
* Holds menu titles and params
*/

export class AppComponent {

  title: string = 'poddsok-admin';

  menu = [
  	{ title: 'Podcasts', url: 'podcasts'},
  	{ title: 'Statistik', url: 'statistik'},
  	{ title: 'Uppdatera alla', url: 'uppdateraAlla'},
  	{ title: 'Lägg till ny podd', url: 'nypodd'}
  ];
}
