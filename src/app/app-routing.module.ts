import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { GuardLoginGuard } from './guards/guard-login.guard';
import { HomePage } from './home/home.page';
import { AppComponent } from './app.component';
import { GuardRoleGuard } from './guards/guard-role.guard';
import { Roles } from './interfaces/roles';

const routes: Routes = [
  {
    path: '',
    component:HomePage,
    children:[
      {
        path:'',
        loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
    ],
    canActivate:[GuardLoginGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./usuarios/usuarios.module').then( m => m.UsuariosPageModule),
    canActivate: [GuardLoginGuard, GuardRoleGuard],
    data:{roles:[
      Roles.Administrador,
      Roles.Gerente_Ventas,
      Roles.Asistente_Ventas
    ]}
  },
  {
    path: 'clientes',
    loadChildren: () => import('./clientes/clientes.module').then( m => m.ClientesPageModule),
    canActivate: [GuardLoginGuard, GuardRoleGuard],
    data:{roles:[
      Roles.Administrador,
      Roles.Gerente_Ventas,
      Roles.Gerente_Zona
    ]}
  },
  {
    path: 'granjas',
    loadChildren: () => import('./granjas/granjas.module').then( m => m.GranjasPageModule),
    canActivate: [GuardLoginGuard, GuardRoleGuard],
    data:{roles:[
      Roles.Administrador,
      Roles.Gerente_Ventas,
      Roles.Gerente_Zona,
      Roles.Cliente
    ]}
  },
  {
    path: 'galpones',
    loadChildren: () => import('./galpones/galpones.module').then( m => m.GalponesPageModule),
    canActivate: [GuardLoginGuard, GuardRoleGuard],
    data:{roles:[
      Roles.Administrador,
      Roles.Gerente_Ventas,
      Roles.Gerente_Zona,
      Roles.Cliente
    ]}
  },
  {
    path: 'lotes',
    loadChildren: () => import('./lotes/lotes.module').then( m => m.LotesPageModule),
    canActivate: [GuardLoginGuard, GuardRoleGuard],
    data:{roles:[
      Roles.Administrador,
      Roles.Gerente_Ventas,
      Roles.Gerente_Zona,
      Roles.Cliente
    ]}
  },
  {
    path: 'informacion-productiva',
    loadChildren: () => import('./informacion-productiva/informacion-productiva.module').then( m => m.InformacionProductivaPageModule),
    canActivate: [GuardLoginGuard, GuardRoleGuard],
    data:{roles:[
      Roles.Administrador,
      Roles.Gerente_Ventas,
      Roles.Gerente_Zona,
      Roles.Cliente
    ]}
  },
  {
    path: 'liquidaciones',
    loadChildren: () => import('./liquidaciones/liquidaciones.module').then( m => m.LiquidacionesPageModule),
    canActivate: [GuardLoginGuard, GuardRoleGuard],
    data:{roles:[
      Roles.Administrador,
      Roles.Gerente_Ventas,
      Roles.Gerente_Zona,
      Roles.Cliente
    ]}
  },
  {
    path: 'reportes',
    loadChildren: () => import('./reportes/reportes.module').then( m => m.ReportesPageModule),
    canActivate: [GuardLoginGuard, GuardRoleGuard],
    data:{roles:[
      Roles.Administrador,
      Roles.Gerente_Ventas,
      Roles.Asistente_Ventas,
      Roles.Gerente_Zona,
      Roles.Cliente
    ]}
  },
  {
    path: 'reporte-infosemanal',
    loadChildren: () => import('./rep-info-prod-semanal/rep-info-prod-semanal.module').then( m => m.RepInfoProdSemanalPageModule)
  },
  {
    path: 'reporte-liquidaciones',
    loadChildren: () => import('./rep-liquidaciones/rep-liquidaciones.module').then( m => m.RepLiquidacionesPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
