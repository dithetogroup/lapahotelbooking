import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import {
  MAT_DATE_LOCALE,
  MatOptionModule,
  MatRippleModule,
} from '@angular/material/core';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { TableExportUtil, rowsAnimation } from '@shared';
import { formatDate, DatePipe, NgClass, CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { AllBookingService } from './all-bookings.service';
import { AllBookings } from './all-bookings.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AllBookingslist, BookingRow, GroupedBooking } from './all-bookinglist.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'app-all-booking',
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, DatePipe],
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
        MatRippleModule,
        MatProgressSpinnerModule,
        MatMenuModule,
        MatPaginatorModule,
        MatDatepickerModule
    ],
    templateUrl: './all-bookings.component.html',
    styleUrls: ['./all-bookings.component.scss']
})
export class AllBookingsComponent implements OnInit, OnDestroy {

  columnDefinitions = [
    { def: 'full_name', label: 'Full Names', visible: true },
    { def: 'guest_phone', label: 'Phone', type: 'phone', visible: true },
    { def: 'checkInDate', label: 'Check-In', type: 'date', visible: true },
    { def: 'checkOutDate', label: 'Check-Out', type: 'date', visible: true },
    { def: 'room_name', label: 'Room', visible: true },
    { def: 'package_name', label: 'Package Name', visible: true },
    { def: 'checkInStatus', label: 'Status', type: 'status', visible: true },
    { def: 'payment_status', label: 'Payment', type: 'payment', visible: true },
    { def: 'booking_reference', label: 'Booking Ref', visible: true },
    { def: 'booked_by', label: 'Booked By', visible: true },
  ];

  groupedBookings: GroupedBooking[] = [];
   dataSource = new MatTableDataSource<BookingRow>([]);

  selection = new SelectionModel<AllBookingslist>(true, []);

  private destroy$ = new Subject<void>();
  contextMenuPosition = { x: '0px', y: '0px' };
  isLoading = true;

  years: number[] = [];
  selectedYear: number | null = null;
  dateFrom: Date | null = null;
  dateTo: Date | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild('contextMenuTrigger') contextMenu!: MatMenuTrigger;

  constructor(
    private dialog: MatDialog,
    private allBookingService: AllBookingService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
   this.loadData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refresh() {
   this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions
      .filter(col => col.visible !== false)
      .map(col => col.def)
      .concat('actions'); // ✅ Only one definition
  }

  private refreshTable() {
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }

  applyDateFilter() {
    this.dataSource.filterPredicate = (row: BookingRow, filter: string) => {
      const checkIn = new Date(row.checkInDate);
  
      const matchYear = this.selectedYear ? checkIn.getFullYear() === this.selectedYear : true;
      const matchFrom = this.dateFrom ? checkIn >= this.dateFrom : true;
      const matchTo = this.dateTo ? checkIn <= this.dateTo : true;
  
      return matchYear && matchFrom && matchTo;
    };
    this.dataSource.filter = '' + Math.random(); // trigger filter
  }
  
  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  loadData() {
    this.allBookingService.getAllBookingLists().subscribe({
      next: (response) => {
        const raw: AllBookingslist[] = response.data;
        const flatList: BookingRow[] = [];
  
        const grouped: { [ref: string]: AllBookingslist[] } = {};
  
        raw.forEach(row => {
          const ref = row.booking_reference;
          if (!grouped[ref]) grouped[ref] = [];
          grouped[ref].push(row);
        });
  
        for (const ref in grouped) {
          const group = grouped[ref];
          group.forEach((row, index) => {
            flatList.push({
              ...row,
              isFirstRowOfGroup: index === 0,
              groupSize: group.length
            });
          });
          
        }
  
        this.years = [...new Set(raw.map(r => new Date(r.checkInDate).getFullYear()))];
        this.dataSource.data = flatList;

        console.log('data flating', this.dataSource.data);
        this.isLoading = false;
        this.refreshTable();
      },
      error: (err) => console.error(err),
    });
  }
  
  toggleCheckStatus(row: BookingRow) {

    const newStatus = row.checkInStatus === 'CheckIn' ? 'CheckOut' : 'CheckIn';
     // Prevent checkout if payment is unpaid
     debugger;
    if (newStatus === 'CheckOut' && row.payment_status === 'Unpaid') {
      this.toastr.error('Cannot check out: Payment is Oustanding.');
      return;
    }

    this.allBookingService.bookingStatus({
      booking_reference: row.booking_reference,
      status: newStatus
    }).subscribe({
      next: (res) => {
        row.checkInStatus = newStatus;
        const today = new Date().toISOString().split('T')[0];
        if (newStatus === 'CheckIn') {
          row.checkInDate = today;
        } else {
          row.checkOutDate = today;
        }
        this.toastr.success(`Status updated to ${newStatus}`);
      },
      error: (err) => {
        console.error('Status update failed', err);
        this.toastr.error('Check status update failed');
      }
    });
  }
  


  togglePaidStatus(row: BookingRow) {
    const newStatus = row.payment_status === 'Paid' ? 'Unpaid' : 'Paid';
    this.allBookingService.paymentStatus({
      booking_reference: row.booking_reference,
      status: newStatus
    }).subscribe({
      next: (res) => {
        row.payment_status = newStatus;
        this.toastr.success(`Payment status updated to ${newStatus}`);
      },
      error: (err) => {
        console.error('Payment Status update failed', err);
        this.toastr.error("Payment Status update failed");
      }
    });
  }
  
  

  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  exportExcel() {
    const exportData = this.dataSource.filteredData.map((x) => ({
      'Full Names': `${x.guest_title} ${x.guest_name} ${x.guest_surname}`,
      'Phone': x.guest_phone,
      'Check-In': formatDate(x.checkInDate, 'yyyy-MM-dd', 'en'),
      'Check-Out': formatDate(x.checkOutDate, 'yyyy-MM-dd', 'en'),
      'Room': x.room_name,
      'Package Name': x.package_name,
      'Status': x.booking_status,
      'Payment': x.payment_status,
      'Booking Ref': x.booking_reference,
      'Booked By': x.booked_by
    }));
  
    TableExportUtil.exportToExcel(exportData, 'bookings');
  }
  

  onContextMenu(event: MouseEvent, item: AllBookings) {
    event.preventDefault();
    this.contextMenuPosition = {
      x: `${event.clientX}px`,
      y: `${event.clientY}px`,
    };
    if (this.contextMenu?.menu) {
      this.contextMenu.menuData = { item };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }
  
}
