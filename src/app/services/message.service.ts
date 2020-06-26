import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

/**
 * @description Store messages of events in the app.
 */

export class MessageService {

	messages: string[] = [];

	/**
	 * @description Add message to array of messages.
	 * @param { string } message - Message to add.
	 */
	add(message: string) {
		this.messages.push(message);
	} 

	/**
	 * @description Remove all messages from array of messages.
	 */
	clear() {
		this.messages = [];
	}

  constructor() { }
}
