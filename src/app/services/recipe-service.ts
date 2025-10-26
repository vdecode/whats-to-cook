import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Recipe } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private readonly API = 'https://dummyjson.com/recipes';

  constructor(private http: HttpClient) {}

  fetchAll(): Observable<any> {
    return this.http.get<any>(this.API);
  }

  fetchById(id: number): Observable<Recipe> {
    return this.http.get<any>(`${this.API}/${id}`).pipe(
      map(r => ({
        id: r.id,
        name: r.name || 'Unknown Recipe',
        cuisine: r.cuisine || 'Unknown',
        ingredients: Array.isArray(r.ingredients)
          ? r.ingredients
          : [String(r.ingredients || '')],
        instructions: r.instructions || r.steps || '',
        images: r.images,
      }))
    );
  }
}
  

