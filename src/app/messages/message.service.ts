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
  private maxMessageId: number;
  constructor(private http: HttpClient) {
    http.get('http://localhost:3000/messages').subscribe(
      (responseData: any) => {
        this.messages = responseData.messages;
        console.log(this.messages);
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
    this.http
      .put(
        'https://fullstack-cms-default-rtdb.firebaseio.com/messages.json',
        jsonDocs,
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
      .subscribe(() => {
        let messageListClone = this.messages.slice();
        this.messageChangedEvent.next(messageListClone);
      });
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
  addMessage(newMessage: Message) {
    newMessage.id = this.getMaxId().toString();
    this.messages.push(newMessage);
    // this.messageChangedEvent.emit(this.messages.slice());
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post<{ message: string; newMessage: Message }>(
        'http://localhost:3000/messages',
        newMessage,
        { headers: headers }
      )
      .subscribe((responseData) => {
        // add new document to documents

        let messageListClone = this.messages.slice();
        this.messageChangedEvent.next(messageListClone);
      });
  }
}
