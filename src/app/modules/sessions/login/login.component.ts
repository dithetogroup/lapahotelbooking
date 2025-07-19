import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { Menu, TokenService } from '@core';
import { NgxRolesService } from 'ngx-permissions';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { LocalStorageService } from '@shared';
import { MatCardModule } from '@angular/material/card';
import { SettingsService } from '@core/services/settings.service';
import { LoginService } from '@core/services/login.service';
import { MenuService } from '@core/services/menu.service';



@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [
        MatCardModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatCheckboxModule,
        RouterLink,
        TranslateModule
    ]
})
export class LoginComponent {
  isSubmitting = false;
  error = '';
  hide = true;
  options = this.settings.getOptions();
  themeStyle = '';
  messageType: string = '';
  message: string = '';


  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private tokenService: TokenService,
    private rolesService: NgxRolesService,
    private store: LocalStorageService,
    private settings: SettingsService,
    private loginService: LoginService,
    private menuService: MenuService,


  ) {
    this.themeStyle = this.options.theme;
  }

  get username() {
    return this.loginForm.get('username')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  get rememberMe() {
    return this.loginForm.get('rememberMe')!;
  }

  adminSet() {
   // this.loginForm.get('username')?.setValue('Boni');
   // this.loginForm.get('password')?.setValue('Mypassword');

   // this.loginForm.get('username')?.setValue('admin');
    //this.loginForm.get('password')?.setValue('admin');
  }
  employeeSet() {
    //this.loginForm.get('username')?.setValue('');
    //this.loginForm.get('password')?.setValue('');

    this.loginForm.get('username')?.setValue('Boni');
     this.loginForm.get('password')?.setValue('mypassword');
  }
  bookingSet() {
    this.loginForm.get('username')?.setValue('booking');
    this.loginForm.get('password')?.setValue('booking');
  }
  // login() {
  //   this.isSubmitting = true;
  //   this.auth.login(
  //     this.username.value,
  //     this.password.value,
  //     this.rememberMe.value
  //   );
  // }



  login() {
    if (this.loginForm.invalid) return;
    this.isSubmitting = true;
  
    const username = this.loginForm.value.username ?? '';
    const password = this.loginForm.value.password ?? '';
    if (!username || !password) {
      this.messageType = 'error';
      this.message = 'Username and password required.';
      return;
    }
  
    this.isSubmitting = true;
    this.loginService.loginUser(username, password).subscribe({
      next: (response) => {
        this.isSubmitting = false;
  
        if (response.status === 'success') {

          this.menuService.loadMenu(); // <--- IMPORTANT!

          // Token, user, session setup as before...
          const token = response.token;
          this.tokenService.set(token);
          const roleData: [] = response.user.role ?? [];
          roleData.sort((a: any, b: any) => a.priority - b.priority);
          this.tokenService.roleArray = roleData;
          this.tokenService.permissionArray = response.user.permissions;
          this.auth.user$.next(response.user);
          this.store.set('currentUser', response.user);
          const roleNames = roleData.map((role: { name: string }) => role.name);
          this.store.set('roleNames', JSON.stringify(roleNames));
  
          this.auth.menu().subscribe(menu => {
            console.log('Menu after login:', menu);
  
            // Now navigate
            for (const role of this.tokenService.roleArray ?? []) {
              if (role['name'] == 'ADMIN') {
                this.router.navigate(['dashboard/dashboard1']);
                break;
              } else if (role['name'] == 'EMPLOYEE') {
                this.router.navigateByUrl('occupancy');
                break;
              } else {
                this.router.navigateByUrl('emp_dashboard/dashboard2');
              }
            }
          });
  
          this.messageType = 'success';
          this.message = 'Login successful.';
  
        } else {
          this.messageType = 'error';
          this.message = response.message || 'Login failed.';
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        this.messageType = 'error';
        this.message = "Login failed. Please try again.";
        console.error(error);
      }
    });
  }
  


  
  
}
