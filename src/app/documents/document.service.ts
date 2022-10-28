import { Injectable, Output, EventEmitter } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Subject } from "rxjs";


@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  @Output() documentSelectedEvent = new EventEmitter<Document>();
  @Output() documentChangedEvent = new Subject<Document[]>();
  private documents: Document[] = [];
  maxDocumentId : number;
  constructor() {
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
  }

  getDocuments(): Document[] {
    return this.documents.slice();
  }
  getdocument(id: string): Document {
    for (let document of this.documents) {
      if (document.id == id) {
        return document;
      }
    }
    return null;
  }

  
  addDocument(newDocument: Document) {
    if (newDocument == null){
      return
    }

    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    let documentsListClone = this.documents.slice();
    this.documentChangedEvent.next(documentsListClone);
  }

  
  updateDocument(originalDocument: Document, newDocument: Document) {
    if (originalDocument == null || newDocument == null) {
      return;
    }

    let pos = this.documents.indexOf(originalDocument)
    if (pos < 0){
      return;
    } 

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    let documentsListClone = this.documents.slice();
    this.documentChangedEvent.next(documentsListClone);
  }


  getMaxId(): number {

    let maxId : number = 0;

    this.documents.forEach((doc) => {
      let currentId : number = +doc.id
      if (currentId > maxId) {
        maxId = currentId;
      }
    })

    return maxId;
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.documents.splice(pos, 1);
    this.documentChangedEvent.next(this.documents.slice());
  }
}
