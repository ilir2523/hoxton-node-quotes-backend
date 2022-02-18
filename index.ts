import express from 'express'
import cors from 'cors'
import Database from 'better-sqlite3'

const db = new Database('./quotes_data.db', {
    verbose: console.log
})
const app = express()
app.use(cors())
app.use(express.json())
const PORT = 3001

const getAllAuthours = db.prepare(`SELECT * FROM authors;`);
const getAllQuotesId = db.prepare(`SELECT _id FROM quotes;`);
const getAllQuotesAndAuthors = db.prepare(`
SELECT quotes._id,
    quotes.content,
    authors.firstName,
    authors.lastName,
    authors.age,
    authors.image,
    authors.dead FROM quotes INNER JOIN authors ON authorId = authors._id ;
`);

const getQuoteAndAuthorById = db.prepare(`
SELECT quotes._id,
    quotes.content,
    authors.firstName,
    authors.lastName,
    authors.age,
    authors.image,
    authors.dead FROM quotes INNER JOIN authors ON authorId = authors._id WHERE quotes._id=?;`);

app.get('/', function (req, res) {
    res.send(`
    <h1>Welcome to our quotes API!</h1>
    <p>Here are some endpoints you can use:</p>
    <ul>
      <li><a href="/quotes">/quotes</a></li>
      <li><p> You can use (/quotes?serch=string) for searching inside quote content. </p></li>
      <li><a href="/randomQuote">/randomQuote</a></li>
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

// app.post('/quotes', (req, res) => {
//     console.log(req.body)

//     const { content, authorId } = req.body

//     const errors = []

//     if (typeof content !== 'string') {
//         errors.push(`Content missing or not a string`)
//     }
//     if (typeof authorId !== 'number') {
//         errors.push(`authorId missing or not a number`)
//     }


//     if (errors.length === 0) {
//         const newQuote = {
//             id: Math.random(),
//             content,
//             authorId
//         }
//         quotes.push(newQuote)
//         res.status(201).send(newQuote)
//     } else {
//         res.status(400).send({ errors: errors })
//     }
// })

// app.patch('/quotes/:id', (req, res) => {
//     const id = Number(req.params.id)

//     const { content, authorId }: NewQuote = req.body

//     const quoteToChange = quotes.find(quote => quote.id === id)

//     const errors = []

//     if (quoteToChange) {
//         // if (typeof firstName === 'string') {
//         //     quoteToChange.firstName = firstName
//         // } else errors.push(`First name not a string`)
//         // if (typeof lastName === 'string') {
//         //     quoteToChange.lastName = lastName
//         // } else errors.push(`Last name not a string`)
//         if (typeof content === 'string') {
//             quoteToChange.content = content
//         } else errors.push(`Content not a string`)
//         if (typeof authorId === 'number') {
//             quoteToChange.authorId = authorId
//         } else errors.push(`authorId not a number`)
//         // if (typeof image === 'string') {
//         //     quoteToChange.image = image
//         // } else (`Imagee not a string`)
//         // if (typeof age === 'number') {
//         //     quoteToChange.age = age
//         // } else errors.push(`Age not a number`)
//         // if (typeof dead === 'boolean') {
//         //     quoteToChange.dead = dead
//         // } else errors.push(`Dead not a boolean`)
//         res.send({ data: quoteToChange, errors: errors })
//     } else {
//         res.status(404).send({ error: 'Quote not found.' })
//     }
// })

// app.delete('/quotes/:id', (req, res) => {
//     const id = Number(req.params.id)

//     const match = quotes.find(quote => quote.id === id)

//     if (match) {
//         quotes = quotes.filter(quote => quote.id !== id)
//         res.send({ messsage: "Quote deleted sucessfully" })
//     } else {
//         res.status(404).send({ error: 'Qoute not found' })
//     }
// })

// app.get('/authors', (req, res) => {
//     const search = req.query.search
//     let authorsToSend = authors

//     if (typeof search === 'string') {
//         authorsToSend = authorsToSend.filter(author =>
//             author.firstName.toLowerCase().includes(search.toLowerCase()) ||
//             author.lastName.toLowerCase().includes(search.toLowerCase())
//         )
//     }
//     res.send(authorsToSend)
// })

// app.get('/authors/:id', function (req, res) {
//     const id = Number(req.params.id)

//     const match = authors.find(person => person.id === id)
//     if (match) {
//         res.send(match)
//     } else res.status(404).send({ error: 'Author not found' })
// })

// app.post('/authors', (req, res) => {
//     console.log(req.body)

//     const { firstName,
//         lastName,
//         image,
//         age,
//         dead } = req.body

//     const errors = []

//     if (typeof firstName !== 'string') {
//         errors.push(`First name missing or not a string`)
//     }

//     if (typeof lastName !== 'string') {
//         errors.push(`Last name missing or not a string`)
//     }

//     if (typeof image !== 'string') {
//         errors.push(`Imagee missing or not a string`)
//     }

//     if (typeof age !== 'number') {
//         errors.push(`Age missing or not a number`)
//     }

//     if (typeof dead !== 'boolean') {
//         errors.push(`Dead missing or not a boolean`)
//     }

//     if (errors.length === 0) {
//         const newAuthor: Author = {
//             id: Math.random(),
//             firstName,
//             lastName,
//             image,
//             age,
//             dead
//         }
//         authors.push(newAuthor)
//         res.status(201).send(newAuthor)
//     } else {
//         res.status(400).send({ errors: errors })
//     }
// })

// app.patch('/authors/:id', (req, res) => {
//     const id = Number(req.params.id)

//     const { firstName,
//         lastName,
//         image,
//         age,
//         dead } = req.body

//     const authorToChange = authors.find(author => author.id === id)

//     const errors = []

//     if (authorToChange) {
//         if (typeof firstName === 'string') {
//             authorToChange.firstName = firstName
//         } else errors.push(`First name not a string`)
//         if (typeof lastName === 'string') {
//             authorToChange.lastName = lastName
//         } else errors.push(`Last name not a string`)
//         if (typeof image === 'string') {
//             authorToChange.image = image
//         } else (`Imagee not a string`)
//         if (typeof age === 'number') {
//             authorToChange.age = age
//         } else errors.push(`Age not a number`)
//         if (typeof dead === 'boolean') {
//             authorToChange.dead = dead
//         } else errors.push(`Dead not a boolean`)
//         res.send({ data: authorToChange, errors: errors })
//     } else {
//         res.status(404).send({ error: 'Author not found.' })
//     }
// })

// app.delete('/authors/:id', (req, res) => {
//     const id = Number(req.params.id)

//     const match = authors.find(author => author.id === id)

//     if (match) {
//         authors = authors.filter(author => author.id !== id)
//         res.send({ messsage: "Author deleted sucessfully" })
//     } else {
//         res.status(404).send({ error: 'Author not found' })
//     }
// })

app.listen(PORT, () => {
    console.log(`Server runing on: http://localhost:${PORT}/`)
})
