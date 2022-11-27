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
    http.get('http://localhost:3000/documents').subscribe(
      (responseData: any) => {
        this.documents = responseData.documents;
        this.maxDocumentId = this.getMaxId();
        console.log(this.documents);
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
    this.http
      .put(
        'https://fullstack-cms-default-rtdb.firebaseio.com/documents.json',
        jsonDocs,
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
      .subscribe(() => {
        let documentsListClone = this.documents.slice();
        this.documentChangedEvent.next(documentsListClone);
      });
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
    newDocument.id = '';
    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    // this.documentChangedEvent.next(documentsListClone);
    // add to database
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post<{ message: string; newDocument: Document }>(
        'http://localhost:3000/documents',
        newDocument,
        { headers: headers }
      )
      .subscribe((responseData) => {
        // add new document to documents
        // this.documents.push(responseData.newDocument);
        let documentsListClone = this.documents.slice();
        this.documentChangedEvent.next(documentsListClone);
      });
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
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // update database
    this.http
      .put(
        'http://localhost:3000/documents/' + originalDocument.id,
        newDocument,
        { headers: headers }
      )
      .subscribe((response: Response) => {
        this.documents[pos] = newDocument;
      });
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
    // delete from database
    this.http
      .delete('http://localhost:3000/documents/' + document.id)
      .subscribe((response: Response) => {
        this.documents.splice(pos, 1);
        let documentsListClone = this.documents.slice();
        this.documentChangedEvent.next(documentsListClone);
      });
  }
}
