const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const fs = require('fs');
const dotenv = require('dotenv')

dotenv.config()

// console.log(process.env.PORT)

const dev = process.env.TYPE === "dev"
const hostname = process.env.HOST
const port = process.env.PORT

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then((err) => {
    createServer(async (req, res) => {
        try {
            // Be sure to pass `true` as the second argument to `url.parse`.
            // This tells it to parse the query portion of the URL.
            const parsedUrl = parse(req.url, true)
            const { pathname, query } = parsedUrl
            await handle(req, res, parsedUrl)
        } catch (err) {
            console.error('Error occurred handling', req.url, err)
            res.statusCode = 500
            res.end('internal server error')
        }
    }).listen(port, (err) => {
        if (err) throw err
        console.log(`> Ready on http://${hostname}:${port}`)
    })
})

setInterval(() => {
    var data = fs.readFileSync('./database.json')
    data = JSON.parse(data)

    if(data.length <= 0) return

    for (const[key, value] of Object.entries(data)) {
        let currentDate = Date.now()
        let creationDate = value.created

        if(creationDate != undefined) {
            if(currentDate-creationDate > parseInt(process.env.EXPIRES_IN)*1000) {
                debug(`${key} expired.`)
                delete data[key]
                fs.writeFileSync('./database.json', JSON.stringify(data, null, "\t"))
            }
        }
    }
}, 5000)

function debug(msg) {
    console.log("\x1b[43m[DEBUG] > " + msg + " \x1b[0m")
}