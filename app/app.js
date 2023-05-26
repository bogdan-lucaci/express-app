const express = require('express')
const routeHandler = require('./routeHandler')

const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true, }))
app.use(express.static(`${__dirname}/../public`));

app.get("/", routeHandler.index)
app.get("/makeQuery_msnodesqlv8_win_auth", routeHandler.index)
app.post("/makeQuery_msnodesqlv8_win_auth", routeHandler.makeQuery_msnodesqlv8_win_auth)
app.get("/makeQuery_mssql_win_auth", routeHandler.index)
app.post("/makeQuery_mssql_win_auth", routeHandler.makeQuery_mssql_win_auth)

//The 404 Route (ALWAYS Keep this as the last route)
app.use(routeHandler[404])

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})