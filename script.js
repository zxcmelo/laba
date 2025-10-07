document.addEventListener('DOMContentLoaded', function() {
  const fadeInElements = document.querySelectorAll('.fade-in');
  
  function checkFadeIn() {
    fadeInElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementTop < windowHeight * 0.9) {
        element.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', checkFadeIn);
  window.addEventListener('load', checkFadeIn);

  const addReviewBtn = document.querySelector('#add-review-btn');
  const reviewsContainer = document.querySelector('#reviews-container');
  
  if (addReviewBtn && reviewsContainer) {
    addReviewBtn.addEventListener('click', function() {
      if (!document.querySelector('#review-form')) {
        const reviewForm = document.createElement('div');
        reviewForm.id = 'review-form';
        reviewForm.className = 'col-12 mb-4';
        reviewForm.innerHTML = `
          <div class="card p-4">
            <h3 class="h4 mb-3">Добавить отзыв</h3>
            <div class="mb-3">
              <label for="review-name" class="form-label">Ваше имя:</label>
              <input type="text" class="form-control" id="review-name" required>
            </div>
            <div class="mb-3">
              <label for="review-rating" class="form-label">Оценка:</label>
              <select class="form-select" id="review-rating" required>
                <option value="5">★★★★★</option>
                <option value="4">★★★★☆</option>
                <option value="3">★★★☆☆</option>
                <option value="2">★★☆☆☆</option>
                <option value="1">★☆☆☆☆</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="review-text" class="form-label">Текст отзыва:</label>
              <textarea class="form-control" id="review-text" rows="3" required></textarea>
            </div>
            <button type="button" class="btn btn-primary me-2" id="submit-review">Отправить</button>
            <button type="button" class="btn btn-outline-secondary" id="cancel-review">Отмена</button>
          </div>
        `;
        
        reviewsContainer.prepend(reviewForm);
        
        document.getElementById('submit-review').addEventListener('click', function() {
          const name = document.getElementById('review-name').value;
          const rating = document.getElementById('review-rating').value;
          const text = document.getElementById('review-text').value;
          
          if (!name || !text) {
            alert('Пожалуйста, заполните все поля');
            return;
          }
          
          const stars = '★★★★★☆☆☆☆☆'.slice(5 - rating, 10 - rating);
          
          const newReview = document.createElement('div');
          newReview.className = 'col-md-6';
          newReview.innerHTML = `
            <div class="card review-card">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <div class="fw-bold">${name}</div>
                  <div class="text-muted small">${new Date().toLocaleDateString()}</div>
                </div>
                <div class="rating mb-2">${stars}</div>
                <p class="mb-0">${text}</p>
              </div>
            </div>
          `;
          
          reviewsContainer.prepend(newReview);
          saveReviewToLocalStorage({ name, rating, text, date: new Date().toLocaleDateString() });
          reviewForm.remove();
        });
        
        document.getElementById('cancel-review').addEventListener('click', function() {
          reviewForm.remove();
        });
      }
    });
    
    loadReviewsFromLocalStorage();
  }
  
  const submitContactForm = document.querySelector('#submit-contact-form');
  if (submitContactForm) {
    submitContactForm.addEventListener('click', function() {
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');
      let isValid = true;
      
      if (!nameInput.value.trim()) {
        showError(nameInput, 'Пожалуйста, введите ваше имя');
        isValid = false;
      } else {
        clearError(nameInput);
      }
      
      if (!emailInput.value.trim()) {
        showError(emailInput, 'Пожалуйста, введите email');
        isValid = false;
      } else if (!isValidEmail(emailInput.value)) {
        showError(emailInput, 'Пожалуйста, введите корректный email');
        isValid = false;
      } else {
        clearError(emailInput);
      }
      
      if (!messageInput.value.trim()) {
        showError(messageInput, 'Пожалуйста, введите сообщение');
        isValid = false;
      } else {
        clearError(messageInput);
      }
      
      if (isValid) {
        alert('Форма успешно отправлена!');
        nameInput.value = '';
        emailInput.value = '';
        messageInput.value = '';
      }
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(input, message) {
    const formGroup = input.closest('.mb-3');
    let errorElement = formGroup.querySelector('.error-message');
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message text-danger mt-1 small';
      formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    input.classList.add('is-invalid');
  }

  function clearError(input) {
    const formGroup = input.closest('.mb-3');
    const errorElement = formGroup.querySelector('.error-message');
    
    if (errorElement) {
      errorElement.remove();
    }
    
    input.classList.remove('is-invalid');
  }

  function saveReviewToLocalStorage(review) {
    const reviews = JSON.parse(localStorage.getItem('service-reviews') || '[]');
    reviews.push(review);
    localStorage.setItem('service-reviews', JSON.stringify(reviews));
  }

  function loadReviewsFromLocalStorage() {
    const reviews = JSON.parse(localStorage.getItem('service-reviews') || '[]');
    const reviewsContainer = document.querySelector('#reviews-container');
    
    if (!reviewsContainer) return;
    
    reviews.forEach(review => {
      const stars = '★★★★★☆☆☆☆☆'.slice(5 - review.rating, 10 - review.rating);
      
      const reviewElement = document.createElement('div');
      reviewElement.className = 'col-md-6';
      reviewElement.innerHTML = `
        <div class="card review-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div class="fw-bold">${review.name}</div>
              <div class="text-muted small">${review.date}</div>
            </div>
            <div class="rating mb-2">${stars}</div>
            <p class="mb-0">${review.text}</p>
          </div>
        </div>
      `;
      
      reviewsContainer.appendChild(reviewElement);
    });
  }
});