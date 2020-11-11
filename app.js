const tableEl = document.querySelector('tbody');
const loadBooksBtn = document.getElementById('loadBooks');
const baseUrl = 'https://collections-e1e12.firebaseio.com';
const submitBtn = document.getElementById('submit-button');
const editBtn = document.getElementById('edit-button');
const editForm = document.querySelector('form.edit-form');
const editTitleEl = document.getElementById('edit-title');
const editAuthorEl = document.getElementById('edit-author');
const editIsbnEl = document.getElementById('edit-isbn');

tableEl.innerHTML = '';
let selectedBookId = '';

loadBooksBtn.addEventListener('click', listAllBooks);
submitBtn.addEventListener('click', submit);
editBtn.addEventListener('click', submitEdit);

const createRow = ([id, { title, author, isbn }]) => `
    <tr id="${id}">
        <td class="book-title">${title}</td>
        <td class="book-author">${author}</td>
        <td class="book-isbn">${isbn}</td>
        <td>
            <button data-key="${id}" class="edit-book" onclick="editBook(event)">Edit</button>
            <button data-key="${id}" class="delete-book" onclick="deleteBook(event)">Delete</button>
        </td>
    </tr>
`;

function listAllBooks() {
    const url = baseUrl + '/books.json';
    fetch(url)
        .then(res => res.json())
        .then(allBooks => {
            tableEl.innerHTML = '';
            Object.entries(allBooks).forEach(book => {
                let newBook = createRow(book);
                tableEl.innerHTML += newBook;
            });
        })
}

listAllBooks();

function submit(e) {
    e.preventDefault();
    const titleEl = document.getElementById('title');
    const authorEl = document.getElementById('author');
    const isbnEl = document.getElementById('isbn');
    const newBook = {
        title: titleEl.value,
        author: authorEl.value,
        isbn: isbnEl.value,
    }
    const submitUrl = baseUrl + '/books.json';
    fetch(submitUrl, {
        method: "POST",
        body: JSON.stringify(newBook)
    })
        .then(res => res.json())
        .then(newEntry => createRow([newEntry.name, newBook]))
        .then(newBook => tableEl.innerHTML += newBook)
        .catch(err => console.log(err.message));

    titleEl.value = '';
    authorEl.value = '';
    isbnEl.value = '';

}

function editBook(e) {
    const currBookId = e.target.getAttribute('data-key');
    const selectedBookUrl = `${baseUrl}/books/${currBookId}.json`;

    fetch(selectedBookUrl)
        .then(res => res.json())
        .then(({ title, author, isbn }) => [editTitleEl.value, editAuthorEl.value, editIsbnEl.value] = [title, author, isbn])
        .catch(err => console.log(err.message))

    editBtn.setAttribute('data-key', currBookId);
    editForm.style.display = 'block';

}

function deleteBook(e) {
    const currBookId = e.target.getAttribute('data-key');
    const selectedBookUrl = `${baseUrl}/books/${currBookId}.json`;

    fetch(selectedBookUrl, { method: "DELETE" })
        .then(e.target.parentElement.parentElement.remove())
        .catch(err => console.log(err.message));
}

function submitEdit(e) {
    e.preventDefault();
    const currBookId = e.target.getAttribute('data-key');
    const bookToEditUrl = `${baseUrl}/books/${currBookId}.json`;

    const editedBook = {
        title: editTitleEl.value,
        author: editAuthorEl.value,
        isbn: editIsbnEl.value,
    }

    fetch(bookToEditUrl, {
        method: "PUT",
        body: JSON.stringify(editedBook)
    })
        .then(res => res.json())
        .then(({ title, author, isbn }) => {
            const bookToUpdate = tableEl.querySelector(`tr[id="${currBookId}"]`);
            bookToUpdate.innerHTML = createRow([currBookId, {title, author, isbn}]);
        })
        .catch(err => console.log(err.message))
    editForm.style.display = 'none';
}