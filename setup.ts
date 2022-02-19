import Database from "better-sqlite3";

const db = new Database('./quotes_data.db', {
    verbose: console.log
})

let authors = [
    {
        'firstName': 'Mark',
        'lastName': 'Twain',
        'age': 74,
        'image': "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSbWpXNvj-m3_xaQm4m9ALrf3c1D-KscNie2FOxi42FjzMZ5gxf",
        'dead': 1
    },
    {
        'firstName': 'Albert',
        'lastName': 'Einstein',
        'age': 76,
        'image': "https://parade.com/wp-content/uploads/2021/08/albert-einstein-quotes.jpg",
        'dead': 1
    },
    {
        'firstName': 'Albert',
        'lastName': 'Camus',
        'age': 46,
        'image': "https://media.newyorker.com/photos/5909675d019dfc3494ea0dd0/16:9/w_1280,c_limit/120409_r22060_g2048.jpg",
        'dead': 1
    },
    {
        'firstName': 'Thomas',
        'lastName': 'Stearns Eliot',
        'age': 76,
        'image': "http://t3.gstatic.com/licensed-image?q=tbn:ANd9GcT7s0yhE2NW95VH829FAn236XjX-cg9fAO8LJxG7mzc-aAkDa4DvgP5Q7H5lhSl",
        'dead': 1
    },
    {
        'firstName': 'Margaret',
        'lastName': 'Atwood',
        'age': 82,
        'image': "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRZWkYKxRmvp29kWgKsvBWSBDrxWK_OpPEFs9yMP7doszUewZvH",
        'dead': 0
    },
    {
        'firstName': "Ryan",
        'lastName': 'Dahl (Creator of Node JS)',
        'age': 41,
        'image': "https://www.mappingthejourney.com/wp-content/uploads/2017/08/image.jpg",
        'dead': 0
    },
    {
        'firstName': 'Henry',
        'lastName': 'David Thoreau',
        'age': 44,
        'image': "http://t0.gstatic.com/licensed-image?q=tbn:ANd9GcSWrCRzadHKIofduRnG4lVp5WVnMNjZuHf654yg15SQ8VB8VAQoL8uEm0CQ34ir",
        'dead': 1
    },
    {
        'firstName': 'Stephen',
        'lastName': 'King',
        'age': 74,
        'image': "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFNn6FcqJgnTCBDjX9vK_qRnle-dHO1Jp7uEEqISfNOm8bbjoW",
        'dead': 0
    }
]

let quotes = [
    {
        'content': 'Make memes, not war!',
        'authorId': 1
    },
    {
        'content': 'Stop making quotes I never said!',
        'authorId': 2
    },
    {
        'content': "The struggle itself towards the heights it's enough to fill a man's heart.",
        'authorId': 3
    },
    {
        'content': "We must never cease from exploring. And the end of our exploring will be to arrive where we began and know the place for the first time.",
        'authorId': 4
    },
    {
        'content': "Ignoring isn't the same as ignorance, you have to work at it.",
        'authorId': 5
    },
    {
        'content': "You can never understand everything. But, you should push yourself to understand the system.",
        'authorId': 6
    },
    {
        'content': 'Success usually comes to those who are too busy to be looking for it.',
        'authorId': 7
    },
    {
        'content': 'Get busy living or get busy dying.',
        'authorId': 8
    }
]

const dropAuthorsTable = db.prepare("DROP TABLE authors;")
dropAuthorsTable.run()
const dropquotesTable = db.prepare("DROP TABLE quotes;")
dropquotesTable.run()

const createAuthorsTable = db.prepare(`
CREATE TABLE authors (
    _id INTEGER,
    firstName TEXT,
    lastName TEXT,
    age INTEGER,
    image TEXT,
    dead INTEGER,
    PRIMARY KEY (_id)
  );
`)

const createQuotesTable = db.prepare(`
CREATE TABLE quotes (
    _id INTEGER,
    content TEXT NOT NULL,
    authorId INTEGER,
    PRIMARY KEY(_id)
    );
`)

createAuthorsTable.run()
createQuotesTable.run()

const deleteAuthors = db.prepare(`DELETE FROM authors;`)
deleteAuthors.run()
const deleteQuotes = db.prepare(`DELETE FROM quotes;`)
deleteQuotes.run()

export const createAuthor = db.prepare(`INSERT INTO authors (firstName, lastName, age, image, dead) VALUES (?,?,?,?,?);`)
export const createQuote = db.prepare(`INSERT INTO quotes (content, authorId) VALUES (?,?);`)

for (const author of authors) {
    const {firstName, lastName, age, image, dead} = author
    createAuthor.run(firstName, lastName, age, image, dead)
}

for (const quote of quotes) {
    const {content, authorId} = quote
    createQuote.run(content, authorId)
}
