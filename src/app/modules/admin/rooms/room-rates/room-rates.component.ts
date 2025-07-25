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
import { RoomRatesFormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
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
import { RoomRatesService } from './room-rates.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MAT_DATE_LOCALE,
  MatOptionModule,
  MatRippleModule,
} from '@angular/material/core';
import { RoomTypeDetails } from './room-rates-all.model';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-room-rates',
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
  templateUrl: './room-rates.component.html',
  styleUrls: ['./room-rates.component.scss']
})
export class RoomRatesComponent implements OnInit, OnDestroy {
  columnDefinitions = [
    { def: 'roomName', label: 'Room Name', type: 'text', visible: true },
    { def: 'weekRate', label: 'Week Rate', type: 'number', visible: true },
    { def: 'weekendRate', label: 'Weeked Rate', type: 'number', visible: true },
    { def: 'discountedRate', label: 'Discounted Rate', type: 'number', visible: true },
    { def: 'bedType', label: 'Bed Type', type: 'text', visible: true },
    { def: 'totalRooms', label: 'Total Rooms', type: 'text', visible: true },
    { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true }
  ];

  dataSource: MatTableDataSource<RoomTypeDetails, MatPaginator> = new MatTableDataSource<RoomTypeDetails, MatPaginator>([]);
  selection = new SelectionModel<RoomTypeDetails>(true, []);
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

  getDisplayedColumns(): string[] {
    return this.columnDefinitions
      .filter((cd) => cd.visible)
      .map((cd) => cd.def);
  }

  addNew() {
    this.openDialog('add');
  }

  editCall(row: RoomTypeDetails) {
    debugger;
    this.openDialog('edit', row);
  }

  openDialog(action: 'add' | 'edit', data?: RoomTypeDetails) {
   // debugger;
    const dialogRef = this.dialog.open(RoomRatesFormDialogComponent, {
      width: '60vw',
      maxWidth: '100vw',
      data: { roomRates: data, action },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (action === 'edit') {
          this.dataSource.data = [result, ...this.dataSource.data];
        } else {
        //  debugger;
          this.updateRecord(result);
          this.loadData();
        }
        this.refreshTable();
        this.toastr.success(`${action === 'add' ? 'Add' : 'Edit'} record successfully!`);
        this.loadData();
      }
    });
  }

  private updateRecord(updatedRecord: RoomTypeDetails) {
    const index = this.dataSource.data.findIndex(
      (record) => record.roomTypeId === updatedRecord.roomTypeId
    );
    if (index !== -1) {
      this.dataSource.data[index] = updatedRecord;
      this.dataSource._updateChangeSubscription();
    }
  }

  deleteItem(row: RoomTypeDetails) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, { data: row });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource.data = this.dataSource.data.filter(
          (record) => record.roomTypeId !== row.roomTypeId
        );
        this.refreshTable();
        this.toastr.success('Deleted record successfully!');
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

  loadData() {
    this.roomRatesService.getAllRoomRates().subscribe({
      next: (res) => {
        const data = res.data.map((item: any) => ({
          roomTypeId: parseInt(item.room_type_id, 10),
          roomName: item.room_name,
          roomCode: item.room_code,
          weekendRate: item.weekend_price,
          weekRate: item.week_price,
          discountedRate: item.discounted_price,
          bedType: item.bed_type,
          totalRooms: parseInt(item.total_rooms, 10),
        }));

        this.dataSource.data = data;
        this.isLoading = false;
        this.refreshTable();

        this.dataSource.filterPredicate = (data: RoomTypeDetails, filter: string) =>
          Object.values(data).some((value) =>
            value.toString().toLowerCase().includes(filter)
          );
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
    const exportData = this.dataSource.filteredData.map((x: RoomTypeDetails) => ({
      'Room Name': x.roomName,
      'Room Code': x.roomCode,
      'Weekend Rate': x.weekendRate,
      'Discounted Rate': x.discountedRate,
      'Bed Type': x.bedType,
      'Total Rooms': x.totalRooms,
    }));

    TableExportUtil.exportToExcel(exportData, 'room-types');
  }

  onContextMenu(event: MouseEvent, item: RoomTypeDetails) {
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
