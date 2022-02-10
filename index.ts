import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
const PORT = 3001

type Quote = {
    id: number
    content: string
    author: string
}

const quotes: Quote[] = [
    {
        'id': 1,
        'content': 'Make memes, not war!',
        'author': 'Mark Twain'
    },
    {
        'id': 2,
        'content': 'Stop making quotes I never said!',
        'author': 'Albert Einstein'
    },
    {
        'id': 3,
        'content': "The struggle itself towards the heights it's enough to fill a man's heart.",
        'author': 'Albert Camus'
    },
    {
        'id': 4,
        'content': "We must never cease from exploring. And the end of our exploring will be to arrive where we began and know the place for the first time.",
        'author': 'T. S. Eliot'
    },
    {
        'id': 5,
        'content': "Ignoring isn't the same as ignorance, you have to work at it.",
        'author': 'Margaret Atwood'
    },
    {
        'id': 6,
        'content': "You can never understand everything. But, you should push yourself to understand the system.",
        'author': "Ryan Dahl (Creator of Node JS)"
    },
    {
        'id': 7,
        'content': 'Success usually comes to those who are too busy to be looking for it.',
        'author': 'Henry David Thoreau'
    },
    {
        'id': 8,
        'content': 'Get busy living or get busy dying.',
        'author': 'Stephen King'
    }

]


app.get('/', function (req, res) {
    res.send('Wellcome to Node')
})

app.get('/quotes', function (req, res) {
    res.send(quotes)
})

app.get('/quotes/:id', function (req, res) {
    const id = Number(req.params.id)

    const match = quotes.find(person => person.id === id)
    if (match) {
        res.send(match)
    } else res.status(404).send({error: 'Quote not found'})
})


// app.use(cors({
//     origin: `http://localhost:3000`
// }));

app.listen(PORT, () => {
    console.log(`Server runing on: http://localhost:${PORT}/`)
})
