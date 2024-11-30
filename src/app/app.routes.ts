import { Routes } from '@angular/router';
import {MarketComponent} from "./pages/market/market.component";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/market/market.component').then(m => m.MarketComponent)
  },
];
