const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser'); // 클라이언트에서 가져온 body 정보를 가져옴
const { User } = require("./models/User");

// application/x-www-form-urlencoded 으로 된 데이터를 분석해서 가져옴
app.use(bodyParser.urlencoded({ extended: true }));
// application/json 으로 된 데이터를 분석해서 가져옴
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://thch989:tjdgus98@cluster.iroqg.mongodb.net/?retryWrites=true&w=majority', {
  // useNewUrlParser: true, userUnifiedTopology: true, userCreateIndex: true, userFindAndModify: false 몽구스 6버전 이후 사용하지 않음
}).then(() => console.log('MongoDB 연결성공')).catch(err => console.log(err))

app.get('/', (req, res) => res.send('안녕하세요'))

app.post('/register', (req, res) => {
  // 회원 가입 할때 필요한 정보들을 client에서 가져오면
  // 그것을 데이터 베이스에 넣어준다.
  const user = new User(req.body)
  user.save((err, userInfo) => {
    if(err) return res.json({ success: false, err})
    return res.status(200).json({
      success: true
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})