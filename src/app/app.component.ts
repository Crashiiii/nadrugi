import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/auth.service';
import { Router, NavigationEnd, UrlSegment } from '@angular/router';
import { filter, map } from 'rxjs/operators';

const routes = {
  '/homepage': 'Strona Główna',
  '/calculator': 'Kalkulator kosztów',
  '/samples': 'Wzory orzeczeń',
  '/contact': 'Formularz',
  '/login': 'Logowanie',
  '/registration': 'Rejestracja',
  '/forgot-password': 'Zapomniałem Hasła',
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  currentRouteTitle: string = '';
  isLoggedIn: boolean = false;

  user$ = this.auth.user$;
  title$ = this.router.events.pipe(
    filter<NavigationEnd>((event) => {
      return (
        event instanceof NavigationEnd &&
        !!this.router.parseUrl(event.urlAfterRedirects).root.children['primary']
      );
    }),
    map((event) => {
      const routePath = '/' + this.extractRoutePath(event.urlAfterRedirects);
      return routes[routePath] || '';
    })
  );

  constructor(private auth: AuthService, private router: Router) {
    this.auth.user$.subscribe((user) => {
      this.isLoggedIn = !!user;
    });
  }
  ngOnInit(): void {}

  private extractRoutePath(url: string): string {
    const urlSegments: UrlSegment[] =
      this.router.parseUrl(url).root.children['primary'].segments;
    return urlSegments.map((segment) => segment.path).join('/');
  }

  logout() {
    this.auth.logout();
  }
}
