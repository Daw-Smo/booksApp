{
  'use strict';

  class BooksList {
    constructor() {
      this.template = Handlebars.compile(document.querySelector('#template-book').innerHTML);
      this.booksList = document.querySelector('.books-list');
      this.favoriteBooks = [];
      this.filters = [];
      this.initData();
      this.getElements();
      this.render();
    }
  
    initData() {
      this.data = dataSource.books;
    }
  
    getElements() {
      this.form = document.querySelector('.filters');
    }
  
    initActions() {
      this.booksList.addEventListener('dblclick', e => {
        const target = e.target;
        if (target.offsetParent.classList.contains('book__image')) {
          e.preventDefault();
          const bookId = target.offsetParent.getAttribute('data-id');
          if (this.favoriteBooks.includes(bookId)) {
            const bookIndex = this.favoriteBooks.indexOf(bookId);
            this.favoriteBooks.splice(bookIndex, 1);
            target.offsetParent.classList.remove('favorite');
          } else {
            target.offsetParent.classList.add('favorite');
            this.favoriteBooks.push(bookId);
          }
        }
      });
  
      this.form.addEventListener('click', e => {
        const target = e.target;
        if (target.tagName === 'INPUT' && target.type === 'checkbox' && target.name === 'filter') {
          if (target.checked) {
            this.filters.push(target.value);
          } else {
            const index = this.filters.indexOf(target.value);
            if (index >= 0) {
              this.filters.splice(index, 1);
            }
          }
          this.filterBooks();
        }
      });
    }
  
    render() {
      for (let book of this.data) {
        const ratingBgc = this.determineRatingBgc(book.rating);
        const ratingWidth = book.rating * 10;
        const generatedHTML = this.template({ ...book, ratingBgc, ratingWidth });
        const elementDOM = utils.createDOMFromHTML(generatedHTML);
        this.booksList.appendChild(elementDOM);
      }
      this.initActions();
    }
  
    filterBooks() {
      for (let book of this.data) {
        let shouldBeHidden = false;
        for (let filter of this.filters) {
          if (!book.details[filter]) {
            shouldBeHidden = true;
            break;
          }
        }
        const bookImage = this.booksList.querySelector(`.book__image[data-id="${book.id}"]`);
        if (shouldBeHidden) {
          bookImage.classList.add('hidden');
        } else {
          bookImage.classList.remove('hidden');
        }
      }
    }
  
    determineRatingBgc(rating) {
      if (rating < 6) {
        return 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
      } else if (rating >= 6 && rating <= 8) {
        return 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
      } else if (rating > 8 && rating <= 9) {
        return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      } else {
        return 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
      }
    }
  }
  
  const app = new BooksList();
  
}