class Book {
    constructor(title, author) {
        this.title = title;
        this.author = author;
        this.isBorrowed = false;
        this.borrowedBy = null;
    }
}

class Member {
    constructor(name) {
        this.name = name;
        this.borrowedBooks = [];
    }

    borrowBook(book) {
        if (!book.isBorrowed) {
            book.isBorrowed = true;
            book.borrowedBy = this.name;
            this.borrowedBooks.push(book);
            return true;
        }
        return false;
    }

    returnBook(book) {
        const index = this.borrowedBooks.indexOf(book);
        if (index !== -1) {
            book.isBorrowed = false;
            book.borrowedBy = null;
            this.borrowedBooks.splice(index, 1);
            return true;
        }
        return false;
    }
}

class Library {
    constructor() {
        this.books = [];
        this.members = [];
    }

    addBook(title, author) {
        const newBook = new Book(title, author);
        this.books.push(newBook);
    }

    registerMember(name) {
        const newMember = new Member(name);
        this.members.push(newMember);
    }

    listAvailableBooks() {
        return this.books.filter(book => !book.isBorrowed);
    }

    listBorrowedBooks() {
        return this.books.filter(book => book.isBorrowed);
    }

    findBookByTitle(title) {
        return this.books.find(book => book.title === title);
    }

    borrowBook(memberName, bookTitle) {
        const member = this.members.find(m => m.name === memberName);
        const book = this.findBookByTitle(bookTitle);

        if (member && book) {
            return member.borrowBook(book);
        }
        return false;
    }

    returnBook(memberName, bookTitle) {
        const member = this.members.find(m => m.name === memberName);
        const book = this.findBookByTitle(bookTitle);

        if (member && book) {
            return member.returnBook(book);
        }
        return false;
    }
}

const library = new Library();

function addBook() {
    const title = document.getElementById('bookTitle').value;
    const author = document.getElementById('bookAuthor').value;

    if (title && author) {
        library.addBook(title, author);
        document.getElementById('bookTitle').value = '';
        document.getElementById('bookAuthor').value = '';
        displayAvailableBooks();
    }
}

function registerMember() {
    const name = document.getElementById('memberName').value;

    if (name) {
        library.registerMember(name);
        document.getElementById('memberName').value = '';
        displayMembers(); // Update member display
    }
}

function borrowBook() {
    const memberName = document.getElementById('borrowMember').value;
    const bookTitle = document.getElementById('borrowBookTitle').value;

    if (library.borrowBook(memberName, bookTitle)) {
        document.getElementById('borrowMember').value = '';
        document.getElementById('borrowBookTitle').value = '';
        displayAvailableBooks();
        displayBorrowedBooks();
        displayMembers(); // Update member display
    } else {
        alert("Failed to borrow book. Check member name or book availability.");
    }
}

function returnBook() {
    const memberName = document.getElementById('returnMember').value;
    const bookTitle = document.getElementById('returnBookTitle').value;

    if (library.returnBook(memberName, bookTitle)) {
        document.getElementById('returnMember').value = '';
        document.getElementById('returnBookTitle').value = '';
        displayAvailableBooks();
        displayBorrowedBooks();
        displayMembers(); // Update member display
    } else {
        alert("Failed to return book. Check member name or book title.");
    }
}

function displayAvailableBooks() {
    const availableBooksList = document.getElementById('availableBooks');
    availableBooksList.innerHTML = '';

    const availableBooks = library.listAvailableBooks();
    availableBooks.forEach(book => {
        const li = document.createElement('li');
        li.textContent = `"${book.title}" by ${book.author}`;
        availableBooksList.appendChild(li);
    });
}

function displayBorrowedBooks() {
    const borrowedBooksList = document.getElementById('borrowedBooks');
    borrowedBooksList.innerHTML = '';

    const borrowedBooks = library.listBorrowedBooks();
    borrowedBooks.forEach(book => {
        const li = document.createElement('li');
        li.textContent = `"${book.title}" by ${book.author} (Borrowed by: ${book.borrowedBy})`;
        borrowedBooksList.appendChild(li);
    });
}

function displayMembers() {
    const membersList = document.getElementById('membersList');
    membersList.innerHTML = '';

    library.members.forEach(member => {
        const li = document.createElement('li');
        li.textContent = member.name;

        // Display borrowed books for each member
        if (member.borrowedBooks.length > 0) {
            const borrowedBooks = member.borrowedBooks.map(book => `"${book.title}" by ${book.author}`).join(', ');
            li.textContent += ` (Borrowed: ${borrowedBooks})`;
        } else {
            li.textContent += ' (No borrowed books)';
        }

        membersList.appendChild(li);
    });
}
