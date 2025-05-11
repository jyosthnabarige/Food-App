import React, { useState } from 'react';
import { ChefHat, Plus, X } from 'lucide-react';
import { RecipeSubmission } from '../../types/Recipe';

interface RecipeFormProps {
  onSubmit: (recipe: RecipeSubmission) => Promise<void>;
  isLoading: boolean;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<RecipeSubmission>({
    title: '',
    description: '',
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    difficulty: 'Medium',
    ingredients: [''],
    instructions: [''],
    cuisine: '',
    dietaryInfo: [],
    imageUrl: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const cuisines = [
    'American', 'Italian', 'Mexican', 'Chinese', 'Indian', 'Japanese', 
    'Thai', 'Mediterranean', 'French', 'Spanish', 'Middle Eastern', 
    'Greek', 'Korean', 'Vietnamese', 'Brazilian', 'Other'
  ];

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 
    'Nut-Free', 'Low-Carb', 'Keto', 'Paleo', 'Whole30'
  ];

  const difficultyLevels = ['Easy', 'Medium', 'Hard'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setFormData({ ...formData, [name]: numValue });
      
      // Clear error for this field if it exists
      if (errors[name]) {
        setErrors({ ...errors, [name]: '' });
      }
    }
  };

  const handleDietaryChange = (diet: string) => {
    const updatedDietary = formData.dietaryInfo.includes(diet)
      ? formData.dietaryInfo.filter(item => item !== diet)
      : [...formData.dietaryInfo, diet];
    
    setFormData({ ...formData, dietaryInfo: updatedDietary });
  };

  const handleIngredientChange = (index: number, value: string) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index] = value;
    setFormData({ ...formData, ingredients: updatedIngredients });
  };

  const handleInstructionChange = (index: number, value: string) => {
    const updatedInstructions = [...formData.instructions];
    updatedInstructions[index] = value;
    setFormData({ ...formData, instructions: updatedInstructions });
  };

  const addIngredient = () => {
    setFormData({ ...formData, ingredients: [...formData.ingredients, ''] });
  };

  const removeIngredient = (index: number) => {
    if (formData.ingredients.length > 1) {
      const updatedIngredients = [...formData.ingredients];
      updatedIngredients.splice(index, 1);
      setFormData({ ...formData, ingredients: updatedIngredients });
    }
  };

  const addInstruction = () => {
    setFormData({ ...formData, instructions: [...formData.instructions, ''] });
  };

  const removeInstruction = (index: number) => {
    if (formData.instructions.length > 1) {
      const updatedInstructions = [...formData.instructions];
      updatedInstructions.splice(index, 1);
      setFormData({ ...formData, instructions: updatedInstructions });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.cuisine) {
      newErrors.cuisine = 'Cuisine is required';
    }
    
    if (formData.ingredients.some(i => !i.trim())) {
      newErrors.ingredients = 'All ingredients must be filled';
    }
    
    if (formData.instructions.some(i => !i.trim())) {
      newErrors.instructions = 'All instructions must be filled';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Filter out any empty ingredients or instructions
    const cleanedFormData = {
      ...formData,
      ingredients: formData.ingredients.filter(i => i.trim()),
      instructions: formData.instructions.filter(i => i.trim()),
    };
    
    await onSubmit(cleanedFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <ChefHat size={24} className="text-primary-500 mr-2" />
          <h2 className="text-2xl font-semibold">Recipe Details</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
              Recipe Title*
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="E.g., Homemade Margherita Pizza"
              className={`input ${errors.title ? 'border-red-500' : ''}`}
              maxLength={100}
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
              Description*
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your recipe..."
              rows={3}
              className={`input resize-none ${errors.description ? 'border-red-500' : ''}`}
            />
            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
          </div>
          
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-neutral-700 mb-1">
              Image URL (Optional)
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="input"
            />
            <p className="mt-1 text-xs text-neutral-500">
              Enter a URL for your recipe image. If left blank, a default image will be used.
            </p>
          </div>
          
          <div>
            <label htmlFor="cuisine" className="block text-sm font-medium text-neutral-700 mb-1">
              Cuisine*
            </label>
            <select
              id="cuisine"
              name="cuisine"
              value={formData.cuisine}
              onChange={handleChange}
              className={`input ${errors.cuisine ? 'border-red-500' : ''}`}
            >
              <option value="">Select Cuisine</option>
              {cuisines.map(cuisine => (
                <option key={cuisine} value={cuisine}>
                  {cuisine}
                </option>
              ))}
            </select>
            {errors.cuisine && <p className="mt-1 text-sm text-red-500">{errors.cuisine}</p>}
          </div>
          
          <div>
            <label htmlFor="prepTime" className="block text-sm font-medium text-neutral-700 mb-1">
              Prep Time (minutes)
            </label>
            <input
              type="number"
              id="prepTime"
              name="prepTime"
              value={formData.prepTime}
              onChange={handleNumberChange}
              min={0}
              className="input"
            />
          </div>
          
          <div>
            <label htmlFor="cookTime" className="block text-sm font-medium text-neutral-700 mb-1">
              Cook Time (minutes)
            </label>
            <input
              type="number"
              id="cookTime"
              name="cookTime"
              value={formData.cookTime}
              onChange={handleNumberChange}
              min={0}
              className="input"
            />
          </div>
          
          <div>
            <label htmlFor="servings" className="block text-sm font-medium text-neutral-700 mb-1">
              Servings
            </label>
            <input
              type="number"
              id="servings"
              name="servings"
              value={formData.servings}
              onChange={handleNumberChange}
              min={1}
              className="input"
            />
          </div>
          
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-neutral-700 mb-1">
              Difficulty
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="input"
            >
              {difficultyLevels.map(level => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Dietary Information
            </label>
            <div className="flex flex-wrap gap-3">
              {dietaryOptions.map(diet => (
                <label key={diet} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.dietaryInfo.includes(diet)}
                    onChange={() => handleDietaryChange(diet)}
                    className="sr-only"
                  />
                  <div
                    className={`px-3 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                      formData.dietaryInfo.includes(diet)
                        ? 'bg-primary-100 text-primary-700 border border-primary-300'
                        : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                    }`}
                  >
                    {diet}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Ingredients</h2>
        
        {formData.ingredients.map((ingredient, index) => (
          <div key={index} className="flex items-center mb-3">
            <input
              type="text"
              value={ingredient}
              onChange={(e) => handleIngredientChange(index, e.target.value)}
              placeholder={`Ingredient ${index + 1} (e.g., 2 cups flour)`}
              className={`input ${errors.ingredients ? 'border-red-500' : ''}`}
            />
            <button
              type="button"
              onClick={() => removeIngredient(index)}
              className="ml-2 p-2 text-neutral-500 hover:text-neutral-700"
              disabled={formData.ingredients.length <= 1}
            >
              <X size={18} />
            </button>
          </div>
        ))}
        
        {errors.ingredients && (
          <p className="mt-1 mb-3 text-sm text-red-500">{errors.ingredients}</p>
        )}
        
        <button
          type="button"
          onClick={addIngredient}
          className="flex items-center text-primary-600 hover:text-primary-700"
        >
          <Plus size={18} className="mr-1" />
          Add Ingredient
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Instructions</h2>
        
        {formData.instructions.map((instruction, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-start mb-2">
              <div className="flex-shrink-0 mr-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-600 font-medium text-sm">
                  {index + 1}
                </div>
              </div>
              <div className="flex-grow">
                <textarea
                  value={instruction}
                  onChange={(e) => handleInstructionChange(index, e.target.value)}
                  placeholder={`Step ${index + 1}`}
                  rows={2}
                  className={`input resize-none ${errors.instructions ? 'border-red-500' : ''}`}
                />
              </div>
              <button
                type="button"
                onClick={() => removeInstruction(index)}
                className="ml-2 p-2 text-neutral-500 hover:text-neutral-700"
                disabled={formData.instructions.length <= 1}
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ))}
        
        {errors.instructions && (
          <p className="mt-1 mb-3 text-sm text-red-500">{errors.instructions}</p>
        )}
        
        <button
          type="button"
          onClick={addInstruction}
          className="flex items-center text-primary-600 hover:text-primary-700"
        >
          <Plus size={18} className="mr-1" />
          Add Step
        </button>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="btn btn-primary px-8 py-3"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit Recipe'}
        </button>
      </div>
    </form>
  );
};

export default RecipeForm;
