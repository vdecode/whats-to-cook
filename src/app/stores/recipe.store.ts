import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Recipe } from '../models/recipe.model';
import { RecipeService } from '../services/recipe-service';

@Injectable({ providedIn: 'root' })
export class RecipeStore {
  recipesSubject = new BehaviorSubject<Recipe[]>([]);
  recipes = this.recipesSubject.asObservable();

  search = new BehaviorSubject<string>('');
  ingredients = new BehaviorSubject<string>('');
  cuisine = new BehaviorSubject<string>('');

  favoritesSubject = new BehaviorSubject<number[]>([]);
  favoritesDishes = this.favoritesSubject.asObservable();

  filteredRecipes = combineLatest([
    this.recipes,
    this.search,
    this.ingredients,
    this.cuisine
  ]).pipe(map(([recipes,s,i,c])=>{
    s = (s||'').trim().toLowerCase();
    i = (i||'').trim().toLowerCase();
    c = (c||'').trim().toLowerCase();
    return recipes.filter(r=>{
      const name = (r.name||'').toLowerCase();
      const instructionsStr = Array.isArray(r.instructions) ? r.instructions.join(' ').toLowerCase() : (r.instructions||'').toLowerCase();
      const matchesSearch = s? (name.includes(s) || instructionsStr.includes(s)) : true;
      const matchesIng = i? (r.ingredients||[]).some(x=>x.toLowerCase().includes(i)) : true;
      const matchesCuisine = c? (r.cuisine||'').toLowerCase().includes(c) : true;
      return matchesSearch && matchesIng && matchesCuisine;
    });
  }));

  constructor(private recipe: RecipeService){
    this.recipe.fetchAll().subscribe(list => {
      console.log('fetched recipes', list);
      const fixed = (list.recipes).map((r: any) => ({
        ...r,
        ingredients: Array.isArray(r.ingredients)? r.ingredients : [String(r.ingredients)],
        images: r.image ? [r.image] : []
      }));
      this.recipesSubject.next(fixed);
      console.log('response', fixed, list)
    });

    const fav = localStorage.getItem('favorites');
    if(fav) {
      console.log('loaded favorites', fav)
      this.favoritesSubject.next(JSON.parse(fav));
      this.favoritesDishes.subscribe(arr =>localStorage.setItem('favorites', JSON.stringify(arr)));
    }
  }

  setSearch(elem :string) {
     this.search.next(elem); 
  }

  setIngredient(ing :string){ 
    this.ingredients.next(ing); 
  }

  setCuisine(elem: string){ 
    this.cuisine.next(elem); 
  }

  toggleFavorite(id:number) {
    const arr = Array.from(new Set(this.favoritesSubject.getValue()));
    const idx = arr.indexOf(id);
    if(idx === -1) {
      arr.push(id);
     } else {
      arr.splice(idx,1);
     }
     this.favoritesSubject.next(arr);
  }

  getRecipe(id:number){ 
    return this.recipesSubject.getValue().find(r=>r.id===id); 
  }

  generateShoppingList(ids?:number[]){ 
    const all = this.recipesSubject.getValue();
    const sel = ids?.length? ids : this.favoritesSubject.getValue();
    const set = new Set<string>();
    all.forEach(r=>{
      if(sel.includes(r.id)) r.ingredients.forEach(x=>set.add(x));
    });
  }
}