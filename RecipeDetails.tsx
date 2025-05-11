import React, { useState } from 'react';
import { Clock, Users, ChefHat, Star, Award, BookmarkPlus, Share2, Heart } from 'lucide-react';
import { RecipeDetails } from '../../types/Recipe';
import { useAuth } from '../../contexts/AuthContext';
import { saveRecipe, rateRecipe } from '../../api/recipeApi';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

interface RecipeDetailProps {
  recipe: RecipeDetails;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe }) => {
  const { isAuthenticated } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions' | 'reviews'>('ingredients');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const totalTime = recipe.prepTime + recipe.cookTime;

  const handleSave = async () => {
    if (!isAuthenticated) {
      alert('Please login to save recipes');
      return;
    }
    
    try {
      await saveRecipe(recipe.id);
      setIsSaved(true);
      setTimeout(() => {
        alert('Recipe saved to your collection!');
      }, 300);
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  const handleLike = () => {
    if (!isAuthenticated) {
      alert('Please login to like recipes');
      return;
    }
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const handleSubmitReview = async (rating: number, comment: string) => {
    try {
      await rateRecipe(recipe.id, rating, comment);
      setShowReviewForm(false);
      alert('Your review has been submitted!');
      // In a real app, we would refresh the recipe data here
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div className="container-custom">
      {/* Hero section */}
      <div className="relative mb-8">
        <div className="h-72 md:h-96 rounded-lg overflow-hidden">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 mx-4 md:mx-auto -mt-20 relative max-w-4xl">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{recipe.title}</h1>
              <p className="text-neutral-600 mt-2">{recipe.cuisine} Cuisine</p>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center mb-2">
                <Star size={20} className="text-yellow-400 mr-1" />
                <span className="font-bold text-lg">{recipe.rating.toFixed(1)}</span>
                <span className="text-neutral-500 ml-1">({recipe.reviewCount})</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleLike}
                  className={`p-2 rounded-full ${isLiked ? 'bg-red-50 text-red-500' : 'bg-neutral-100 text-neutral-600'}`}
                >
                  <Heart size={18} className={isLiked ? 'fill-current' : ''} />
                </button>
                <button
                  onClick={handleSave}
                  className={`p-2 rounded-full ${isSaved ? 'bg-primary-50 text-primary-500' : 'bg-neutral-100 text-neutral-600'}`}
                >
                  <BookmarkPlus size={18} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full bg-neutral-100 text-neutral-600"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-4">
            {recipe.dietaryInfo.map((info, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-neutral-100 text-neutral-700 text-sm font-medium rounded-full"
              >
                {info}
              </span>
            ))}
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6 text-center">
            <div className="bg-neutral-50 rounded-lg p-3">
              <Clock size={20} className="mx-auto mb-1 text-primary-500" />
              <span className="block text-sm text-neutral-500">Total Time</span>
              <span className="block font-semibold">{totalTime} min</span>
            </div>
            <div className="bg-neutral-50 rounded-lg p-3">
              <Users size={20} className="mx-auto mb-1 text-primary-500" />
              <span className="block text-sm text-neutral-500">Servings</span>
              <span className="block font-semibold">{recipe.servings}</span>
            </div>
            <div className="bg-neutral-50 rounded-lg p-3">
              <ChefHat size={20} className="mx-auto mb-1 text-primary-500" />
              <span className="block text-sm text-neutral-500">Difficulty</span>
              <span className="block font-semibold">{recipe.difficulty}</span>
            </div>
          </div>
          
          <div className="mt-6">
            <p className="text-neutral-700 leading-relaxed">{recipe.description}</p>
          </div>
        </div>
      </div>
      
      {/* Recipe content */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 font-medium text-center ${
                activeTab === 'ingredients' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-neutral-600'
              }`}
              onClick={() => setActiveTab('ingredients')}
            >
              Ingredients
            </button>
            <button
              className={`flex-1 py-4 font-medium text-center ${
                activeTab === 'instructions' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-neutral-600'
              }`}
              onClick={() => setActiveTab('instructions')}
            >
              Instructions
            </button>
            <button
              className={`flex-1 py-4 font-medium text-center ${
                activeTab === 'reviews' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-neutral-600'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({recipe.reviews.length})
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === 'ingredients' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Ingredients</h2>
                <p className="text-neutral-600 text-sm">For {recipe.servings} servings</p>
                <ul className="space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-primary-500 mt-2 mr-3"></span>
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {activeTab === 'instructions' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Instructions</h2>
                <ol className="space-y-6">
                  {recipe.instructions.map((step, index) => (
                    <li key={index} className="flex">
                      <div className="flex-shrink-0 mr-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600 font-semibold">
                          {index + 1}
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="text-neutral-800">{step}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Reviews</h2>
                  {isAuthenticated && !showReviewForm && (
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="btn btn-primary"
                    >
                      Write a Review
                    </button>
                  )}
                </div>
                
                {showReviewForm && (
                  <ReviewForm onSubmit={handleSubmitReview} onCancel={() => setShowReviewForm(false)} />
                )}
                
                <ReviewList reviews={recipe.reviews} />
                
                {!isAuthenticated && (
                  <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 text-center">
                    <p className="text-neutral-600 mb-2">Sign in to leave a review</p>
                    <a href="/login" className="text-primary-600 font-medium hover:underline">
                      Login now
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
