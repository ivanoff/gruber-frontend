const express = require('express')
const app = express()

app.get('/', (req, res) => res.json([ {name: 'test', value: 13}, {name: 'test2', value: 14} ]))

app.listen(3038, () => console.log('Example app listening on port 3038!'))
