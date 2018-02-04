const axios = require('axios')

const path = require('path')
const express = require('express')

const app = express()
const server = require('http').createServer(app)

app.use('/pdf.js-gh-pages', express.static(path.join(__dirname, 'pdf.js-gh-pages')));
app.use('/pdf', express.static(path.join(__dirname, 'pdf')));
app.use('/src', express.static(path.join(__dirname, 'src')));
app.use('/build', express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

// app.get('/lineData', (req, res) => {
//   res.json(chartData)
// })

server.listen(3000, () => {
  console.log('run server')
})