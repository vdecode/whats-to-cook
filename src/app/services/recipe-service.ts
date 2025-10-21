import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Recipe } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private readonly API = 'https://dummyjson.com/recipes';
  private readonly PLACEHOLDER = 'https://via.placeholder.com/400x250?text=No+Image';

  constructor(private http: HttpClient) {}

  private fixImageUrls(images: any[], fallback?: string): string[] {
    if (!images || !Array.isArray(images) || !images.length) {
      return [fallback || this.PLACEHOLDER];
    }

    return images.map((url: any) => {
      if (typeof url !== 'string' || !url.trim()) {
        return fallback || this.PLACEHOLDER;
      }
      // Force HTTPS if missing
      if (!url.startsWith('http')) {
        return `https://dummyjson.com/${url.replace(/^\/*/, '')}`;
      }
      // Replace invalid localhost or relative
      if (url.includes('localhost') || url.includes('dummyjson')) {
        return url.startsWith('https://') ? url : url.replace('http://', 'https://');
      }
      return url;
    });
  }

  // 
  
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
        images: this.fixImageUrls(r.images || [r.thumbnail], this.PLACEHOLDER),
      }))
    );
  }
}
  

