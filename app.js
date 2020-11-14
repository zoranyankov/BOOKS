const tableEl = document.querySelector('tbody');
const loadBooksBtn = document.getElementById('loadBooks');
const baseUrl = 'https://collections-e1e12.firebaseio.com';
const submitBtn = document.getElementById('submit-button');
const editBtn = document.getElementById('edit-button');
const deleteBtn = document.getElementById('delete-button');
const addForm = document.querySelector('form.add-form');
const editForm = document.querySelector('form.edit-form');
const deleteForm = document.querySelector('form.delete-form');
const editTitleEl = document.getElementById('edit-title');
const editAuthorEl = document.getElementById('edit-author');
const editIsbnEl = document.getElementById('edit-isbn');
const deleteTitleEl = document.getElementById('delete-title');
const deleteAuthorEl = document.getElementById('delete-author');
const deleteIsbnEl = document.getElementById('delete-isbn');

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
            <button data-key="${id}" class="delete-book" onclick="showDeleteForm(event)">Delete</button>
        </td>
    </tr>
`;

function showAddForm(e) {
    e.preventDefault();
    editForm.style.display = 'none';
    addForm.style.display = 'block';
}

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
    addForm.style.display = 'none';
    editForm.style.display = 'block';

}

function showDeleteForm(e) {
    const currBookId = e.target.getAttribute('data-key');
    const selectedBookUrl = `${baseUrl}/books/${currBookId}.json`;

    fetch(selectedBookUrl)
        .then(res => res.json())
        .then(({ title, author, isbn }) => {
            deleteBtn.setAttribute('data-key', currBookId);
            addForm.style.display = 'none';
            deleteForm.style.display = 'block';
            [deleteTitleEl.value, deleteAuthorEl.value, deleteIsbnEl.value] = [title, author, isbn];
        })
        .catch(err => console.log(err.message))
}

function deleteCurrBook(e) {
    e.preventDefault();

    const currBookId = e.target.getAttribute('data-key');
    const selectedBookUrl = `${baseUrl}/books/${currBookId}.json`;

    fetch(selectedBookUrl, { method: "DELETE" })
        .then(() => {
            deleteForm.style.display = 'none';
            addForm.style.display = 'block';
            document.getElementById(`${currBookId}`).remove();
        })
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
            bookToUpdate.innerHTML = createRow([currBookId, { title, author, isbn }]);
        })
        .catch(err => console.log(err.message))
    editForm.style.display = 'none';
    addForm.style.display = 'block';
}