import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizerComponent } from './organizer/organizer.component';
import { RouteComponent } from './route/route.component';
import { ShipmentComponent } from './shipment/shipment.component';


const routes: Routes = [
  { path: '', pathMatch:'full', redirectTo: 'route' },
  { path: 'route', component: RouteComponent},
  { path: 'sort', component: OrganizerComponent },
  { path: 'shipment', component: ShipmentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
