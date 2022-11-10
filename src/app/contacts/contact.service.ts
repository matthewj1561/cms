import { Injectable, EventEmitter, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  @Output() contactSelectedEvent = new EventEmitter<Contact>();
  @Output() contactChangedEvent = new Subject<Contact[]>();

  private contacts: Contact[] = [];
  private maxContactId: number;

  constructor(private http: HttpClient) {
    this.retrieveContact();
  }

  retrieveContact(){
    this.http
      .get('https://fullstack-cms-default-rtdb.firebaseio.com/contacts.json')
      .subscribe((responseData: Contact[]) => {
        this.contacts = responseData;
        this.maxContactId = this.getMaxId();
        this.contacts.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          } else if (a.name > b.name) {
            return 1;
          }
          return 0;
        });

        let contactsListClone = this.contacts.slice();

        this.contactChangedEvent.next(contactsListClone);
        // this.contacts = MOCKCONTACTS;
        this.maxContactId = this.getMaxId();
      });
  }

  storeContacts(): void {
    let jsonDocs = JSON.stringify(this.contacts);
    this.http.put('https://fullstack-cms-default-rtdb.firebaseio.com/contacts.json',jsonDocs,{
      headers:new HttpHeaders({"Content-Type": "application/json"})
    }).subscribe(() => {
      let contactsListClone = this.contacts.slice();
      this.contactChangedEvent.next(contactsListClone);
    })
  }

  addContact(newContact: Contact) {
    if (newContact == null) {
      return;
    }

    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    let contactsListClone = this.contacts.slice();
    // this.contactChangedEvent.next(contactsListClone);
    this.storeContacts();
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (originalContact == null || newContact == null) {
      return;
    }

    let pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return;
    }

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    let contactsListClone = this.contacts.slice();
    // this.contactChangedEvent.next(contactsListClone);
    this.storeContacts();

  }

  getMaxId(): number {
    let maxId: number = 0;

    this.contacts.forEach((contact) => {
      let currentId: number = +contact.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    });

    return maxId;
  }

  getContacts(): Contact[] {
    return this.contacts
      .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
      .slice();
  }
  getContact(id: string): Contact {
    for (let contact of this.contacts) {
      if (contact.id == id) {
        return contact;
      }
    }
    return null;
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }
    this.contacts.splice(pos, 1);
    // this.contactChangedEvent.next(this.contacts.slice());
    this.storeContacts();
  }
}
