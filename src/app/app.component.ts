import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  menu = [
  	{ title: 'Podcasts', url: 'podcasts'},
  	{ title: 'Statistik', url: 'statistik'},
  	{ title: 'Uppdatera alla', url: 'uppdateraAlla'},
  	{ title: 'Lägg till ny podd', url: 'nypodd'}
  ];
}
