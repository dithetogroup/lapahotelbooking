import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '@shared';

@Component({
  selector: 'app-branding',
  template: `
    <div
      class="d-inline-block text-nowrap r-full text-reset m-l-12 m-r-12"
      (click)="goToHome()"
    >
      <img
        src="./assets/images/logosun.png"
        class="brand-logo align-middle m-2"
        alt="logo"
      />
      <span class="brand-name">Lapa Hotel</span>
    </div>
  `,
  styles: [
    `
      .brand-logo {
        width: 30px;
        height: 30px;
        cursor: pointer;
      }
      .brand-name {
        vertical-align: middle;
        font-weight: 500;
        font-size: 20px;
        margin: 0px 8px;
        cursor: pointer;
      }
    `,
  ],
  standalone: true,
})
export class BrandingComponent {
  constructor(private router: Router, private store: LocalStorageService) {}
  goToHome() {
    debugger;
    const currentUser = this.store.get('currentUser');
    const roleName = currentUser.role[0]?.name;
    if (roleName == 'ADMIN') {
      this.router.navigate(['dashboard/dashboard1']);
    } else if (roleName == 'EMPLOYEE') {
      this.router.navigateByUrl('occupancy');
    } else if(roleName == 'BOOKING'){
      this.router.navigateByUrl('bookings/all-bookings');
    }
  }
}
