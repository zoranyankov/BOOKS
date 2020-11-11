const tableEl = document.querySelector('tbody');
const loadBooksBtn = document.getElementById('loadBooks');
const baseUrl = 'https://collections-e1e12.firebaseio.com';
const submitBtn = document.getElementById('submit-button');
const editBtn = document.getElementById('edit-button');

tableEl.innerHTML = '';
let selectedBookId = '';

loadBooksBtn.addEventListener('click', listAllBooks);
submitBtn.addEventListener('click', submit);
tableEl.addEventListener('click', editDeleteBook);
// editBtn.addEventListener('click', submitEdit);

const createRow = ([id, { title, author, isbn }]) => `
    <tr id="${id}">
        <td class="book-title">${title}</td>
        <td class="book-author">${author}</td>
        <td class="book-isbn">${isbn}</td>
        <td>
            <button class="edit-book">Edit</button>
            <button class="delete-book">Delete</button>
        </td>
    </tr>
`;

// // const createForm = ([id, { title, author, isbn }]) => `
//     <tr id="${id}">
//         <td class="book-title"><input id="title" type="title" placeholder="Title..." value ="${title}"></td>
//         <td class="book-author"><input id="author" type="title" placeholder="Author..." value ="${author}"></td>
//         <td class="book-isbn"><input id="Isbn" type="title" placeholder="Isbn..." value ="${isbn}"></td>
//         <td>
//             <button class="edit-book">Edit</button>
//             <button class="delete-book">Delete</button>
//         </td>
//     </tr>
// `;

function listAllBooks() {
    const url = baseUrl + '/books.json';
    fetch(url)
        .then(res => res.json())
        .then(allBooks => {
            console.log(allBooks);
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
        .then(newBook => {
            tableEl.innerHTML += newBook;
        })
        .catch(err => console.log(err.message));

    titleEl.value = '';
    authorEl.value = '';
    isbnEl.value = '';

}

function editDeleteBook(e) {
    const selection = e.target
    const currBookId = selection.parentElement.parentElement.getAttribute('id');
    const selectedBookUrl = `${baseUrl}/books/${currBookId}.json`;
    if (selection.innerHTML == 'Delete') {
        fetch(selectedBookUrl, { method: "DELETE" })
            .then(selection.parentElement.parentElement.remove())
            .catch(err => console.log(err.message));
    }

    if (selection.innerHTML == 'Edit') {
        const editForm = document.querySelector('form.edit-form');
        const editTitleEl = document.getElementById('edit-title');
        const editAuthorEl = document.getElementById('edit-author');
        const editIsbnEl = document.getElementById('edit-isbn');

        fetch(selectedBookUrl)
            .then(res => res.json())
            .then(selectedBook => {
                [editTitleEl.value, editAuthorEl.value, editIsbnEl.value] = [selectedBook.title, selectedBook.author, selectedBook.isbn];
                editForm.style.display = 'block';
                editBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const editedBook = {
                        title: editTitleEl.value,
                        author: editAuthorEl.value,
                        isbn: editIsbnEl.value,
                    }
                    fetch(selectedBookUrl, {
                        method: "PUT",
                        body: JSON.stringify(editedBook)
                    })
                    .then(res => res.json())
                    .then(editedBook => {
                        selection.parentElement.parentElement.innerHTML = createRow([currBookId, editedBook]);
                        editForm.style.display = 'none';
                })
                    .catch(err => console.log(err.message))
                })
            })
            .catch(err => console.log(err.message))
    }
}
