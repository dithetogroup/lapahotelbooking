import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { BoniSpaService } from '../boni-spa.service';
import { PackageDialogComponent } from '../dialogs/package-dialog/package-dialog.component';
import { DeletePackageDialogComponent } from '../dialogs/delete-package-dialog/delete-package-dialog.component';
import { NgFor, NgIf, NgClass, DecimalPipe, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { OccupancyService } from '../../occupancy/occupancy.service';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';

@Component({
  selector: 'app-packages-list',
  templateUrl: './packages-list.component.html',
  styleUrls: ['./packages-list.component.scss'],
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
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatOptionModule,
    MatSelectModule,
    MatDatepickerModule,
    DecimalPipe,
    MatIconModule,
    MatDialogModule,
    FeatherIconsComponent,
    PageHeaderComponent, // <app-page-header>
  ]
})
export class PackagesListComponent {
  dataSource = new MatTableDataSource<any>([]);

  displayedColumns = [
    { def: 'package_name', label:'Package Name', type:'text', visible:true},
    { def: 'package_type', label:'Package Type', type:'text', visible:true},
    { def: 'package_time', label:'Session Time', type:'text', visible:true},
    { def: 'package_price', label:'Price', type:'text', visible:true},
    { def: 'actions', label:'Action', type:'text', visible:true},
  ];

  isLoading = false;
  packageForm: FormGroup;
  selection = new SelectionModel<any>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private boniSpaService: BoniSpaService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private occupancyService: OccupancyService
  ) {
    this.packageForm = this.fb.group({
      id: [null],
      package_name: ['', Validators.required],
      package_type: ['', Validators.required],
      package_time: [30, [Validators.required, Validators.min(1)]],
      package_price: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.fetchPackages();
  }

  fetchPackages() {
    this.isLoading = true;
    this.occupancyService.getPackages().subscribe({
      next: (res) => {
        this.dataSource.data = res.data || [];
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Failed to load packages');
        this.isLoading = false;
      },
    });
  }

  refresh() {
    this.fetchPackages();
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

  openDialog(action: 'add' | 'edit' | 'delete', row?: any) {
    if (action === 'delete') {
      // Show confirm dialog (can use MatDialog or window.confirm for quick test)
      const dialogRef = this.dialog.open(DeletePackageDialogComponent, {
        width: '350px',
        data: { ...row }
      });
  
      dialogRef.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          debugger;
          this.boniSpaService.deletePackage(row.id).subscribe({
            next: () => {
              this.toastr.success('Package deleted!');
              this.fetchPackages();
            },
            error: () => this.toastr.error('Failed to delete package')
          });
        }
      });
      return;
    }
  
    // Add/Edit dialog
    const dialogRef = this.dialog.open(PackageDialogComponent, {
      
      width: '40vw',
      maxWidth: '100vw',
      data: { action, packageData: row }
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        debugger;
        const req$ = action === 'edit'
          ? this.boniSpaService.updatePackage(result)
          : this.boniSpaService.addPackage(result);
  
        req$.subscribe({
          next: () => {
            this.toastr.success(action === 'edit' ? 'Package updated!' : 'Package added!');
            this.fetchPackages();
          },
          error: () => {
            this.toastr.error(action === 'edit' ? 'Failed to update package' : 'Failed to add package');
          }
        });
      }
    });
  }
  
  
  savePackage(dialogRef: any, action: 'add' | 'edit') {
    const formValue = this.packageForm.getRawValue();
    if (action === 'edit') {
      this.boniSpaService.updatePackage(formValue).subscribe({
        next: (res) => {
          this.toastr.success('Package updated!');
          dialogRef.close();
          this.fetchPackages();
        },
        error: () => {
          this.toastr.error('Failed to update package');
        }
      });
    } else {
      this.boniSpaService.updatePackage(formValue).subscribe({
        next: (res) => {
          this.toastr.success('Package added!');
          dialogRef.close();
          this.fetchPackages();
        },
        error: () => {
          this.toastr.error('Failed to add package');
        }
      });
    }
  }

  confirmDelete(dialogRef: any, id: number) {
    this.deletePackage(id);
    dialogRef.close();
  }

  deletePackage(id: number) {
    this.boniSpaService.deletePackage(id).subscribe({
      next: (res) => {
        this.toastr.success('Package deleted!');
        this.fetchPackages();
      },
      error: () => {
        this.toastr.error('Failed to delete package');
      }
    });
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


}
