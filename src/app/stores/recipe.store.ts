import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Recipe } from '../models/recipe.model';
import { RecipeService } from '../services/recipe-service';

@Injectable({ providedIn: 'root' })
export class RecipeStore {
  recipesSubject = new BehaviorSubject<Recipe[]>([]);
  recipes$ = this.recipesSubject.asObservable();

  search$ = new BehaviorSubject<string>('');
  ingredient$ = new BehaviorSubject<string>('');
  cuisine$ = new BehaviorSubject<string>('');

  favoritesSubject = new BehaviorSubject<number[]>([]);
  favorites$ = this.favoritesSubject.asObservable();

  filtered$ = combineLatest([
    this.recipes$,
    this.search$,
    this.ingredient$,
    this.cuisine$
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

  constructor(private api:RecipeService){
    this.api.fetchAll().subscribe(list=>{
      console.log('fetched recipes', list);
      const fixed = (list.recipes || []).map((r: any)=>({
        ...r,
        ingredients: Array.isArray(r.ingredients)? r.ingredients : [String(r.ingredients||'')],
        images: r.image ? [r.image] : []
      }));
      this.recipesSubject.next(fixed);
      console.log('repisne', fixed, list)
    });

    const fav = localStorage.getItem('favorites');
    if(fav) this.favoritesSubject.next(JSON.parse(fav));
    this.favorites$.subscribe(arr=>localStorage.setItem('favorites', JSON.stringify(arr||[])));
  }

  setSearch(v:string){ this.search$.next(v); }
  setIngredient(v:string){ this.ingredient$.next(v); }
  setCuisine(v:string){ this.cuisine$.next(v); }

  toggleFavorite(id:number) {
    const arr = Array.from(new Set(this.favoritesSubject.getValue()));
    const idx = arr.indexOf(id);
    if(idx===-1) arr.push(id); else arr.splice(idx,1);
    this.favoritesSubject.next(arr);
    // const arr = [...new Set(this.favoritesSubject.getValue())];
    // const idx = arr.indexOf(id);
    // if(idx === -1) {
    //     arr.push(id); 
    // } else {
    //     arr.splice(idx,1);
    //     this.favoritesSubject.next(arr);
    // }
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