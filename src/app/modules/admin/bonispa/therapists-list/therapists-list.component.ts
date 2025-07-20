import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { BoniSpaService } from '../boni-spa.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatRippleModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { DeleteTherapistDialogComponent } from '../dialogs/delete-therapist-dialog/delete-therapist-dialog.component';
import { UpdateTherapistDialogComponent } from '../dialogs/update-therapist-dialog/update-therapist-dialog.component';

@Component({
  selector: 'app-therapists-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    MatMenuModule,
    MatTooltipModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    NgIf,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatOptionModule,
    MatSelectModule,
    MatDatepickerModule,
    MatIconModule,
    MatDialogModule,
     FeatherIconsComponent,
    PageHeaderComponent, // <app-page-header>
  ],
  templateUrl: './therapists-list.component.html',
  styleUrls: ['./therapists-list.component.scss'],
})
export class TherapistsListComponent {
  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);

  displayedColumns = [
    { def: 'therapists_title', label:'Title', type:'text', visible:true},
    { def: 'therapists_name', label:'Therapist Name', type:'text', visible:true},
    { def: 'therapists_surname', label:'Therapist Surname', type:'text', visible:true},
    { def: 'therapists_contacts', label:'Therapist Contact No', type:'text', visible:true},
    { def: 'created_at', label:'Action', type:'text', visible:true},
    { def: 'actions', label:'Action', type:'text', visible:true},
  ];

  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private boniSpaService: BoniSpaService,
    private toastr: ToastrService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.fetchTherapists();
  }

  fetchTherapists() {
    this.isLoading = true;
    this.boniSpaService.getSpaTherapists().subscribe({
      next: (res) => {
        this.dataSource.data = res.data || [];
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Failed to load therapists');
        this.isLoading = false;
      },
    });
  }

  refresh() {
    this.fetchTherapists();
  }

  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.dataSource.data = this.dataSource.data.filter(
      (item) => !this.selection.selected.includes(item)
    );
    this.selection.clear();
  }

  getDisplayedColumnDefs() {
    return this.displayedColumns.filter(cd => cd.visible).map(cd => cd.def);
  }



  openDialog(action: 'add' | 'edit' | 'delete', row?: any) {
    if (action === 'delete') {
      // Show confirm dialog (can use MatDialog or window.confirm for quick test)
      const dialogRef = this.dialog.open(DeleteTherapistDialogComponent, {
        width: '350px',
        data: { ...row }
      });
  
      dialogRef.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          this.boniSpaService.deleteTherapist(row.id).subscribe({
            next: (res) => {
              if (res.status === 'success') {
                this.toastr.success('Therapist deleted!');
                this.fetchTherapists();
              } else {
                // Shows: "Cannot delete therapist ID 1: assigned to 2 bookings."
                this.toastr.error(res.message || 'Could not delete therapist.');
              }
            },
            error: () => this.toastr.error('Failed to delete Therapist')
          });
        }
      });
      return;
    }
  
    // Add/Edit dialog
    const dialogRef = this.dialog.open(UpdateTherapistDialogComponent, {
      
      width: '40vw',
      maxWidth: '100vw',
      data: { action, therapistData: row }
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        debugger;
        const req$ = action === 'edit'
          ? this.boniSpaService.updateTherapist(result)
          : this.boniSpaService.addTherapist(result);
  
        req$.subscribe({
          next: () => {
            this.toastr.success(action === 'edit' ? 'Therapist updated!' : 'Therapist added!');
            this.fetchTherapists();
          },
          error: () => {
            this.toastr.error(action === 'edit' ? 'Failed to update Therapist' : 'Failed to add Therapist');
          }
        });
      }
    });
  }



}
