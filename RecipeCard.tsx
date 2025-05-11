import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, ChefHat, Star } from 'lucide-react';
import { Recipe } from '../../types/Recipe';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const totalTime = recipe.prepTime + recipe.cookTime;
  
  return (
    <div className="card h-full slide-in">
      <Link to={`/recipe/${recipe.id}`}>
        <div className="relative h-48 overflow-hidden">
          <img 
            src={recipe.imageUrl} 
            alt={recipe.title} 
            className="w-full h-full object-cover transition-transform hover:scale-110 duration-500" 
          />
          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full shadow-md flex items-center">
            <Star size={16} className="text-yellow-400 mr-1" />
            <span className="font-semibold">{recipe.rating.toFixed(1)}</span>
          </div>
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <Link to={`/recipe/${recipe.id}`}>
              <h3 className="font-semibold text-lg hover:text-primary-600 transition-colors">
                {recipe.title}
              </h3>
            </Link>
            <p className="text-sm text-neutral-500 mt-1">{recipe.cuisine} Cuisine</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          {recipe.dietaryInfo.map((info, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-full"
            >
              {info}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between mt-4 text-sm text-neutral-600">
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            <span>{totalTime} min</span>
          </div>
          <div className="flex items-center">
            <Users size={16} className="mr-1" />
            <span>{recipe.servings}</span>
          </div>
          <div className="flex items-center">
            <ChefHat size={16} className="mr-1" />
            <span>{recipe.difficulty}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
