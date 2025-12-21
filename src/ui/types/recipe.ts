// Recipe-related TypeScript interfaces and types

export interface Recipe {
  id: number;
  name: string;
  servings: number;
  time_needed: number;
  user_id: number;
  created_at: string;
}

export interface RecipeIngredient {
  id: number;
  recipe_id: number;
  ingredient_id: number;
  quantity: string;
  ingredient_name?: string;
  ingredient_unit?: string;
}

export interface RecipeInstruction {
  id: number;
  recipe_id: number;
  step_number: number;
  instruction: string;
}

export interface FullRecipe extends Recipe {
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
}

export interface RecipeInput {
  name: string;
  servings: number;
  timeNeeded: number;
  ingredients: Array<{ ingredientId: number; quantity: string }>;
  instructions: string[];
}

export interface RecipeFormData {
  name: string;
  servings: string;
  timeNeeded: string;
  ingredients: Array<{
    ingredientId: number;
    quantity: string;
    ingredientName?: string;
  }>;
  instructions: string[];
}

export interface Ingredient {
  id: number;
  name: string;
  unit: string;
  user_id: number;
  created_at: string;
}
