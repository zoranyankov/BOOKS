const tableEl = document.querySelector('tbody');
const loadBooksBtn = document.getElementById('loadBooks');
const baseUrl = 'https://collections-e1e12.firebaseio.com';

tableEl.innerHTML = '';

loadBooksBtn.addEventListener('click', listAllBooks);
// tableEl.addEventListener('click', editBook);

const createRow = ([id, { title, author, isbn }]) => `
    <tr id="${id}">
        <td>${title}</td>
        <td>${author}</td>
        <td>${isbn}</td>
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

const titleEl = document.getElementById('title');
const authorEl = document.getElementById('author');
const isbnEl = document.getElementById('isbn');

const submitBtn = document.querySelector('form button');

submitBtn.addEventListener('click', submit);

function submit(e) {
    e.preventDefault();
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
