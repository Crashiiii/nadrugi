import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable, catchError, from, map, throwError } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractFilterService } from '../abstract/AbstractFilterService';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;

  detailsCollection: AngularFirestoreCollection<any>;
  details$: Observable<any[]>;

  paginatorLength: number;
  pageSize: number = 10;
  currentPageIndex: number = 0;

  formGroup: FormGroup<{
    firstname: FormControl<string>;
    lastname: FormControl<string>;
    description: FormControl<string>;
    age: FormControl<string>;
    email: FormControl<string>;
  }>;

  constructor(
    private formBuilder: FormBuilder,
    private firestore: AngularFirestore,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private logger: AbstractFilterService
  ) {
    this.detailsCollection = this.firestore.collection('contactForms', (ref) =>
      ref.orderBy('timestamp', 'desc')
    );
    this.details$ = this.detailsCollection.valueChanges();

    this.formGroup = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      description: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    // Odczytaj wartości 'pageIndex' i 'pageSize' z queryParams
    const queryParams = this.activatedRoute.snapshot.queryParams;
    if (queryParams['pageIndex']) {
      this.currentPageIndex = parseInt(queryParams['pageIndex'], 10);
      this.paginator.pageIndex = this.currentPageIndex;
    }
    if (queryParams['pageSize']) {
      this.pageSize = parseInt(queryParams['pageSize'], 10);
    }

    this.updatePaginatorLength();
    this.updatePagedData(this.currentPageIndex, this.pageSize);
  }

  updatePaginatorLength() {
    this.details$.subscribe((data) => {
      this.paginatorLength = data.length;
    });
  }

  onPageChange(event: PageEvent) {
    this.currentPageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    // Zapisz wartości 'pageIndex' i 'pageSize' do queryParams i localStorage
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        pageIndex: this.currentPageIndex,
        pageSize: this.pageSize, // Dodaj to pole do queryParams
      },
      queryParamsHandling: 'merge',
    });
    this.updatePagedData(this.currentPageIndex, this.pageSize);
  }

  updatePagedData(pageIndex: number, pageSize: number) {
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
  
    this.details$ = this.detailsCollection
      .valueChanges({ idField: 'id' }) // Nasłuchuj zmian w kolekcji
      .pipe(
        map((data: any[]) => {
          this.paginatorLength = data.length;
          return data.slice(startIndex, endIndex);
        })
      );
  }
  onSubmit() {
    if (this.formGroup.valid) {
      const formData = this.formGroup.value;
      from(this.detailsCollection.add({ ...formData, timestamp: new Date() }))
        .pipe(
          catchError((error) => {
            console.error('Błąd podczas przesyłania danych:', error);
            alert('Wystąpił błąd. Spróbuj ponownie później.');
            return throwError(() => error);
            // return of(null);
          })
        )
        .subscribe(() => {
          alert('Formularz został przesłany. Niedługo się odezwiemy.');
          this.formGroup.reset();
          this.updatePaginatorLength();
          this.updatePagedData(this.currentPageIndex, this.pageSize);
          this.logger.logMessage('Cos tu jest wypisane');
        });
    }
  }
}
