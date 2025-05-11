import React from 'react';
import { RecipeReview } from '../../types/Recipe';
import { Star, ThumbsUp } from 'lucide-react';

interface ReviewListProps {
  reviews: RecipeReview[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-6 text-neutral-500">
        <p>No reviews yet. Be the first to review this recipe!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-neutral-200 pb-6 last:border-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 font-medium">
                {review.username.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <div className="font-medium">{review.username}</div>
                <div className="text-neutral-500 text-sm">{review.date}</div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={
                      review.rating >= star
                        ? 'text-yellow-400 fill-current'
                        : 'text-neutral-300'
                    }
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-neutral-700">{review.comment}</p>
          </div>
          <div className="mt-3 flex items-center text-sm text-neutral-500">
            <button className="flex items-center hover:text-neutral-700">
              <ThumbsUp size={14} className="mr-1" />
              Helpful
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
