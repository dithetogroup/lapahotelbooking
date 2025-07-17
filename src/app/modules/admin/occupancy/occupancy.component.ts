  import { Component, OnInit, ViewEncapsulation } from '@angular/core';
  import { MatCardModule } from '@angular/material/card';
  import { OccupancyService } from './occupancy.service';
  import { Occupancy } from './occupancy.model';
  import { CommonModule, NgIf } from '@angular/common';
  import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
  import { FormsModule, ReactiveFormsModule } from '@angular/forms';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatSelectModule } from '@angular/material/select';
  import { MatButtonModule } from '@angular/material/button';
  import { MatIconModule } from '@angular/material/icon';
  import { GuestDetailsDialogComponent } from './guest-details-dialog/guest-details-dialog.component';
  import { MatDialog } from '@angular/material/dialog';
  import { AddGuestDetailsDialogComponent } from './add-guest-details-dialog/add-guest-details-dialog.component';
import { MatSpinner } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
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
      selector: 'app-occupancy',
      imports: [
          MatCardModule,
          CommonModule,
          PageHeaderComponent,
          MatFormFieldModule,
          MatSelectModule,
          MatIconModule,
          FormsModule,
          MatInputModule,
          MatButtonModule,
          ReactiveFormsModule,
          NgIf,
          MatSpinner,
          MatDatepickerModule
      ],
      providers: [
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
      ],
      
      templateUrl: './occupancy.component.html',
      styleUrl: './occupancy.component.scss',
  })
  export class OccupancyComponent implements OnInit {
    occupancy: Occupancy[] = [];
    filteredRooms: Occupancy[] = [];
    roomTypes: string[] = [];
    bedSizes: string[] = [];
    statuses: string[] = ['Booked', 'Available', 'Cancelled'];
    showOnlyGrouped: boolean = false;
    searchText: string = '';
    roomStats = { total: 0, occupied: 0, free: 0 };
    startDate: Date | null = null;
    endDate: Date | null = null;

  
    
    selectedStatus = '';
    selectedType = '';
    selectedBed = '';
    loading = false;


    constructor(
      private occupancyService: OccupancyService,
      private dialog: MatDialog
    ) {}

    ngOnInit(): void {
      this.getOccupancy();
      this.getRoomStats();
    }


    getOccupancy(){
      this.loading = true;
      this.occupancyService.getOccupancyList(this.startDate, this.endDate).subscribe((data) => {

        // Deep clone the data to force reactivity
        const refreshedData = [...data.map(item => ({ ...item }))];
        // Convert roomNo to number before sorting, just in case it's a string
        this.occupancy = data.sort((a, b) => +a.roomNo - +b.roomNo);
        this.filteredRooms = [...this.occupancy];
       // console.log('Occupacy ', this.occupancy);
    
        this.roomTypes = [...new Set(this.occupancy.map((room) => room.roomType))];
        this.bedSizes = [...new Set(this.occupancy.map((room) => room.bedType))];

        this.loading = false;

        this.getRoomStats();
        
      });
    }

    trackRoom(index: number, room: any) {
      return room.roomId;
    }
    

    filterRooms(): void {
      this.filteredRooms = this.occupancy.filter((room) => {
        // Only filter by isAvailable if the user specifically selected a status filter
        let statusMatch = true;
        if (this.selectedStatus === 'Booked') {
          statusMatch = room.isAvailable === false;
        } else if (this.selectedStatus === 'Available') {
          statusMatch = room.isAvailable === true;
        }
        // If selectedStatus is '', statusMatch is always true (show all rooms)
    
        const typeMatch = this.selectedType ? room.roomType === this.selectedType : true;
        const bedMatch = this.selectedBed ? room.bedType === this.selectedBed : true;
        const groupMatch = this.showOnlyGrouped ? this.getGroupSize(room.bookingReference) > 1 : true;
    
        const searchMatch = this.searchText
          ? (
              room.roomNo?.toString().toLowerCase().includes(this.searchText.toLowerCase()) ||
              room.bookingReference?.toLowerCase().includes(this.searchText.toLowerCase()) ||
              room.status?.toLowerCase().includes(this.searchText.toLowerCase()) ||
              room.roomType?.toLowerCase().includes(this.searchText.toLowerCase()) ||
              room.bedType?.toLowerCase().includes(this.searchText.toLowerCase())
            )
          : true;
    
        // Remove manual dateRangeMatch logic! (your backend handles this with isAvailable)
    
        return statusMatch && typeMatch && bedMatch && groupMatch && searchMatch;
      });
    }
    
    
    
    clearFilters(): void {
      this.selectedStatus = '';
      this.selectedType = '';
      this.selectedBed = '';
      this.searchText = '';
      this.startDate = null;
      this.endDate = null;
      this.filterRooms();
    }
    
    toggleGroupedFilter(): void {
      this.showOnlyGrouped = !this.showOnlyGrouped;
      this.filterRooms();
    }
    getGroupSize(reference: string | undefined): number {
      if (!reference) return 0;
      return this.occupancy.filter(r => r.bookingReference === reference).length;
    }

    openGuestDetailsDialog(room: Occupancy): void {
      if (!room.guestDetails && room.bookingReference) {
        const refGuest = this.occupancy.find(
          (r) => r.bookingReference === room.bookingReference && r.guestDetails
        );
        if (refGuest) {
          room.guestDetails = refGuest.guestDetails;
        }
      }
    
      this.dialog.open(GuestDetailsDialogComponent, {
        width: '55vw',
        maxWidth: '100vw',
        data: { room },
        autoFocus: false,
      });
    }
    
    openAddGuestDetailsDialog(room: Occupancy) {
      const dialogRef = this.dialog.open(AddGuestDetailsDialogComponent, {
        width: '55vw',
        maxWidth: '100vw',
        data: {
          room,
        }
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
        //  console.log('Guest Details Submitted:', result);
          this.getOccupancy();
          this.getRoomStats();
        }
      });
    }

    getRoomStats() {
      this.occupancyService.getRoomOccupancyCounts().subscribe({
        next: (res) => {
          if (res && typeof res.total === 'number') {
            this.roomStats = res;
          }

        },
        error: (err) => {
          console.error('Failed to fetch room stats:', err);
          console.log('something went wrong')
        }
      });
    }


  }
