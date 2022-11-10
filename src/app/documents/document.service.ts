import { Injectable, Output, EventEmitter } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  @Output() documentSelectedEvent = new EventEmitter<Document>();
  @Output() documentChangedEvent = new Subject<Document[]>();
  private documents: Document[] = [];
  maxDocumentId: number;
  constructor(private http: HttpClient) {
    http
      .get('https://fullstack-cms-default-rtdb.firebaseio.com/documents.json')
      .subscribe(
        (responseData: Document[]) => {
          this.documents = responseData;
          this.maxDocumentId = this.getMaxId();
          this.documents.sort((a, b) => {
            if (a.name < b.name) {
              return -1;
            } else if (a.name > b.name) {
              return 1;
            }
            return 0;
          });
          this.documentChangedEvent;
  
          let documentsListClone = this.documents.slice();
          // this.documents = MOCKDOCUMENTS;
          this.documentChangedEvent.next(documentsListClone);
        },
        (error: any) => {
          console.log(error);
        }
      );
    this.maxDocumentId = this.getMaxId();
  }

  storeDocuments(): void {
    let jsonDocs = JSON.stringify(this.documents);
    this.http.put('https://fullstack-cms-default-rtdb.firebaseio.com/documents.json',jsonDocs,{
      headers:new HttpHeaders({"Content-Type": "application/json"})
    }).subscribe(() => {
      let documentsListClone = this.documents.slice();
      this.documentChangedEvent.next(documentsListClone);
    })
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
    if (newDocument == null) {
      return;
    }

    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    let documentsListClone = this.documents.slice();
    // this.documentChangedEvent.next(documentsListClone);
    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (originalDocument == null || newDocument == null) {
      return;
    }

    let pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    let documentsListClone = this.documents.slice();
    // this.documentChangedEvent.next(documentsListClone);
    this.storeDocuments();
  }

  getMaxId(): number {
    let maxId: number = 0;

    this.documents.forEach((doc) => {
      let currentId: number = +doc.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    });

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
    // this.documentChangedEvent.next(this.documents.slice());
    this.storeDocuments();
  }
}
