const fs = require('fs')
const utils = require('./utils')

const defaultValues = {
    connectionString: "Driver={SQL Server Native Client 11.0}; Server=AG-RIA-GPDEV.nuvei.local,1443; Database=Europay; Trusted_Connection=Yes;",
    connectionObject: JSON.stringify({
        database: "Europay",
        server: "AG-RIA-GPDEV.nuvei.local",
        port: "1443",
        driver: "msnodesqlv8",
        options: {
            trustedConnection: true
        }
    }, null, "\t"),
    query: "SELECT TOP (3) * FROM [Europay].[dbo].[Payments]",
    rows: '',
    err: '',
}


const routeHandler = {
    index: (req, res) => {
        if (req.url === '/')
            fs.readFile('templates/index.html', 'utf8', (err, templateFile) => {
                res.send(templateFile)
            })

        if (req.url === '/makeQuery_msnodesqlv8_win_auth')
            fs.readFile(`templates/index_msnodesqlv8.html`, 'utf8', (err, templateFile) => {
                res.send(utils.addData2View(templateFile, defaultValues))
            })

        if (req.url === '/makeQuery_mssql_win_auth')
            fs.readFile(`templates/index_mssql.html`, 'utf8', (err, templateFile) => {
                res.send(utils.addData2View(templateFile, defaultValues))
            })
    },
    makeQuery_msnodesqlv8_win_auth: async (req, res) => {
        const _templateFile = await fs.readFileSync('templates/index_msnodesqlv8.html', 'utf8')
        //const _templateFileWithActiveTab = utils.setTabActive(_templateFile, 'nav-msnodesqlv8')
        const connectionString = await req.body.connectionString
        const query = await req.body.query

        const sql = require('msnodesqlv8')
        sql.query(connectionString, query, (err, rows) => {
            utils.displayData(
                res,
                _templateFile,
                {
                    ...defaultValues,
                    connectionString,
                    query: query
                },
                {
                    err,
                    rows: utils.getRowsHTML(rows)
                }
            )
        })

    },
    makeQuery_mssql_win_auth: async (req, res) => {
        try {
            const _templateFile = await fs.readFileSync('templates/index_mssql.html', 'utf8')
            //const _templateFileWithActiveTab = utils.setTabActive(_templateFile, 'nav-mssql')
            const _connectionObject = await JSON.parse(req.body.connectionObject)
            const _query = await req.body.query
            const _handleError = err => {
                fs.readFile('templates/index_mssql.html', 'utf8', async (fileErr, templateFile) => {
                    const _templateFileWithData = utils.addData2View(
                        templateFile, {
                        ...defaultValues,
                        connectionObject: JSON.stringify(_connectionObject, null, '\t'),
                        query: _query,
                        err
                    })

                    res.send(_templateFileWithData)
                })
            }

            const sql = require('mssql/msnodesqlv8')
            try {
                const _connection = await new sql.ConnectionPool(_connectionObject)
                const _pool = await _connection.connect()
                const _request = new sql.Request(_pool)
                await _request.query(_query, (err, result) => {
                    utils.displayData(
                        res,
                        _templateFile,
                        {
                            ...defaultValues,
                            connectionObject: JSON.stringify(_connectionObject, null, '\t'),
                            query: _query,
                        },
                        {
                            err,
                            rows: utils.getRowsHTML(result.recordset)
                        }
                    )
                })
            }
            catch (err) {
                _handleError(err)
            }
        }
        catch (err) {
            fs.readFile('templates/index_mssql.html', 'utf8', async (fileErr, templateFile) => {
                const _templateFileWithData = utils.addData2View(
                    templateFile,
                    {
                        ...defaultValues,
                        connectionObject: req.body.connectionObject,
                        query: req.body.query,
                        err
                    }
                )

                res.send(_templateFileWithData)
            })
        }
    },
    404: (req, res, next) => {
        res.status(404)
        // respond with html page
        if (req.accepts('html')) {
            utils.send404Page(res, `${req.hostname}${req.url}<br/>not found!`)
            return
        }
        // respond with json
        if (req.accepts('json')) {
            res.json({ error: 'Not found' })
            return
        }
        // default to plain-text. send()
        res.type('txt').send('Not found')
    }
}

module.exports = routeHandler