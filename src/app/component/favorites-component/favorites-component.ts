import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Recipe } from '../../models/recipe.model';
import { RecipeStore } from '../../stores/recipe.store';

@Component({
  selector: 'app-favorites-component',
  imports: [CommonModule],
  templateUrl: './favorites-component.html',
  styleUrl: './favorites-component.scss'
})
export class FavoritesComponent {

  favoriteRecipes: Observable<Recipe[]>;

  constructor(public store: RecipeStore) {

    this.favoriteRecipes = this.store.favoritesDishes.pipe(
      map(ids => this.store.recipesSubject.getValue().filter(r => ids.includes(r.id)))
    );
  }

  toggleFav(id:number) { 
    this.store.toggleFavorite(id); 
  }
}
