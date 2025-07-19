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
import { RoomRatesComponent } from '../rooms/room-rates/room-rates.component';
import { DeleteDialogComponent } from '../bookings/cancel-bookings/dialogs/delete/delete.component';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { TableExportUtil, rowsAnimation } from '@shared';
import { CommonModule, DatePipe } from '@angular/common';
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
import { RoomRatesService } from '../rooms/room-rates/room-rates.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MAT_DATE_LOCALE,
  MatOptionModule,
  MatRippleModule,
} from '@angular/material/core';
//import { RegularClients } from './room-rates-all.model';
//import { RegularClients } from '../rooms/room-rates/room-rates-all.model';
import { ToastrService } from 'ngx-toastr';
import { RegularClientsService } from './regular-clients.service';
import { RegularClients } from './regular.model';
import { DeleteRegularClientComponent } from './dialogs/delete-regular-client/delete-regular-client.component';
import { EditRegularClientDialogComponent } from './dialogs/edit-regular-client-dialog/edit-regular-client-dialog.component';
import { ViewRegularClientDialogComponent } from './dialogs/view-regular-client-dialog/view-regular-client-dialog.component';

@Component({
  selector: 'app-regular-clients',
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
    FeatherIconsComponent,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatPaginatorModule,
  ],
  templateUrl: './regular-clients.component.html',
  styleUrl: './regular-clients.component.scss'
})
export class RegularClientsComponent {
  columnDefinitions = [
    { def: 'rg_account', label: 'Account', type: 'text', visible: true },
    { def: 'rg_title', label: 'Title', type: 'text', visible: true }, 
    { def: 'rg_name', label: 'Name', type: 'text', visible: true },
    { def: 'rg_surname', label: 'Surname', type: 'text', visible: true },
    { def: 'rg_company', label: 'Company', type: 'text', visible: true },
    { def: 'rg_email', label: 'Email', type: 'text', visible: true },
    { def: 'rg_phone', label: 'Phone', type: 'text', visible: true },
   
    { def: 'rg_address', label: 'Address', type: 'text', visible: true },
    // { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true },
  ];
  

  dataSource: MatTableDataSource<RegularClients, MatPaginator> = new MatTableDataSource<RegularClients, MatPaginator>([]);
  selection = new SelectionModel<RegularClients>(true, []);
  private destroy$ = new Subject<void>();
  contextMenuPosition = { x: '0px', y: '0px' };
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild(MatMenuTrigger) contextMenu?: MatMenuTrigger;

  constructor(
    private dialog: MatDialog,
    private roomRatesService: RoomRatesService,
    private regularClientService: RegularClientsService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.loadRegularClients();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refresh() {
    this.loadRegularClients();
  }

  // getDisplayedColumns(): string[] {
  //   return this.columnDefinitions
  //     .filter((cd) => cd.visible)
  //     .map((cd) => cd.def);
  // }

  getDisplayedColumns() {
    // Only include visible columns, then add "actions" at the end
    return this.columnDefinitions.filter(col => col.visible).map(col => col.def).concat(['actions']);
  }
  

  addNew() {
    this.openDialog('add');
  }

  editCall(row: RegularClients) {
    this.openDialog('edit', row);
  }


  viewCall(data: any) {
    const dialogRef = this.dialog.open(ViewRegularClientDialogComponent, {
      width: '60vw',
      maxWidth: '100vw',
     data: { regularClient: data },
      autoFocus: false,
    });
  }


  openDialog(action: 'add' | 'edit', data?: RegularClients) {
    const dialogRef = this.dialog.open(EditRegularClientDialogComponent, {
      width: '60vw',
      maxWidth: '100vw',
      data: { regularClient: data, action },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (action === 'edit') {
          this.updateRecord(result);        // Update the edited record in the datasource
        } else {
          this.dataSource.data = [result, ...this.dataSource.data]; // Add new client
        }
        this.refreshTable();
        this.toastr.success(`${action === 'add' ? 'Add' : 'Edit'} record successfully!`);
        this.loadRegularClients();
      }

    });
  }

  private updateRecord(updatedRecord: RegularClients) {
    const index = this.dataSource.data.findIndex(
      (record) => record.id === updatedRecord.id
    );
    if (index !== -1) {
      this.dataSource.data[index] = updatedRecord;
      this.dataSource._updateChangeSubscription(); // For MatTable to detect change
    }
  }

  deleteItem(row: RegularClients) {
    const dialogRef = this.dialog.open(DeleteRegularClientComponent, { data: row });
    dialogRef.afterClosed().subscribe((confirmed) => {
      debugger;
      if (confirmed) {
        this.regularClientService.deleteRegularClient(row.rg_account).subscribe({
          next: (res) => {
            if (res.status === 'success') {
              this.dataSource.data = this.dataSource.data.filter(
                (record) => record.id !== row.id
              );
              this.refreshTable();
              this.toastr.success('Deleted record successfully!');
            } else {
              this.toastr.error(res.message || 'Could not delete the client.');
            }
          },
          error: (err) => {
            this.toastr.error('Failed to delete client.');
          }
        });
      }
    });
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
    this.showNotification(
      'snackbar-danger',
      `${totalSelect} record(s) deleted successfully!`,
      'bottom',
      'center'
    );
  }

  loadRegularClients() {
    this.regularClientService.getRegularGuest().subscribe({
      next: (res) => {
        // If your API returns data as res.data, otherwise use just res
        const data = (res.data || res).map((item: any) => new RegularClients({
          id: parseInt(item.id, 10),
          rg_account: item.rg_account,
          rg_title: item.rg_title,
          rg_name: item.rg_name,
          rg_surname: item.rg_surname,
          rg_company: item.rg_company,
          rg_email: item.rg_email,
          rg_address: item.rg_address,
          rg_phone: item.rg_phone,
          rg_company_phone: item.rg_company_phone,
          rg_company_person: item.rg_company_person,
          rg_company_website: item.rg_company_website,
          rg_isliable: item.rg_isliable,
          rg_company_vat: item.rg_company_vat,
          rg_company_type: item.rg_company_type,
          created_at: item.created_at,
          updated_at: item.updated_at,
        }));
  
        this.dataSource.data = data;

        console.log('regular clients', this.dataSource.data);
        this.isLoading = false;
        this.refreshTable();
  
        // Optional: Update filterPredicate for RegularClients
        this.dataSource.filterPredicate = (data: RegularClients, filter: string) =>
          Object.values(data)
            .some(value => value?.toString().toLowerCase().includes(filter));
      },
      error: (err) => console.error(err),
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
    const exportData = this.dataSource.filteredData.map((x: RegularClients) => ({
      'Account': x.rg_account,
      'Title': x.rg_title,
      'Name': x.rg_name,
      'Surname': x.rg_surname,
      'Company': x.rg_company,
      'Email': x.rg_email,
      'Phone': x.rg_phone,
      'Address': x.rg_address,
      'Created At': x.created_at,
      'Updated At': x.updated_at,
    }));
  
    TableExportUtil.exportToExcel(exportData, 'regular-clients');
  }
  

  onContextMenu(event: MouseEvent, item: RegularClients) {
    event.preventDefault();
    this.contextMenuPosition.x = `${event.clientX}px`;
    this.contextMenuPosition.y = `${event.clientY}px`;
    if (this.contextMenu && this.contextMenu.menu) {
      this.contextMenu.menuData = { item };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }
}
