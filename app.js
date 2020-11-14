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
const errEl = document.getElementById('error-message');
const bodyEl = document.getElementsByTagName('body')[0];

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
    deleteForm.style.display = 'none';
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
        .catch(err => eventHandler(err))
    deleteForm.style.display = 'none';
    editForm.style.display = 'none';
    addForm.style.display = 'block';    
}

// listAllBooks();

function submit(e) {
    e.preventDefault();
    const titleEl = document.getElementById('title');
    const authorEl = document.getElementById('author');
    const isbnEl = document.getElementById('isbn');

    if (titleEl.value.length == 0) {
        console.log('in error')
        return eventHandler({ 'message': 'Title must be filled!' });
    }
    if (authorEl.value.length == 0) {
        console.log('in error')
        return eventHandler({ 'message': 'Author must be filled!' });
    }
    if (isbnEl.value.length == 0) {
        console.log('in error')
        return eventHandler({ 'message': 'isbn must be filled!' });
    }

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
        .catch(err => eventHandler(err));

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
        .catch(err => eventHandler(err))

    editBtn.setAttribute('data-key', currBookId);
    deleteForm.style.display = 'none';
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
            editForm.style.display = 'none';
            addForm.style.display = 'none';
            deleteForm.style.display = 'block';
            [deleteTitleEl.value, deleteAuthorEl.value, deleteIsbnEl.value] = [title, author, isbn];
        })
        .catch(err => eventHandler(err))
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
        .catch(err => eventHandler(err));
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
        .catch(err => eventHandler(err))
    editForm.style.display = 'none';
    addForm.style.display = 'block';
}

function eventHandler(err) {
    // e.preventDefault();
    const bodyArh = bodyEl.innerHTML;
    bodyEl.innerHTML = `<div id="err-text"><strong>${err.message}</strong></div>`;
    setTimeout(() => bodyEl.innerHTML = `${bodyArh}`, 5000);
}