import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private auth: AuthService, private router: Router,  private activatedRoute: ActivatedRoute,  private titleService: Title) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    ).subscribe(() => {
    const rt = this.getChild(this.activatedRoute);
    rt.data.subscribe((data: { title: string; }) => {
      //console.log(data);
      this.title = data.title
      //console.log(this.title)
      this.titleService.setTitle(data.title)});
     });
  }

  title!:string

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    ).subscribe(() => {
    const rt = this.getChild(this.activatedRoute);
    rt.data.subscribe((data: { title: string; }) => {
     //console.log(data);
      this.title = data.title
      //console.log(this.title)
      this.titleService.setTitle(data.title)});
     });
  }

  getChild(activatedRoute: ActivatedRoute):any {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }

  onLogout(){
    this.auth._logoutUser()
  }

  /* _getTitle(){
    return this.titleService.getTitle()
  } */

}
