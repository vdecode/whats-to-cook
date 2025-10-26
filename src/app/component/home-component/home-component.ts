import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { RecipeStore } from '../../stores/recipe.store';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-home-component',
  imports: [CommonModule, RouterLink],
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss'
})
export class HomeComponent {
  filtered: Observable<Recipe[]>;
  favorites: Observable<number[]>;

  constructor(public store: RecipeStore, private router: Router){
    this.filtered = this.store.filteredRecipes;
    this.favorites = this.store.favoritesDishes;
    console.log(this.favorites)
  }
  
  onSearch(name: string) { 
    this.store.setSearch(name); 
  
  }
  onIngredient(name: string) { 
    this.store.setIngredient(name); 
  
  }
  onCuisine(element: string) { 
    this.store.setCuisine(element); 
  
  }
  toggleFav(id: number) { 
    console.log('hello all', id)
    this.store.toggleFavorite(id)
    //console.log(this.store.favorites$); 
  }

  click(id: number) {
    console.log('hello')
    this.router.navigate(['/recipe', id]);
  }

}
