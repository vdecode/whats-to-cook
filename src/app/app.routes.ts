import { Routes } from '@angular/router';
import { HomeComponent } from './component/home-component/home-component';
import { RecipeDetailComponent } from './component/recipe-detail-component/recipe-detail-component';
import { FavoritesComponent } from './component/favorites-component/favorites-component';
import { ShoppingListComponent } from './component/shopping-list-component/shopping-list-component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
  { path: 'recipe/:id', component: RecipeDetailComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'shopping', component: ShoppingListComponent },
  { path: '**', redirectTo: '' },
];
