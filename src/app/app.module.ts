import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { SnackbarComponent } from './components/shared/snackbar/snackbar.component';
import { RouteComponent } from './components/dashboard/route/route.component';
//import { DispatchComponent } from './components/dashboard/dispatch/dispatch.component';
import { ShipmentComponent } from './components/dashboard/shipment/shipment.component';
import { MaterialModule } from './material.module';
import { FormsModule } from '@angular/forms';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthGuard } from '@angular/fire/compat/auth-guard';
//import { DispatchService } from './services/dispatch.service';
import { RouteService } from './services/route.service';
import { ShipmentService } from './services/shipment.service';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTableExporterModule } from 'mat-table-exporter';
import { OrganizerComponent } from './components/dashboard/organizer/organizer.component';
import { NgxDropzoneModule } from 'ngx-dropzone';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SnackbarComponent,
    RouteComponent,
    //DispatchComponent,
    ShipmentComponent,
    OrganizerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    HttpClientModule,
    MatTableExporterModule,
    NgxDropzoneModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
  ],
  providers: [AngularFireAuthGuard, RouteService, ShipmentService, Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
