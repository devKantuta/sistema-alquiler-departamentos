import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';

// Componentes
import { LoginComponent } from './components/login/login.component';
import { SignInComponent } from './components/sign-in/sign-in.component';

// Guards
import { AuthGuard } from './utils/auth.guard';
import { CuartoComponent } from './components/cuarto/cuarto.component';
import { InquilinoComponent } from './components/inquilino/inquilino.component';
import { ContratoComponent } from './components/contrato/contrato.component';
import { DeudaComponent } from './components/deuda/deuda.component';
import { PagoComponent } from './components/pago/pago.component';
import { ReporteComponent } from './components/reporte/reporte.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signIn', component: SignInComponent },
  { path: 'cuarto', component: CuartoComponent },
  { path: 'inquilino', component: InquilinoComponent },
  { path: 'contrato', component: ContratoComponent },
  { path: 'deuda', component: DeudaComponent},
  { path: 'pago', component: PagoComponent},
  { path: 'reporte', component: ReporteComponent},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
