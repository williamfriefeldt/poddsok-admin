import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

/*
* Store messages of events in the app.
*/

export class MessageService {

	messages: string[] = [];

	add(message: string) {
		this.messages.push(message);
	} 

	clear() {
		this.messages = [];
	}

  constructor() { }
}
