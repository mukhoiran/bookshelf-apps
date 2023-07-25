// Load books from localStorage or set to empty array if not found
const books = JSON.parse(localStorage.getItem('books')) || [];

// Function to update localStorage with the current books data
function updateLocalStorage() {
  localStorage.setItem('books', JSON.stringify(books));
}

// Function to render books on the bookshelves
function renderBooks() {
  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
  const completeBookshelfList = document.getElementById('completeBookshelfList');

  incompleteBookshelfList.innerHTML = '';
  completeBookshelfList.innerHTML = '';

  books.forEach(book => {
    const article = document.createElement('article');
    article.classList.add('book_item');

    const titleElement = document.createElement('h3');
    titleElement.textContent = book.title;

    const authorElement = document.createElement('p');
    authorElement.textContent = `Penulis: ${book.author}`;

    const yearElement = document.createElement('p');
    yearElement.textContent = `Tahun: ${book.year}`;

    const actionDiv = document.createElement('div');
    actionDiv.classList.add('action');

    const moveButton = document.createElement('button');
    moveButton.textContent = book.isComplete ? 'Belum selesai di Baca' : 'Selesai dibaca';
    moveButton.classList.add(book.isComplete ? 'green' : 'red');
    moveButton.addEventListener('click', () => {
      book.isComplete = !book.isComplete;
      updateLocalStorage();
      renderBooks();
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Hapus buku';
    deleteButton.classList.add('red');
    deleteButton.addEventListener('click', () => {
      removeBook(book.id);
    });

    actionDiv.appendChild(moveButton);
    actionDiv.appendChild(deleteButton);

    article.appendChild(titleElement);
    article.appendChild(authorElement);
    article.appendChild(yearElement);
    article.appendChild(actionDiv);

    if (book.isComplete) {
      completeBookshelfList.appendChild(article);
    } else {
      incompleteBookshelfList.appendChild(article);
    }
  });
}

// Function to add a new book to the bookshelf
function addBook(title, author, year, isComplete) {
  const newBook = {
    id: +new Date(),
    title,
    author,
    year,
    isComplete,
  };
  books.push(newBook);
  updateLocalStorage();
  renderBooks();
}

// Function to remove a book from the bookshelf
function removeBook(bookId) {
  const confirmation = confirm('Apakah anda yakin untuk menghapus buku ini?');
  if (confirmation) {
    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex !== -1) {
      books.splice(bookIndex, 1);
      updateLocalStorage();
      renderBooks();
    }
  }
}

// Function to handle the form submission for adding a new book
function handleBookSubmit(event) {
  event.preventDefault();
  const title = document.getElementById('inputBookTitle').value;
  const author = document.getElementById('inputBookAuthor').value;
  const year = document.getElementById('inputBookYear').value;
  const isComplete = document.getElementById('inputBookIsComplete').checked;
  addBook(title, author, year, isComplete);
  event.target.reset();
}

// Function to search for books based on the title
function searchBooks(keyword) {
  const filteredBooks = books.filter(book => book.title.toLowerCase().includes(keyword.toLowerCase()));
  const incompleteBooks = filteredBooks.filter(book => !book.isComplete);
  const completeBooks = filteredBooks.filter(book => book.isComplete);

  const result = [...incompleteBooks, ...completeBooks];
  books.splice(0, books.length, ...result);
  renderBooks();
}

// Event listeners for form submission and search
document.getElementById('inputBook').addEventListener('submit', handleBookSubmit);
document.getElementById('searchBook').addEventListener('submit', event => {
  event.preventDefault();
  const searchTitle = document.getElementById('searchBookTitle').value;
  searchBooks(searchTitle);
});

// Render books on page load
document.addEventListener('DOMContentLoaded', () => {
  renderBooks();
});
