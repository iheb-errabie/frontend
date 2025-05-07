import React, { useState } from 'react';
import { addReview } from '../../api';

const AddReview = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addReview(productId, { rating, comment });
      alert('Review added successfully!');
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Failed to add review:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Add Review</h1>
      <label>
        Rating:
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          min="1"
          max="5"
          required
        />
      </label>
      <label>
        Comment:
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default AddReview;