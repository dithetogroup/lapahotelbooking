import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PageHeaderComponent } from "../../../../shared/components/page-header/page-header.component";
import { CommonModule, NgClass, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_LOCALE, MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { rowsAnimation, TableExportUtil } from '@shared';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { Subject, first } from 'rxjs';
import { BookingRow } from '../all-bookings/all-bookinglist.model';
import { CancelledBookingRow, CancelledBooking } from '../cancel-bookings/cancel-booking.model';
import { CancelBookingsService } from '../cancel-bookings/cancel-bookings.service';
import { ChangeRefundStatusModalComponent } from '../cancel-bookings/change-refund-status-modal/change-refund-status-modal.component';
import { ViewDeletedRoomsModalComponent } from '../cancel-bookings/dialogs/view-deleted-rooms-modal/view-deleted-rooms-modal.component';
import { BookingInvoices } from './booking-invoices.model';
import { BookingInvoicesService } from './booking-invoices.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'D-MM-yyyy', // this is correct for NativeDateAdapter
  },
  display: {
    dateInput: 'D-MM-yyyy', // this will show "07-06-2025"
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'dd-MM-yyyy',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};


@Component({
  selector: 'app-booking-invoices',


  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  animations: [rowsAnimation],
  imports: [
    PageHeaderComponent,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatOptionModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    NgClass,
    MatDatepickerModule,
    FeatherIconsComponent,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatPaginatorModule,
    DatePipe,
  ],
  templateUrl: './booking-invoices.component.html',
  styleUrl: './booking-invoices.component.scss'
})
export class BookingInvoicesComponent implements OnInit{


  invoices: BookingInvoices[] = [];
  dataSource = new MatTableDataSource<BookingInvoices>([]);

  displayedColumns = ['guest_name', 'guest_surname', 'guest_email', 'guest_invoice', 'filename', 'booked_by', 'modified', 'download'];
  isLoading = true;

  // Filters
  years: number[] = [];
  selectedYear: number | null = null;
  dateFrom: Date | null = null;
  dateTo: Date | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;

  constructor(private bookingInvoicesService: BookingInvoicesService) {}


  ngOnInit() {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.isLoading = true;
    this.bookingInvoicesService.getAllBookingInvoices().subscribe({
      next: (response) => {
        this.invoices = response.data || [];

        console.log('invoices', this.invoices)
        this.dataSource = new MatTableDataSource(this.invoices);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        // Setup years for filter (unique years in 'modified' dates)
        this.years = Array.from(new Set(this.invoices
          .map(inv => new Date(inv.modified).getFullYear())))
          .sort((a, b) => b - a);

        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
  }

  // Full text filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  // Year/date range filter
  applyDateFilter() {
    this.dataSource.filterPredicate = (data: BookingInvoices, filter: string) => {
      let match = true;

      // Year filter
      if (this.selectedYear) {
        match = match && (new Date(data.modified).getFullYear() === this.selectedYear);
      }
      // Date from filter
      if (this.dateFrom) {
        match = match && (new Date(data.modified) >= this.dateFrom);
      }
      // Date to filter
      if (this.dateTo) {
        match = match && (new Date(data.modified) <= this.dateTo);
      }
      return match;
    };
    // Any value to trigger filter re-evaluation (the string isn't used)
    this.dataSource.filter = '' + Math.random();
  }

  resetDateFilters() {
    this.selectedYear = null;
    this.dateFrom = null;
    this.dateTo = null;
    this.applyDateFilter();
  }

  download(url: string, filename: string) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

 
}


