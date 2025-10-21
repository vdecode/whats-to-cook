import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeStore } from '../../stores/recipe.store';
import { Recipe } from '../../models/recipe.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipe-detail-component',
  imports: [CommonModule],
  templateUrl: './recipe-detail-component.html',
  styleUrl: './recipe-detail-component.scss'
})
export class RecipeDetailComponent implements OnInit {
  recipe?: Recipe;

  constructor(private store: RecipeStore, private route: ActivatedRoute){}

  ngOnInit(){
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.recipe = this.store.getRecipe(id);
  }

}
