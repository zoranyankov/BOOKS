const tableEl = document.querySelector('tbody');
const loadBooksBtn = document.getElementById('loadBooks');
const baseUrl = 'https://collections-e1e12.firebaseio.com';

tableEl.innerHTML = '';
let selectedBookId = '';

loadBooksBtn.addEventListener('click', listAllBooks);
tableEl.addEventListener('click', editBook);

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

const createForm = ([id, { title, author, isbn }]) => `
    <tr id="${id}">
        <td class="book-title"><input id="title" type="title" placeholder="Title..." value ="${title}"></td>
        <td class="book-author"><input id="author" type="title" placeholder="Author..." value ="${author}"></td>
        <td class="book-isbn"><input id="Isbn" type="title" placeholder="Isbn..." value ="${isbn}"></td>
        <td>
            <button class="edit-book">Edit</button>
            <button class="delete-book">Delete</button>
        </td>
    </tr>
`;

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

const submitBtn = document.querySelector('form button');

submitBtn.addEventListener('click', submit);

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

function editBook(e) {
    const currBookId = e.target.parentElement.parentElement.getAttribute('id');
    if(e.target.innerHTML == 'Delete') {
        const deleteUrl = `${baseUrl}/books/${currBookId}.json`;
        fetch(deleteUrl, {method: "DELETE"})
        .then(e.target.parentElement.parentElement.remove())
        .catch(err => console.log(err.message));
    }


    // if (e.target.parentElement.id != selectedBookId) {
    //     const currBook = e.target.parentElement;
    //     const currBookId = currBook.getAttribute('id');
    //     const currTitleEl = currBook.querySelector('td.book-title');
    //     const currAuthorEl = currBook.querySelector('td.book-author');
    //     const currIsbnEl = currBook.querySelector('td.book-isbn');
        
    //     const editedBook = {
    //         title: currTitleEl.innerHTML,
    //         author: currAuthorEl.innerHTML,
    //         isbn: currIsbnEl.innerHTML,
    //     }
    //     let newRow = createForm([currBookId, editedBook]);
    // }
    // console.log(newRow);

    // currBook.innerHTML = newRow;

    //// const editUrl = `${baseUrl}/books/${currBookId}.json`;


    // fetch(editUrl, {
    //     method: "POST",
    //     body: JSON.stringify(editedBook)
    // })
    //     .catch(err => console.log(err.message));

}