const fs = require('fs')
const utils = {
    addData2View: (view, data) => {
        let _view = view
        Object.keys(data).forEach(key => {
            // console.log(data[key], typeof data[key])
            // if (typeof data[key] === 'object')
            //     _view = view.replaceAll(`{{${key}}}`, JSON.stringify(data[key], null, '\t') || '')
            // else
            _view = _view.replaceAll(`{{${key}}}`, data[key] || '')
                
        })
        return _view
    },
    getRowsHTML: (rows) => {
        if (!rows)
            return 'NULL returned'
        
        if (!rows.length)
            return 'no rows returned'
        
        if (rows && rows.length) {
            return [
                `<table class="table" style="font-size: 70%">`,
                `<thead><tr>`,
                ...Object.keys(rows[0]).map(key => `<th scope="col">${key}</th>`),
                `</tr></thead>`,
                `<tbody>`,
                ...rows.map(rowData => [`<tr>`, ...Object.values(rowData).map(x => `<td>${x}</td>`), `</tr>`].join('')),
                `</tbody>`,
                `</table>`
            ].join('')
        }
    },
    // set a bootstrap 5 tab active by id
    setTabActive: (view, tabId) => {
        let _view = view
            //.split(/\r\n|\r|\n/).join('')
            //.replace(/(?<=>)\s+(?=<)/g, '')
            .replace('class="nav-link active"', 'class="nav-link"')
            .replace('class="tab-pane fade show active"', 'class="tab-pane fade"')
        _view = _view.split(`"${tabId}`).map((x, i) => {
            if (i === 0)
                return x.split('class="nav-').map((x2, i2, arr2) => {
                    if (i2 === arr2.length - 1)
                        return x2.replace('link"', 'link active"')  
                    return x2
                }).join('class="nav-')
            if (i === 1)
                return x.split('class="tab-p').map((x3, i3, arr3) => {
                    if (i3 === arr3.length - 1)
                        return x3.replace('ane fade"', 'ane fade show active"')
                    return x3
                }).join('class="tab-p')
            return x
        }).join(`"${tabId}`)
        return _view
    },
    displayData: (res, templateFile, pageData, dataToShow) => {
        let _templateFileWithData = utils.addData2View(
            templateFile,
            {
                ...pageData,
                ...dataToShow
            }
        )
        res
            .set({
                'Content-Type': 'text/html',
                'Content-Length': _templateFileWithData.length
            })
            .send(_templateFileWithData)
    },
    send404Page: (res, errMsg) => {
        fs.readFile('templates/404.html', 'utf8', (err404, templateFile404) => {
            const _errPageWithData = utils.addData2View(templateFile404, { content: errMsg })
            res.send(_errPageWithData)
        })
    }
}

module.exports = utils