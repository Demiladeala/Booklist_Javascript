// Book Class: Instantiate a book object
class Book {
    constructor( title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: This will handle UI tasks
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.getElementById('book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href='#' class='btn btn-danger btn-sm delete'>X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `text-center alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        // remove alert after 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 
        2500);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

// Store class: this is for the local storage, so your data won't leave the browser
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book,index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Events: This is to show the book in the list
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event to add a book
document.getElementById('book-form').addEventListener('submit', (e) => {
    // prevent default submit
    e.preventDefault();

    // Get values from form
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;

    // Validation
    if(title === '' || author === '' || isbn === ''){
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
        // Instantiate book
    const book = new Book(title, author, isbn);

    // Add book to UI
    UI.addBookToList(book);

    //Add book to local storage
    Store.addBook(book);

    // show success alert
    UI.showAlert('New Book Added', 'success');

    // Clear fields after creating book in UI
    UI.clearFields();
    }
});

// Event to remove a book
document.querySelector('#book-list').addEventListener('click', (e) => {
    //Remove book from UI
    UI.deleteBook(e.target)

    // Remove book from Local Storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // show success alert
    UI.showAlert('Book removed', 'success');
});