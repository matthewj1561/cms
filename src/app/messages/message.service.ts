import { Injectable, EventEmitter } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messageChangedEvent = new EventEmitter<Message[]>();
  private messages: Message[] = [];
  private maxMessageId : number;
  constructor(private http: HttpClient ) {
    http
      .get('https://fullstack-cms-default-rtdb.firebaseio.com/messages.json')
      .subscribe(
        (responseData: Message[]) => {
          this.messages = responseData;
          this.maxMessageId = this.getMaxId();
          // this.messages.sort((a, b) => {
          //   if (a.name < b.name) {
          //     return -1;
          //   } else if (a.name > b.name) {
          //     return 1;
          //   }
          //   return 0;
          // });
          // this.documentChangedEvent;
  
          let messageListClone = this.messages.slice();
          // this.documents = MOCKDOCUMENTS;
          this.messageChangedEvent.next(messageListClone);
        },
        (error: any) => {
          console.log(error);
      }
      );
    this.maxMessageId = this.getMaxId();
  }

  storeMessages(): void {
    let jsonDocs = JSON.stringify(this.messages);
    this.http.put('https://fullstack-cms-default-rtdb.firebaseio.com/messages.json',jsonDocs,{
      headers:new HttpHeaders({"Content-Type": "application/json"})
    }).subscribe(() => {
      let messageListClone = this.messages.slice();
      this.messageChangedEvent.next(messageListClone);
    })
  }

  getMessages(): Message[] {
    return this.messages.slice();
  }
  getMessage(id: string): Message {
    for (let message of this.messages) {
      if (message.id == id) {
        return message;
      }
    }
    return null;
  }

  getMaxId(): number {
    let maxId: number = 0;

    this.messages.forEach((mes) => {
      let currentId: number = +mes.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    });

    return maxId;
  }
  addMessage(message: Message) {
    this.messages.push(message);
    // this.messageChangedEvent.emit(this.messages.slice());
    this.storeMessages();
  }
}
