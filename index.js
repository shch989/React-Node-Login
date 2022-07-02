const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://thch989:tjdgus98@cluster.iroqg.mongodb.net/?retryWrites=true&w=majority', {
  // useNewUrlParser: true, userUnifiedTopology: true, userCreateIndex: true, userFindAndModify: false 몽구스 6버전 이후 사용하지 않음
}).then(() => console.log('MongoDB 연결성공')).catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})