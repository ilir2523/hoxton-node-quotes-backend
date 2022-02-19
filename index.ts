import express from 'express'
import cors from 'cors'
import Database from 'better-sqlite3'
import { createAuthor, createQuote } from './setup'

const db = new Database('./quotes_data.db', {
    verbose: console.log
})
const app = express()
app.use(cors())
app.use(express.json())
const PORT = 3001

const getAllAuthours = db.prepare(`SELECT * FROM authors;`);
const getAllQuotesId = db.prepare(`SELECT _id FROM quotes;`);
const getQuotesById = db.prepare(`SELECT * FROM quotes WHERE _id=?;`);
const deleteQuoteById = db.prepare(`DELETE FROM quotes WHERE _id=?;`)
const getAllQuotesAndAuthors = db.prepare(`
SELECT quotes._id,
    quotes.content,
    authors.firstName,
    authors.lastName,
    authors.age,
    authors.image,
    authors.dead FROM quotes INNER JOIN authors ON authorId = authors._id ;
`);
const updateQuote = db.prepare(`
UPDATE quotes SET content=?, authorId=? WHERE _id=? 
`)

const getQuoteAndAuthorById = db.prepare(`
SELECT quotes._id,
    quotes.content,
    authors.firstName,
    authors.lastName,
    authors.age,
    authors.image,
    authors.dead FROM quotes INNER JOIN authors ON authorId = authors._id WHERE quotes._id=?;
    `);

const getAuthorById = db.prepare(`SELECT * FROM authors WHERE _id=?;`);
const updateAuthor = db.prepare(`
UPDATE authors SET firstName=?, lastName=?, age=?, image=?, dead=? WHERE _id=?;
`);
const deleteAuthorById = db.prepare(`DELETE FROM authors WHERE _id=?;`)


app.get('/', function (req, res) {
    res.send(`
    <h1>Welcome to our quotes API!</h1>
    <p>Here are some endpoints you can use:</p>
    <ul>
      <li><a href="/quotes">/quotes</a></li>
      <li><a href="/quotes/id">/quotes</a></li>
      <li><p> You can use (/quotes?serch=string) for searching inside quote content. </p></li>
      <li><a href="/randomQuote">/randomQuote</a></li>
      <li><a href="/authors">/authors</a></li>
      <li><a href="/authors/id">/authors</a></li>
      <li><p> You can use (/authors?serch=string) for searching by authors first and last name. </p></li>
    </ul>
   `)
})

app.get('/quotes', function (req, res) {
    const quotes = getAllQuotesAndAuthors.all();
    const search = req.query.search
    let quotesToSend = quotes

    if (typeof search === 'string') {
        quotesToSend = quotesToSend.filter(quote =>
            quote.content.toLowerCase().includes(search.toLowerCase())
        )
    }
    res.send(quotesToSend)
})

app.get('/quotes/:id', function (req, res) {
    const id = Number(req.params.id)
    const result = getQuoteAndAuthorById.get(id)

    if (result) {
        res.send(result)
    } else res.status(404).send({ error: 'Quote not found' })
})

app.get('/randomQuote', function (req, res) {
    const quotes = getAllQuotesId.all();
    const randomIndex = Math.floor(Math.random() * (quotes.length - 1) + 1)
    // console.log(randomIndex) 
    const result = getQuoteAndAuthorById.get(randomIndex)
    res.send(result)
})

app.post('/quotes', (req, res) => {
    console.log(req.body)
    const { content, authorId } = req.body

    const errors = []

    if (typeof content !== 'string') {
        errors.push(`Content missing or not a string`)
    }
    if (typeof authorId !== 'number') {
        errors.push(`authorId missing or not a number`)
    }

    if (errors.length === 0) {
        const result = createQuote.run(content, authorId)
        const quote = getQuotesById.get(result.lastInsertRowid)
        res.status(201).send(quote)
    } else {
        res.status(400).send({ errors: errors })
    }
})

app.patch('/quotes/:id', (req, res) => {
    const id = Number(req.params.id)
    const { content, authorId } = req.body
    const result = updateQuote.run(content, authorId, id)
    console.log(result)

    if (result.changes !==0) {
        const updatedQuote = getQuotesById.get(id)
        res.send(updatedQuote)
    } else {
        res.status(404).send({ error: 'Quote not found.' })
    }
})

app.delete('/quotes/:id', (req, res) => {
    const id = Number(req.params.id)
    const result = deleteQuoteById.run(id)

    if (result.changes !== 0) {
        res.send({ messsage: "Quote deleted sucessfully" })
    } else {
        res.status(404).send({ error: 'Qoute not found' })
    }
})

app.get('/authors', (req, res) => {
    const search = req.query.search
    const authors = getAllAuthours.all()
    let authorsToSend = authors

    if (typeof search === 'string') {
        authorsToSend = authorsToSend.filter(author =>
            author.firstName.toLowerCase().includes(search.toLowerCase()) ||
            author.lastName.toLowerCase().includes(search.toLowerCase())
        )
    }
    res.send(authorsToSend)
})

app.get('/authors/:id', function (req, res) {
    const id = Number(req.params.id)
    const result = getAuthorById.get(id)
    if (result) {
        res.send(result)
    } else res.status(404).send({ error: 'Author not found' })
})

app.post('/authors', (req, res) => {
    console.log(req.body)
    const { firstName,
        lastName,
        image,
        age,
        dead } = req.body

    const errors = []

    if (typeof firstName !== 'string') {
        errors.push(`First name missing or not a string`)
    }

    if (typeof lastName !== 'string') {
        errors.push(`Last name missing or not a string`)
    }

    if (typeof image !== 'string') {
        errors.push(`Imagee missing or not a string`)
    }

    if (typeof age !== 'number') {
        errors.push(`Age missing or not a number`)
    }

    if (typeof dead !== 'number') {
        errors.push(`Dead missing or not a number`)
    }

    if (errors.length === 0) {
        const result = createAuthor.run(
            firstName,
            lastName,
            age,
            image,
            dead)
        const newAuthor = getAuthorById.get(result.lastInsertRowid)
        res.status(201).send(newAuthor)
    } else {
        res.status(400).send({ errors: errors })
    }
})

app.patch('/authors/:id', (req, res) => {
    const id = Number(req.params.id)
    const { firstName,
        lastName,
        image,
        age,
        dead } = req.body

    const authorToChange = getAuthorById.get(id)
    const errors = []
    // console.log(authorToChange)

    if (authorToChange) {
        if (typeof firstName === 'string') {
            authorToChange.firstName = firstName
        } else errors.push(`First name not a string`)
        if (typeof lastName === 'string') {
            authorToChange.lastName = lastName
        } else errors.push(`Last name not a string`)
        if (typeof image === 'string') {
            authorToChange.image = image
        } else (`Imagee not a string`)
        if (typeof age === 'number') {
            authorToChange.age = age
        } else errors.push(`Age not a number`)
        if (typeof dead === 'number') {
            authorToChange.dead = dead
        } else errors.push(`Dead not a number`)
        updateAuthor.run(authorToChange.firstName,
            authorToChange.lastName,
            authorToChange.image,
            authorToChange.age,
            authorToChange.dead, id)
        res.send({ data: authorToChange, errors: errors })
    } else {
        res.status(404).send({ error: 'Author not found.' })
    }
})

app.delete('/authors/:id', (req, res) => {
    const id = Number(req.params.id)
    const result = deleteAuthorById.run(id)

    if (result.changes !== 0) {
        res.send({ messsage: "Author deleted sucessfully" })
    } else {
        res.status(404).send({ error: 'Author not found' })
    }
})

app.listen(PORT, () => {
    console.log(`Server runing on: http://localhost:${PORT}/`)
})
