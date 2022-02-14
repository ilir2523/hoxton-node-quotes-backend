import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
const PORT = 3001

type Quote = {
    id: number
    content: string
    firstName: string
    lastName: string
    age: number
    image: string
    dead: boolean
}

const quotes: Quote[] = [
    {
        'id': 1,
        'content': 'Make memes, not war!',
        'firstName': 'Mark',
        'lastName': 'Twain',
        'age': 74,
        'image': "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSbWpXNvj-m3_xaQm4m9ALrf3c1D-KscNie2FOxi42FjzMZ5gxf",
        'dead': true
    },
    {
        'id': 2,
        'content': 'Stop making quotes I never said!',
        'firstName': 'Albert',
        'lastName': 'Einstein',
        'age': 76,
        'image': "https://parade.com/wp-content/uploads/2021/08/albert-einstein-quotes.jpg",
        'dead': true
    },
    {
        'id': 3,
        'content': "The struggle itself towards the heights it's enough to fill a man's heart.",
        'firstName': 'Albert',
        'lastName': 'Camus',
        'age': 46,
        'image': "https://media.newyorker.com/photos/5909675d019dfc3494ea0dd0/16:9/w_1280,c_limit/120409_r22060_g2048.jpg",
        'dead': true
    },
    {
        'id': 4,
        'content': "We must never cease from exploring. And the end of our exploring will be to arrive where we began and know the place for the first time.",
        'firstName': 'Thomas',
        'lastName': 'Stearns Eliot',
        'age': 76,
        'image': "http://t3.gstatic.com/licensed-image?q=tbn:ANd9GcT7s0yhE2NW95VH829FAn236XjX-cg9fAO8LJxG7mzc-aAkDa4DvgP5Q7H5lhSl",
        'dead': true
    },
    {
        'id': 5,
        'content': "Ignoring isn't the same as ignorance, you have to work at it.",
        'firstName': 'Margaret',
        'lastName': 'Atwood',
        'age': 82,
        'image': "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRZWkYKxRmvp29kWgKsvBWSBDrxWK_OpPEFs9yMP7doszUewZvH",
        'dead': false
    },
    {
        'id': 6,
        'content': "You can never understand everything. But, you should push yourself to understand the system.",
        'firstName': "Ryan",
        'lastName': 'Dahl (Creator of Node JS)',
        'age': 41,
        'image': "https://www.mappingthejourney.com/wp-content/uploads/2017/08/image.jpg",
        'dead': false
    },
    {
        'id': 7,
        'content': 'Success usually comes to those who are too busy to be looking for it.',
        'firstName': 'Henry',
        'lastName': 'David Thoreau',
        'age': 44,
        'image': "http://t0.gstatic.com/licensed-image?q=tbn:ANd9GcSWrCRzadHKIofduRnG4lVp5WVnMNjZuHf654yg15SQ8VB8VAQoL8uEm0CQ34ir",
        'dead': true
    },
    {
        'id': 8,
        'content': 'Get busy living or get busy dying.',
        'firstName': 'Stephen King',
        'lastName': 'Twain',
        'age': 74,
        'image': "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFNn6FcqJgnTCBDjX9vK_qRnle-dHO1Jp7uEEqISfNOm8bbjoW",
        'dead': false
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

    if (typeof search === 'string' ) {
        quotesToSend = quotesToSend.filter(quote => 
            quote.content.toLowerCase().includes(search.toLowerCase())
            )
    }
    res.send(quotesToSend)
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

app.listen(PORT, () => {
    console.log(`Server runing on: http://localhost:${PORT}/`)
})
