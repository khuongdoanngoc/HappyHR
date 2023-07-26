
const express = require('express')
const { engine } = require('express-handlebars')
require('dotenv').config()
const path = require('path')
const route = require('./routes/route')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')

const SortMiddleware = require('./app/middlewares/sort.middleware')
const sessionMiddleware = require('./app/middlewares/session.middleware')

const jQuery = require('jquery')

const app = express()
const port = process.env.PORT || 3000

// connect to DB
const db = require('./config/db/index')
db.connect()

// aplly middleware
app.use(SortMiddleware)

app.use(methodOverride('_method'))

app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded())
app.use(express.json())
app.use(sessionMiddleware)
app.use(flash())
app.use(cookieParser(process.env.SESSION_SECRET_KEY))

app.engine('.hbs', engine({
    extname: 'hbs',
    helpers: {
        sum: (a, b) => a + b,
        sortable: (field, sort) => {

            const icons = {
                default: 'https://cdn-icons-png.flaticon.com/512/98/98122.png',
                asc: 'https://cdn-icons-png.flaticon.com/512/9798/9798345.png',
                desc: 'https://cdn-icons-png.flaticon.com/512/9798/9798339.png'
            }

            const types = {
                default: 'desc',
                asc: 'desc',
                desc: 'asc',
            }

            const sortType = field === sort.column ? sort.type : 'default'

            const icon = icons[sortType]
            const type = types[sortType]

            return `<a href="?_sort&column=${field}&type=${type}">
                        <img src="${icon}" alt="" width="17" height="17">
                    </a>`

        }
    }
}))



app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, './resources/views'))

route(app)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

