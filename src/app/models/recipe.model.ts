export interface Recipe {
  id: number;
  name: string;
  cuisine: string;
  ingredients: string[];
  instructions?: string | string[];
  images?: string[];
  image?: string;
}
