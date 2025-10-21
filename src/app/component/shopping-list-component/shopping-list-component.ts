import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RecipeStore } from '../../stores/recipe.store';

@Component({
  selector: 'app-shopping-list-component',
  imports: [CommonModule],
  templateUrl: './shopping-list-component.html',
  styleUrl: './shopping-list-component.scss'
})
export class ShoppingListComponent {

  ingredients:any

  constructor(private store:RecipeStore){ 
    this.ingredients=this.store.generateShoppingList(); 
  }

  clear() { 
    this.ingredients=[]; 
  }

  export() { 
    navigator.clipboard?.writeText(this.ingredients.join('\n')).then(()=>alert('Copied')) 
  }

}
