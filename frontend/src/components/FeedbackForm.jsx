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
    <section class="section section-divider white blog" id="blog">
    <div class="container">
     
          <h2  className="h2 section-title">Feedback <span className="span">Form</span>  </h2>
  
      <form  className="login-form" onSubmit={handleSubmit}>
      <div className="input-wrapper">
        <label htmlFor="rating">Rating:</label>
        <input
          type="number"
          id="rating"
          min="1"
          max="5"
          value={rating}
          onChange={handleRatingChange}
          required
          placeholder='rating'
          className="input-field"
        />
</div>
<div className="input-wrapper">
        <label htmlFor="comment">Comment:</label>
        <textarea
          id="comment"
          value={comment}
          onChange={handleCommentChange}
          required
          placeholder='comment'
          className="input-field"
        ></textarea>
</div>
        <button type="submit" className='btn' style={{margin:'auto',textAlign:'center'}}>Submit Feedback</button>
      </form>
    </div> </section>
  );
};

export default FeedbackForm;
