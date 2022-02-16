import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())
const PORT = 3001

type Quote = {
    id: number
    content: string
    authorId: number
}

type Author = {
    id: number,
    firstName: string
    lastName: string
    age: number
    image: string
    dead: boolean
}

type NewQuote = {
    content: string
    authorId: number
}

let authors: Author[] = [
    {
        'id': 1,
        'firstName': 'Mark',
        'lastName': 'Twain',
        'age': 74,
        'image': "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSbWpXNvj-m3_xaQm4m9ALrf3c1D-KscNie2FOxi42FjzMZ5gxf",
        'dead': true
    },
    {
        'id': 2,
        'firstName': 'Albert',
        'lastName': 'Einstein',
        'age': 76,
        'image': "https://parade.com/wp-content/uploads/2021/08/albert-einstein-quotes.jpg",
        'dead': true
    },
    {
        'id': 3,
        'firstName': 'Albert',
        'lastName': 'Camus',
        'age': 46,
        'image': "https://media.newyorker.com/photos/5909675d019dfc3494ea0dd0/16:9/w_1280,c_limit/120409_r22060_g2048.jpg",
        'dead': true
    },
    {
        'id': 4,
        'firstName': 'Thomas',
        'lastName': 'Stearns Eliot',
        'age': 76,
        'image': "http://t3.gstatic.com/licensed-image?q=tbn:ANd9GcT7s0yhE2NW95VH829FAn236XjX-cg9fAO8LJxG7mzc-aAkDa4DvgP5Q7H5lhSl",
        'dead': true
    },
    {
        'id': 5,
        'firstName': 'Margaret',
        'lastName': 'Atwood',
        'age': 82,
        'image': "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRZWkYKxRmvp29kWgKsvBWSBDrxWK_OpPEFs9yMP7doszUewZvH",
        'dead': false
    },
    {
        'id': 6,
        'firstName': "Ryan",
        'lastName': 'Dahl (Creator of Node JS)',
        'age': 41,
        'image': "https://www.mappingthejourney.com/wp-content/uploads/2017/08/image.jpg",
        'dead': false
    },
    {
        'id': 7,
        'firstName': 'Henry',
        'lastName': 'David Thoreau',
        'age': 44,
        'image': "http://t0.gstatic.com/licensed-image?q=tbn:ANd9GcSWrCRzadHKIofduRnG4lVp5WVnMNjZuHf654yg15SQ8VB8VAQoL8uEm0CQ34ir",
        'dead': true
    },
    {
        'id': 8,
        'firstName': 'Stephen King',
        'lastName': 'Twain',
        'age': 74,
        'image': "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFNn6FcqJgnTCBDjX9vK_qRnle-dHO1Jp7uEEqISfNOm8bbjoW",
        'dead': false
    }
]

let quotes: Quote[] = [
    {
        'id': 1,
        'content': 'Make memes, not war!',
        'authorId': 1
    },
    {
        'id': 2,
        'content': 'Stop making quotes I never said!',
        'authorId': 2
    },
    {
        'id': 3,
        'content': "The struggle itself towards the heights it's enough to fill a man's heart.",
        'authorId': 3
    },
    {
        'id': 4,
        'content': "We must never cease from exploring. And the end of our exploring will be to arrive where we began and know the place for the first time.",
        'authorId': 4
    },
    {
        'id': 5,
        'content': "Ignoring isn't the same as ignorance, you have to work at it.",
        'authorId': 5
    },
    {
        'id': 6,
        'content': "You can never understand everything. But, you should push yourself to understand the system.",
        'authorId': 6
    },
    {
        'id': 7,
        'content': 'Success usually comes to those who are too busy to be looking for it.',
        'authorId': 7
    },
    {
        'id': 8,
        'content': 'Get busy living or get busy dying.',
        'authorId': 8
    }
]



app.get('/', function (req, res) {
    res.send(`
    <h1>Welcome to our quotes API!</h1>
    <p>Here are some endpoints you can use:</p>
    <ul>
      <li><a href="/quotes">/quotes</a></li>
      <li><a href="/randomQuote">/randomQuote</a></li>
    </ul>
   `)
})

app.get('/quotes', function (req, res) {
    const search = req.query.search
    let quotesToSend = quotes

    if (typeof search === 'string') {
        quotesToSend = quotesToSend.filter(quote =>
            quote.content.toLowerCase().includes(search.toLowerCase())
        )
    }

    let quotesToSendCopy = JSON.parse(JSON.stringify(quotesToSend))

    for (const quote of quotesToSendCopy) {
        const author = authors.find(author => author.id === quote.authorId)
        quote.author = author
    }

    res.send(quotesToSendCopy)
})

app.get('/randomQuote', function (req, res) {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    res.send(quotes[randomIndex])
})

app.get('/quotes/:id', function (req, res) {
    const id = Number(req.params.id)

    const match = quotes.find(person => person.id === id)
    if (match) {
        res.send(match)
    } else res.status(404).send({ error: 'Quote not found' })
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
        const newQuote = {
            id: Math.random(),
            content,
            authorId
        }
        quotes.push(newQuote)
        res.status(201).send(newQuote)
    } else {
        res.status(400).send({ errors: errors })
    }
})

app.patch('/quotes/:id', (req, res) => {
    const id = Number(req.params.id)

    const { content, authorId }: NewQuote = req.body

    const quoteToChange = quotes.find(quote => quote.id === id)

    const errors = []

    if (quoteToChange) {
        // if (typeof firstName === 'string') {
        //     quoteToChange.firstName = firstName
        // } else errors.push(`First name not a string`)
        // if (typeof lastName === 'string') {
        //     quoteToChange.lastName = lastName
        // } else errors.push(`Last name not a string`)
        if (typeof content === 'string') {
            quoteToChange.content = content
        } else errors.push(`Content not a string`)
        if (typeof authorId === 'number') {
            quoteToChange.authorId = authorId
        } else errors.push(`authorId not a number`)
        // if (typeof image === 'string') {
        //     quoteToChange.image = image
        // } else (`Imagee not a string`)
        // if (typeof age === 'number') {
        //     quoteToChange.age = age
        // } else errors.push(`Age not a number`)
        // if (typeof dead === 'boolean') {
        //     quoteToChange.dead = dead
        // } else errors.push(`Dead not a boolean`)
        res.send({ data: quoteToChange, errors: errors })
    } else {
        res.status(404).send({ error: 'Quote not found.' })
    }
})

app.delete('/quotes/:id', (req, res) => {
    const id = Number(req.params.id)

    const match = quotes.find(quote => quote.id === id)

    if (match) {
        quotes = quotes.filter(quote => quote.id !== id)
        res.send({messsage: "Quote deleted sucessfully"})
    } else {
        res.status(404).send({error: 'Qoute not found'})
    }
})

app.get('/authors', (req, res) => {
    res.send(authors)
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

    if (typeof dead !== 'boolean') {
        errors.push(`Dead missing or not a boolean`)
    }

    if (errors.length === 0) {
        const newAuthor: Author = {
            id: Math.random(),
            firstName,
            lastName,
            image,
            age,
            dead
        }
        authors.push(newAuthor)
        res.status(201).send(newAuthor)
    } else {
        res.status(400).send({ errors: errors })
    }
})

app.listen(PORT, () => {
    console.log(`Server runing on: http://localhost:${PORT}/`)
})
