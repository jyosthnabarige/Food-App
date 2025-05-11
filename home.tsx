import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Search, Clock, Utensils } from 'lucide-react';
import { getFeaturedRecipes } from '../api/recipeApi';
import { Recipe } from '../types/Recipe';
import RecipeCard from '../components/recipes/RecipeCard';

const Home: React.FC = () => {
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const recipes = await getFeaturedRecipes();
        setFeaturedRecipes(recipes);
      } catch (error) {
        console.error('Error loading featured recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div>
      {/* Hero section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <img
            src="https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg"
            alt="Food background"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6 slide-in">
              Discover, Create & Share Delicious Recipes
            </h1>
            <p className="text-lg sm:text-xl opacity-90 mb-8 slide-in">
              Find inspiration for your next meal with our collection of recipes from around the world.
            </p>
            
            <form onSubmit={handleSearch} className="relative max-w-xl mx-auto slide-in">
              <input
                type="text"
                placeholder="Search for recipes, ingredients, cuisine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-4 pr-12 rounded-lg text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-300 shadow-xl"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-600"
              >
                <Search size={24} />
              </button>
            </form>
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section className="py-12 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 text-primary-600 rounded-full mb-4">
                <Search size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Search by Ingredients</h3>
              <p className="text-neutral-600">
                Find recipes based on ingredients you already have in your kitchen.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 text-primary-600 rounded-full mb-4">
                <Clock size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quick & Easy Meals</h3>
              <p className="text-neutral-600">
                Discover recipes that are perfect for busy weeknights and tight schedules.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 text-primary-600 rounded-full mb-4">
                <Utensils size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Diverse Cuisines</h3>
              <p className="text-neutral-600">
                Explore dishes from different cultures and expand your culinary horizons.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured recipes */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold">Featured Recipes</h2>
            <Link to="/search" className="text-primary-600 font-medium hover:text-primary-700">
              View All
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="recipe-grid">
              {featuredRecipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-12 md:py-16 bg-secondary-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Share Your Culinary Creations
                </h2>
                <p className="text-neutral-600 max-w-2xl">
                  Have a recipe that everyone loves? Join our community and share your culinary masterpieces with food enthusiasts around the world.
                </p>
              </div>
              <Link to="/submit" className="btn btn-primary px-8 py-3 whitespace-nowrap">
                Submit a Recipe
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
