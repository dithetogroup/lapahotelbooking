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
import { first, Subject } from 'rxjs';
import { CommonModule, DatePipe, formatDate, NgClass } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { CancelBookingsService } from './cancel-bookings.service';
import { CancelledBookings } from './cancel-bookings.model';
import { CancelBookingFormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { TableExportUtil } from '@shared';
import { rowsAnimation } from '@shared';
import {
  MAT_DATE_LOCALE,
  MatOptionModule,
  MatRippleModule,
} from '@angular/material/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { BookingRow } from '../all-bookings/all-bookinglist.model';
import { CancelledBooking, CancelledBookingRow } from './cancel-booking.model';
import { ViewDeletedRoomsModalComponent } from './dialogs/view-deleted-rooms-modal/view-deleted-rooms-modal.component';
import { ChangeRefundStatusModalComponent } from './change-refund-status-modal/change-refund-status-modal.component';
import { ToastrService } from 'ngx-toastr';
import { MatDatepickerModule } from '@angular/material/datepicker';
@Component({
  selector: 'app-cancelled-booking',
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
  templateUrl: './cancel-bookings.component.html',
  styleUrls: ['./cancel-bookings.component.scss'],
})
export class CancelledBookingsComponent implements OnInit, OnDestroy {
  columnDefinitions = [
    { def: 'full_name', label: 'Full Name', visible: true },
  //  { def: 'guest_email', label: 'Email', visible: true, type: 'email' },
   // { def: 'guest_phone', label: 'Phone', visible: true, type: 'phone' },
    { def: 'room_no', label: 'Room No', visible: true },
    { def: 'room_name', label: 'Room Type', visible: true },
   // { def: 'checkInDate', label: 'Check-In', visible: true, type: 'date' },
    //{ def: 'checkOutDate', label: 'Check-Out', visible: true, type: 'date' },
    { def: 'booking_reference', label: 'Reference No.', visible: true },
  //  { def: 'booking_status', label: 'Booking Status', visible: true, type: 'status' },
    { def: 'payment_status', label: 'Payment Status', visible: true },
    { def: 'cancellation_reason', label: 'Reason', visible: true },
    { def: 'refund_status', label: 'Refund Status', visible: true },
    { def: 'cancelled_at', label: 'Cancelled Date', visible: true, type: 'date' },
    { def: 'cancelled_by', label: 'Cancelled By', visible: true },
    
    { def: 'actions', label: 'Actions', visible: true, type: 'actionBtn' }
  ];

  dataSource = new MatTableDataSource<CancelledBookingRow>([]);
  selection = new SelectionModel<BookingRow>(true, []);
  private destroy$ = new Subject<void>();
  isLoading = true;
  years: number[] = [];
  contextMenuPosition = { x: '0px', y: '0px' };
  selectedYear: number | null = null;
dateFrom: Date | null = null;
dateTo: Date | null = null;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild('contextMenuTrigger') contextMenu!: MatMenuTrigger;

  constructor(
    private dialog: MatDialog,
      private toastr: ToastrService,
    private cancelledBookingService: CancelBookingsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadCancelledBookings();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refresh(): void {
    this.loadCancelledBookings();
  }

  getRefundIcon(status: string): string {
    switch (status) {
      case 'Refunded':
        return 'check_circle'; // ✅
      case 'Processing':
        return 'autorenew'; // 🔄
      case 'Pending':
        return 'hourglass_empty'; // ⏳
      case 'None':
        return 'block'; // 🚫
      default:
        return 'help_outline'; // ❓
    }
  }
  

  getDisplayedColumns(): string[] {
    return this.columnDefinitions
      .filter((cd) => cd.visible)
      .map((cd) => cd.def);
  }

  isAllSelected(): boolean {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  trackByColumnDef(index: number, column: any): string {
    return column.def;
  }
  
  

  masterToggle(): void {
    // if (this.isAllSelected()) {
    //   this.selection.clear();
    // } else {
    //   this.dataSource.data.forEach((row: CancelledBookingRow) =>
    //     this.selection.select(row)
    //   );
    // }
  }
  

  applyFilter(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    this.dataSource.filter = input.trim().toLowerCase();
  }


  loadCancelledBookings(): void {
    this.cancelledBookingService.getCanceledBookingsLists().subscribe({
      next: (response) => {
        const raw: CancelledBooking[] = response.data;
        const flatList: CancelledBookingRow[] = [];
        const grouped: { [ref: string]: CancelledBooking[] } = {};
  
        // Group by booking reference
        raw.forEach((row) => {
          const ref = row.booking_reference ?? 'unknown';
          if (!grouped[ref]) grouped[ref] = [];
          grouped[ref].push(row);
        });
  
        // Flatten the grouped data with group metadata
        for (const ref in grouped) {
          const group = grouped[ref];
          group.forEach((row, index) => {
            flatList.push({
              ...row,
              isFirstRowOfGroup: index === 0,
              groupSize: group.length,
            } as CancelledBookingRow);
          });
        }
  
        // Extract available years from checkInDate
        this.years = [
          ...new Set(
            raw
              .filter((r) => !!r.checkInDate)
              .map((r) => new Date(r.checkInDate!).getFullYear())
          ),
        ];
  
        this.dataSource.data = flatList;
        console.log('new canceled', this.dataSource.data);
        this.isLoading = false;
  
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
  
        // Filter logic for search box
        this.dataSource.filterPredicate = (
          data: CancelledBookingRow,
          filter: string
        ): boolean => {
          const str = Object.values(data)
            .filter((val) => typeof val === 'string' || typeof val === 'number')
            .join(' ')
            .toLowerCase();
          return str.includes(filter.trim().toLowerCase());
        };
      },
      error: (err) => {
        console.error('Error fetching cancelled bookings:', err);
        this.isLoading = false;
      },
    });
  }


  exportExcel(): void {
    const exportData = this.dataSource.filteredData.map((x) => ({
      'Title': x.guest_title ?? '',
      'First Name': x.guest_name ?? '',
      'Last Name': x.guest_surname ?? '',
      'Email': x.guest_email ?? '',
      'Phone': x.guest_phone ?? '',
      //'Room No': x.room_no ?? '',
      'Room Type': x.room_name ?? '',
      //'Packages': x.package_names ?? '',
      'Check-In': x.checkInDate ?? '',
      'Check-Out': x.checkOutDate ?? '',
      'Reference No.': x.booking_reference ?? '',
      'Booking Status': x.booking_status ?? '',
      'Payment Status': x.payment_status ?? '',
     // 'Cancelled By': x.cancelled_by ?? '',
    //  'Cancellation Reason': x.cancellation_reason ?? '',
    }));
  
    TableExportUtil.exportToExcel(exportData, 'cancelled_bookings');
  }
  

  viewBooking(booking: any): void {
    const ref = this.dialog.open(ViewDeletedRoomsModalComponent, {
      width: '950px',
      data: booking
    });
    
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      // handle result if needed
    });
  }

  
  changeStatus(booking:any): void {
    
      const ref = this.dialog.open(ChangeRefundStatusModalComponent, {
        width: '950px',
       data: booking
      });
    
      ref.afterClosed().subscribe(result => {
        if (!result) return;
  
        const payload = {
          refund_status: result.refund_status,
          booking_reference: result.booking_reference
        };
        
        this.cancelledBookingService.updateBookingStatus(payload).pipe(first()).subscribe(
          (res) => {
            if (res.status === 'success') {
              this.toastr.success('Refund status Updated successfully.');
              location.reload();
            } else {
              this.toastr.error('Update failed.');
            }
          },
          () => {
            this.toastr.error('Server error during cancellation.');
          }
        );
      });
    }

    applyDateFilter(): void {
      this.dataSource.filterPredicate = (row: CancelledBookingRow, filter: string) => {
        const cancelledDate = row.cancelled_at ? new Date(row.cancelled_at) : null;
    
        if (!cancelledDate) return false; // skip if date is invalid
        const matchYear = this.selectedYear ? cancelledDate.getFullYear() === this.selectedYear : true;
        const matchFrom = this.dateFrom ? cancelledDate >= this.dateFrom : true;
        const matchTo = this.dateTo ? cancelledDate <= this.dateTo : true;
        return matchYear && matchFrom && matchTo;

      };
    
      this.dataSource.filter = '' + Math.random(); // trigger filter
    }

    resetDateFilters(): void {
      this.selectedYear = null;
      this.dateFrom = null;
      this.dateTo = null;
      this.applyDateFilter();
    }
    
  onContextMenu(event: MouseEvent, item: BookingRow): void {
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