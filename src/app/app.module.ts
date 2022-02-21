import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { SnackbarComponent } from './components/shared/snackbar/snackbar.component';
import { RouteComponent } from './components/dashboard/route/route.component';
import { DispatchComponent } from './components/dashboard/dispatch/dispatch.component';
import { ShipmentComponent } from './components/dashboard/shipment/shipment.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SnackbarComponent,
    RouteComponent,
    DispatchComponent,
    ShipmentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
