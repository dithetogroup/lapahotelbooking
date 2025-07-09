import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { StartupService } from '@core/services/startup.service';


@Component({
    selector: 'app-root',
    imports: [RouterModule],
    providers: [],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private renderer: Renderer2,
    private startupService: StartupService,
    private authService: AuthService,

  ) {
    this.startupService.load();
    this.authService.initializeAuth();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const loader = this.renderer.selectRootElement('.loader');
      if (loader.style.display != 'none') {
        loader.style.display = 'none';
      }
    }
  }
}
