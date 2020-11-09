const tableEl = document.querySelector('tbody');
const loadBooksBtn = document.getElementById('loadBooks');
const baseUrl = 'https://collections-e1e12.firebaseio.com';

tableEl.innerHTML = '';

loadBooksBtn.addEventListener('click', listAllBooks);

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

async function listAllBooks() {
    const url = baseUrl + '/books.json';
    let response = await fetch(url);
    let allBooks = await response.json();
    tableEl.innerHTML = '';
    Object.entries(allBooks).forEach(book => {
        let newBook = createRow(book);
        tableEl.innerHTML += newBook;
    });
}

listAllBooks();

const titleEl = document.getElementById('title');
const authorEl = document.getElementById('author');
const isbnEl = document.getElementById('isbn');
const submitBtn = document.querySelector('form button');

submitBtn.addEventListener('click', submit);

function submit(e) {
    
    e.preventDefault();
    console.log(e);
    const submitUrl = baseUrl + '/books.json';
    fetch(submitUrl, {
        method: "POST", 
        body: {
            title: titleEl.value,
            author: authorEl.value,
            isbn: isbnEl.value,
        }
    })
    .then(res => console.log(res))
    .catch(err => console.log(err.message));

    titleEl.value = '';
    authorEl.value = '';
    isbnEl.value = '';

}
