import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search as SearchIcon } from 'lucide-react';
import { searchRecipes } from '../api/recipeApi';
import { Recipe } from '../types/Recipe';
import RecipeCard from '../components/recipes/RecipeCard';

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Search params
  const query = searchParams.get('q') || '';
  const cuisineFilter = searchParams.get('cuisine') || '';
  const dietFilter = searchParams.get('diet') || '';
  const timeFilter = searchParams.get('time') ? parseInt(searchParams.get('time') || '0') : 0;
  
  const [searchQuery, setSearchQuery] = useState(query);
  const [selectedCuisine, setSelectedCuisine] = useState(cuisineFilter);
  const [selectedDiet, setSelectedDiet] = useState(dietFilter);
  const [maxTime, setMaxTime] = useState(timeFilter);

  const cuisines = [
    'All', 'American', 'Italian', 'Mexican', 'Chinese', 'Indian', 
    'Japanese', 'Thai', 'Mediterranean', 'French', 'Spanish'
  ];
  
  const dietaryOptions = [
    'All', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'
  ];

  useEffect(() => {
    const loadRecipes = async () => {
      setLoading(true);
      
      try {
        // Build filters object
        const filters: {
          cuisine?: string;
          diet?: string;
          time?: number;
        } = {};
        
        if (cuisineFilter && cuisineFilter !== 'All') {
          filters.cuisine = cuisineFilter;
        }
        
        if (dietFilter && dietFilter !== 'All') {
          filters.diet = dietFilter;
        }
        
        if (timeFilter > 0) {
          filters.time = timeFilter;
        }
        
        const results = await searchRecipes(query, filters);
        setRecipes(results);
      } catch (error) {
        console.error('Error searching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, [query, cuisineFilter, dietFilter, timeFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update URL search params
    const newParams = new URLSearchParams(searchParams);
    
    if (searchQuery) {
      newParams.set('q', searchQuery);
    } else {
      newParams.delete('q');
    }
    
    setSearchParams(newParams);
  };

  const applyFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    
    if (selectedCuisine && selectedCuisine !== 'All') {
      newParams.set('cuisine', selectedCuisine);
    } else {
      newParams.delete('cuisine');
    }
    
    if (selectedDiet && selectedDiet !== 'All') {
      newParams.set('diet', selectedDiet);
    } else {
      newParams.delete('diet');
    }
    
    if (maxTime > 0) {
      newParams.set('time', maxTime.toString());
    } else {
      newParams.delete('time');
    }
    
    setSearchParams(newParams);
    
    // Close filter on mobile
    if (window.innerWidth < 768) {
      setShowFilters(false);
    }
  };

  const clearFilters = () => {
    setSelectedCuisine('');
    setSelectedDiet('');
    setMaxTime(0);
    
    const newParams = new URLSearchParams();
    if (query) {
      newParams.set('q', query);
    }
    
    setSearchParams(newParams);
    
    // Close filter on mobile
    if (window.innerWidth < 768) {
      setShowFilters(false);
    }
  };

  return (
    <div className="container-custom">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters - Desktop */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Filters</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Cuisine</h3>
                <div className="space-y-2">
                  {cuisines.map(cuisine => (
                    <label key={cuisine} className="flex items-center">
                      <input
                        type="radio"
                        name="cuisine"
                        checked={selectedCuisine === cuisine || (cuisine === 'All' && !selectedCuisine)}
                        onChange={() => setSelectedCuisine(cuisine === 'All' ? '' : cuisine)}
                        className="mr-2"
                      />
                      <span>{cuisine}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Dietary Preferences</h3>
                <div className="space-y-2">
                  {dietaryOptions.map(diet => (
                    <label key={diet} className="flex items-center">
                      <input
                        type="radio"
                        name="diet"
                        checked={selectedDiet === diet || (diet === 'All' && !selectedDiet)}
                        onChange={() => setSelectedDiet(diet === 'All' ? '' : diet)}
                        className="mr-2"
                      />
                      <span>{diet}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Total Time</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="time"
                      checked={maxTime === 0}
                      onChange={() => setMaxTime(0)}
                      className="mr-2"
                    />
                    <span>Any time</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="time"
                      checked={maxTime === 30}
                      onChange={() => setMaxTime(30)}
                      className="mr-2"
                    />
                    <span>30 minutes or less</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="time"
                      checked={maxTime === 60}
                      onChange={() => setMaxTime(60)}
                      className="mr-2"
                    />
                    <span>1 hour or less</span>
                  </label>
                </div>
              </div>
              
              <div className="pt-4 space-y-3">
                <button 
                  onClick={applyFilters}
                  className="w-full btn btn-primary"
                >
                  Apply Filters
                </button>
                <button 
                  onClick={clearFilters}
                  className="w-full btn btn-outline"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-grow">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold">
              {query ? `Search Results for "${query}"` : 'All Recipes'}
            </h1>
            
            {/* Mobile filter toggle */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center md:hidden btn btn-outline"
            >
              <Filter size={18} className="mr-2" />
              Filters
            </button>
          </div>
          
          {/* Mobile Filters */}
          {showFilters && (
            <div className="md:hidden bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-6">Filters</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Cuisine</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {cuisines.map(cuisine => (
                      <label key={cuisine} className="flex items-center">
                        <input
                          type="radio"
                          name="cuisine"
                          checked={selectedCuisine === cuisine || (cuisine === 'All' && !selectedCuisine)}
                          onChange={() => setSelectedCuisine(cuisine === 'All' ? '' : cuisine)}
                          className="mr-2"
                        />
                        <span>{cuisine}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Dietary Preferences</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {dietaryOptions.map(diet => (
                      <label key={diet} className="flex items-center">
                        <input
                          type="radio"
                          name="diet"
                          checked={selectedDiet === diet || (diet === 'All' && !selectedDiet)}
                          onChange={() => setSelectedDiet(diet === 'All' ? '' : diet)}
                          className="mr-2"
                        />
                        <span>{diet}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Total Time</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="time"
                        checked={maxTime === 0}
                        onChange={() => setMaxTime(0)}
                        className="mr-2"
                      />
                      <span>Any time</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="time"
                        checked={maxTime === 30}
                        onChange={() => setMaxTime(30)}
                        className="mr-2"
                      />
                      <span>30 minutes or less</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="time"
                        checked={maxTime === 60}
                        onChange={() => setMaxTime(60)}
                        className="mr-2"
                      />
                      <span>1 hour or less</span>
                    </label>
                  </div>
                </div>
                
                <div className="pt-4 flex space-x-3">
                  <button 
                    onClick={applyFilters}
                    className="flex-1 btn btn-primary"
                  >
                    Apply
                  </button>
                  <button 
                    onClick={clearFilters}
                    className="flex-1 btn btn-outline"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Search box */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="flex w-full">
              <input
                type="text"
                placeholder="Search for recipes or ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input rounded-r-none flex-grow"
              />
              <button
                type="submit"
                className="btn btn-primary rounded-l-none px-6"
              >
                <SearchIcon size={18} />
              </button>
            </form>
          </div>
          
          {/* Results */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : recipes.length > 0 ? (
            <>
              <p className="mb-6 text-neutral-600">
                {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} found
              </p>
              <div className="recipe-grid">
                {recipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h2 className="text-xl font-semibold mb-4">No Recipes Found</h2>
              <p className="text-neutral-600 mb-6">
                We couldn't find any recipes matching your search criteria. Try adjusting your filters or search terms.
              </p>
              <button
                onClick={clearFilters}
                className="btn btn-primary"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
