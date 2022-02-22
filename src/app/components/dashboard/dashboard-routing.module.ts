import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DispatchComponent } from './dispatch/dispatch.component';
import { RouteComponent } from './route/route.component';
import { ShipmentComponent } from './shipment/shipment.component';


const routes: Routes = [
  { path: '', pathMatch:'full', redirectTo: 'route' },
  { path: 'route', component: RouteComponent},
  { path: 'dispatch', component: DispatchComponent },
  { path: 'shipment', component: ShipmentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
