import React, { useState } from 'react';

const FeedbackForm = ({ onSubmitFeedback }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleRatingChange = (e) => {
    setRating(parseInt(e.target.value));
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const feedback = {
      rating,
      comment,
    };

   alert("Thankyou for your feedback, Eat more")



    // Reset form inputs
    setRating(5);
    setComment('');
  };

  return (
    <div>
      <h2>Feedback</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="rating">Rating:</label>
        <input
          type="number"
          id="rating"
          min="1"
          max="5"
          value={rating}
          onChange={handleRatingChange}
          required
        />

        <label htmlFor="comment">Comment:</label>
        <textarea
          id="comment"
          value={comment}
          onChange={handleCommentChange}
          required
        ></textarea>

        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
};

export default FeedbackForm;
