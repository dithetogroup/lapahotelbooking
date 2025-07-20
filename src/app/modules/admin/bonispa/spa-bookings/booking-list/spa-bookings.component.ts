import { Component, ViewChild } from "@angular/core";
import { SpaBooking } from "../spa.model";
import { BoniSpaService } from "../../boni-spa.service";
import { SelectionModel } from "@angular/cdk/collections";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { NgFor, NgIf, NgClass, DecimalPipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatOptionModule, MatRippleModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTooltipModule } from "@angular/material/tooltip";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";
import { MatSelectModule } from "@angular/material/select";
import { ViewSpaBookingsDialogComponent } from "../../dialogs/view-spa-bookings-dialog/view-spa-bookings-dialog.component";
import { DeleteSpaBookingDialogComponent } from "../../dialogs/delete-spa-booking-dialog/delete-spa-booking-dialog.component";
import { ToastrService } from "ngx-toastr";
import { TableExportUtil } from "@shared/util/tableExportUtil";
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from "@angular/material/datepicker";

@Component({
  selector: "app-spa-bookings",
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    MatMenuModule,
    MatTooltipModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    NgFor,
    NgIf,
    NgClass,
    FormsModule,
    MatOptionModule,
    MatSelectModule,
    MatDatepickerModule,
    DecimalPipe,
    PageHeaderComponent, // <app-page-header>
  ],
  templateUrl: "./spa-bookings.component.html",
  styleUrl: "./spa-bookings.component.scss",
})
export class SpaBookingsComponent {
  dataSource = new MatTableDataSource<SpaBooking>([]);
  selection = new SelectionModel<SpaBooking>(true, []);
  isLoading = false;

  searchText = "";
  selectedDate: string | null = null;
  filter = { value: null };

  startDate: string | null = null;
  endDate: string | null = null;

  columnDefinitions = [
    { def: "spbooking_date", label: "Booking Date", visible: true },
    { def: "spbooking_time", label: "Booking Time", visible: true },
    { def: "package_names", label: "Package", visible: true },
    { def: "spbooking_reason", label: "Reason for massage", visible: true },
    { def: "client_name", label: "Client Name", visible: true },
    { def: "spbooking_noofvisitors", label: "No. of Visitors", visible: true },
    { def: "spbooking_contact", label: "Contact", visible: true },
    { def: "spbooking_email", label: "Email", visible: true },
    { def: "therapist_name", label: "Therapist", visible: true },
    { def: "spbooking_totalprice", label: "Total Price", visible: true },
    { def: "spbooking_allergies", label: "Allergies", visible: false },
    { def: "spbooking_bookedby", label: "Booked By", visible: true },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private boniSpaService: BoniSpaService,
    private toastr: ToastrService,
    public dialog: MatDialog // For modals (edit/view/delete)
  ) {

    this.dataSource.filterPredicate = (data, filter) => {
      const filterObj = JSON.parse(filter);
    
      const matchesSearch =
        !filterObj.search ||
        (
          (data.spbooking_name || "") +
          " " +
          (data.spbooking_surname || "") +
          " " +
          (data.package_names || "") +
          " " +
          (data.spbooking_reason || "")
        )
          .toLowerCase()
          .includes(filterObj.search);
    
      // Range filter
      let matchesDate = true;
      if (filterObj.startDate) {
        matchesDate = data.spbooking_date >= filterObj.startDate;
      }
      if (filterObj.endDate && matchesDate) {
        matchesDate = data.spbooking_date <= filterObj.endDate;
      }
    
      return matchesSearch && matchesDate;
    };
    
  }
  ngOnInit(): void {
    this.fetchSpaBookings();
   // this.refresh();
  }

  fetchSpaBookings() {
    this.isLoading = true;
    this.boniSpaService.getSpaBookings().subscribe({
      next: (response) => {
        this.dataSource.data = response.data;
     //   console.log('booked data', this.dataSource.data);
        this.isLoading = false;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.applyFilter(); 

        });
      },
      error: (error) => {
        this.isLoading = false;
      },
    });
  }

  refresh() {
    this.fetchSpaBookings();
    this.searchText = '';
    this.selectedDate = null;
    this.startDate = null;  // If using date ranges
    this.endDate = null;    // If using date ranges
  }

  onSearchChange(event: any) {
    this.searchText = event.target.value.trim().toLowerCase();
    this.applyFilter();
  }

  applyFilter() {
    const filterObj = {
      search: this.searchText || '',
      startDate: this.startDate,
      endDate: this.endDate
    };
    this.dataSource.filter = JSON.stringify(filterObj);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  

  formatDateToLocalYYYYMMDD(date: any): string | null {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.warn('formatDateToLocalYYYYMMDD got invalid date:', date);
      return null;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  
  onDateChange(event: MatDatepickerInputEvent<any>) {
    let val = event.value;
    if (val && typeof val.isValid === 'function' && val.isValid()) {
      // It's a Moment object
      this.selectedDate = val.format('YYYY-MM-DD');
    } else if (val instanceof Date && !isNaN(val.getTime())) {
      // It's a native Date
      this.selectedDate = this.formatDateToLocalYYYYMMDD(val);
    } else {
      this.selectedDate = null;
    }
    this.applyFilter();
  }


  onStartDateChange(event: MatDatepickerInputEvent<any>) {
    const val = event.value;
    if (val && typeof val.isValid === 'function' && val.isValid()) {
      this.startDate = val.format('YYYY-MM-DD');
    } else if (val instanceof Date && !isNaN(val.getTime())) {
      this.startDate = this.formatDateToLocalYYYYMMDD(val);
    } else {
      this.startDate = null;
    }
    this.applyFilter();
  }
  
  onEndDateChange(event: MatDatepickerInputEvent<any>) {
    const val = event.value;
    if (val && typeof val.isValid === 'function' && val.isValid()) {
      this.endDate = val.format('YYYY-MM-DD');
    } else if (val instanceof Date && !isNaN(val.getTime())) {
      this.endDate = this.formatDateToLocalYYYYMMDD(val);
    } else {
      this.endDate = null;
    }
    this.applyFilter();
  }
  
  
  
  

  getDisplayedColumns() {
    const cols = this.columnDefinitions
      .filter((cd) => cd.visible)
      .map((cd) => cd.def);
    return [...cols, "actions"];
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  removeSelectedRows() {
    const selectedIds = this.selection.selected.map((row) => row.id);
    this.dataSource.data = this.dataSource.data.filter(
      (row) => !selectedIds.includes(row.id)
    );
    this.selection.clear();
  }

  addNew() {
    this.openDialog("add");
  }

  editCall(row: SpaBooking) {
    this.openDialog("edit", row);
  }

  openDialog(action: "add" | "edit", data?: SpaBooking) {
    const dialogRef = this.dialog.open(ViewSpaBookingsDialogComponent, {
      width: "60vw",
      maxWidth: "100vw",
      data: { spaBooking: data, action },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (action === "edit") {
          this.updateRecord(result); // Update edited record in datasource
        } else {
          this.dataSource.data = [result, ...this.dataSource.data]; // Add new booking
        }
        this.refreshTable();
        this.toastr.success(
          `${action === "add" ? "Added" : "Edited"} booking successfully!`
        );
        this.fetchSpaBookings();
      }
    });
  }

  private updateRecord(updatedRecord: SpaBooking) {
    const index = this.dataSource.data.findIndex(
      (record) => record.id === updatedRecord.id
    );
    if (index !== -1) {
      this.dataSource.data[index] = updatedRecord;
      this.dataSource._updateChangeSubscription(); // For MatTable to detect change
    }
  }

  deleteItem(row: SpaBooking) {
    const dialogRef = this.dialog.open(DeleteSpaBookingDialogComponent, {
      data: row,
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.boniSpaService.deleteSpaBooking(row.id).subscribe({
          next: (res) => {
            if (res.status === "success") {
              this.dataSource.data = this.dataSource.data.filter(
                (record) => record.id !== row.id
              );
              this.refreshTable();
              this.toastr.success("Deleted booking successfully!");
            } else {
              this.toastr.error(res.message || "Could not delete the booking.");
            }
          },
          error: (err) => {
            this.toastr.error("Failed to delete booking.");
          },
        });
      }
    });
  }

  private refreshTable() {
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  exportExcel() {
    const exportData = this.dataSource.filteredData.map((x: SpaBooking) => ({
      "Booking Date": x.spbooking_date,
      "Client Name": `${x.spbooking_title} ${x.spbooking_name} ${x.spbooking_surname}`,
      Email: x.spbooking_email,
      Contact: x.spbooking_contact,
      "No. of Visitors": x.spbooking_noofvisitors,
      Package: x.package_names,
      Therapist: x.therapist_name,
      Reason: x.spbooking_reason,
      Allergies: x.spbooking_allergies,
      "Booked By": x.spbooking_bookedby,
      "Created At": x.created_at,
      "Updated At": x.updated_at,
    }));

    TableExportUtil.exportToExcel(exportData, "spa-bookings");
  }
}
