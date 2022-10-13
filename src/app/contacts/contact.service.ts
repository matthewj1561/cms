import { Injectable, EventEmitter, Output } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  @Output() contactSelectedEvent = new EventEmitter<Contact>();
  private contacts: Contact[];
  constructor() {
    this.contacts = MOCKCONTACTS;
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
}
