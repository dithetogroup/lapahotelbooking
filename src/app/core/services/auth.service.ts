import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, iif, merge, of } from 'rxjs';
import { share, switchMap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { LoginService } from './login.service';
import { User } from '@core/models/interface';
import { Router } from '@angular/router';
import { LocalStorageService } from '@shared';
import { MenuService } from '@core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$ = new BehaviorSubject<User>({});

  private change$ = merge(
    this.tokenService.change(),
    this.tokenService.refresh().pipe(switchMap(() => this.refresh()))
  ).pipe(
    switchMap(() => {
      return this.assignUser(this.user$);
    }),
    share()
  );

  constructor(
    private loginService: LoginService,
    private tokenService: TokenService,
    private router: Router,
    private store: LocalStorageService,
    private menuService: MenuService
  ) {
    this.user$ = new BehaviorSubject<User>(this.store.get('currentUser'));
    this.restoreSession();
  }

  init() {
    return new Promise<void>((resolve) =>
      this.change$.subscribe(() => resolve())
    );
  }

  initializeAuth() {
    const user = this.store.get('currentUser');
    const roleNames = this.store.get('roleNames');

    if (user && roleNames) {
      this.user$.next(user);
      this.tokenService.permissionArray = user.permissions ?? [];
      
      try {
        this.tokenService.roleArray = typeof roleNames === 'string' ? JSON.parse(roleNames) : roleNames;
      } catch (e) {
        console.error('[ERROR] Failed to parse roleNames:', roleNames, e);
        this.tokenService.roleArray = [];
      }
      

      // Re-load the menu
      this.menuService.loadMenu();
    }
  }

  restoreSession() {
    const token = this.tokenService.getToken();
    if (token && token.valid && token.valid()) {
      const savedUser = this.store.get('currentUser');
      if (savedUser) {
        this.user$.next(savedUser);
      }
    } else {
      this.user$.next({});
      this.store.remove('currentUser');
    }
  }

  change() {
    return this.change$;
  }

  check() {
    return this.tokenService.valid();
  }
  login(username: string, password: string, rememberMe = false) {
    return this.loginService.login(username, password, rememberMe).subscribe({
      next: (response) => {
        const returnValue = JSON.parse(JSON.stringify(response))['token'];
        this.tokenService.set(returnValue);
        const roleData: [] = JSON.parse(JSON.stringify(response))['user'][
          'role'
        ];
        roleData.sort((a: any, b: any) => {
          const aPri: number = a['priority'];
          const bPri: number = b['priority'];
          if (aPri > bPri) return 1;
          else if (aPri < bPri) return -1;
          else return 0;
        });
        this.tokenService.roleArray = roleData;
        this.tokenService.permissionArray = JSON.parse(
          JSON.stringify(response)
        )['user']['permissions'];

        this.user$.next(JSON.parse(JSON.stringify(response))['user']);
        this.store.set('currentUser', response.user);
        // Store role names in a new array
        const roleNames = this.tokenService.roleArray.map(
          (role: { name: string }) => role.name
        );

        const roleNamesJSON = JSON.stringify(roleNames);

        // Store the JSON string in LocalStorage
        this.store.set('roleNames', roleNamesJSON);
        for (const role of this.tokenService.roleArray ?? []) {
          if (role['name'] == 'ADMIN') {
            this.router.navigate(['dashboard/dashboard1']);
            break;
          } else if (role['name'] == 'EMPLOYEE') {
            this.router.navigateByUrl('occupancy');
            break;
          } else{
            this.router.navigateByUrl('emp_dashboard/dashboard2');
          }
        }
      },
      error: (error) => {
        // Handle errors here
        console.error(error);
      },
    });
  }
  refresh() {
    return this.loginService.refresh();
  }

  logout() {
    return this.loginService.logout().subscribe((res) => {
      if (!res.success) {
        this.tokenService.clear();
        this.router.navigateByUrl('/auth/login');
      }
    });
  }

  user() {
    return this.user$.pipe(share());
  }

  menu() {
    return iif(() => this.check(), this.loginService.menu(), of([]));
  }

  assignUser(user: BehaviorSubject<User>): Observable<User> {
    this.user$.next(user.getValue()); // Update the user$ BehaviorSubject with the new value
    return this.user$.asObservable(); // Return an observable that emits the new user value
  }
}
