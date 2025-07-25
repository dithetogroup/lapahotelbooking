/* eslint-disable @angular-eslint/component-selector */
import { Component } from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatLineModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
    selector: 'bottom-sheet-overview-example-sheet',
    template: `
    <mat-nav-list>
      <a
        href="https://keep.google.com/"
        mat-list-item
        (click)="openLink($event)"
      >
        <span mat-line>Google Keep</span>
        <span mat-line>Add to a note</span>
      </a>

      <a
        href="https://docs.google.com/"
        mat-list-item
        (click)="openLink($event)"
      >
        <span mat-line>Google Docs</span>
        <span mat-line>Embed in a document</span>
      </a>

      <a
        href="https://plus.google.com/"
        mat-list-item
        (click)="openLink($event)"
      >
        <span mat-line>Google Plus</span>
        <span mat-line>Share with your friends</span>
      </a>

      <a
        href="https://hangouts.google.com/"
        mat-list-item
        (click)="openLink($event)"
      >
        <span mat-line>Google Hangouts</span>
        <span mat-line>Show to your coworkers</span>
      </a>
    </mat-nav-list>
  `,
    imports: [MatListModule, MatLineModule]
})
export class BottomSheetOverviewComponent {
  constructor(
    private bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewComponent>
  ) {}

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
}

@Component({
    selector: 'app-bottom-sheet',
    templateUrl: './bottom-sheet.component.html',
    styleUrls: ['./bottom-sheet.component.scss'],
    imports: [
        PageHeaderComponent,
        MatCardModule,
        MatButtonModule,
        MatBottomSheetModule,
    ]
})
export class BottomSheetComponent {
  constructor(private bottomSheet: MatBottomSheet) {}

  openBottomSheet(): void {
    this.bottomSheet.open(BottomSheetOverviewComponent);
  }
}
