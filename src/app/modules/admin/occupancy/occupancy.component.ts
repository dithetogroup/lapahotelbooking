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
      ],
      templateUrl: './occupancy.component.html',
      styleUrl: './occupancy.component.scss'
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
      this.occupancyService.getOccupancyList().subscribe((data) => {

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


    filterRooms(): void {
      this.filteredRooms = this.occupancy.filter((room) => {
        const statusMatch = this.selectedStatus ? room.status === this.selectedStatus : true;
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
    
        return statusMatch && typeMatch && bedMatch && groupMatch && searchMatch;
      });
    }
    
    clearFilters(): void {
      this.selectedStatus = '';
      this.selectedType = '';
      this.selectedBed = '';
      this.searchText = '';
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
        width: '40vw',
        maxWidth: '100vw',
        data: { room },
        autoFocus: false,
      });
    }
    
    openAddGuestDetailsDialog(room: Occupancy) {
      const dialogRef = this.dialog.open(AddGuestDetailsDialogComponent, {
        width: '40vw',
        maxWidth: '100vw',
        data: {
          room,
        }
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          console.log('Guest Details Submitted:', result);
          this.getOccupancy();
          this.getRoomStats();
        }
      });
    }

    getRoomStats() {
      this.occupancyService.getRoomOccupancyCounts().subscribe({
        next: (res) => {
          console.log('res', res);
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
