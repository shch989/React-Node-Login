const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser'); // 클라이언트에서 가져온 body 정보를 가져옴
const cookieParser = require('cookie-parser'); // cookieParser
const config = require('./config/key')

const { auth } = require('./middleware/auth') 
const { User } = require("./models/User");

// application/x-www-form-urlencoded 으로 된 데이터를 분석해서 가져옴
app.use(bodyParser.urlencoded({ extended: true }));
// application/json 으로 된 데이터를 분석해서 가져옴
app.use(bodyParser.json());
// cookieParser
app.use(cookieParser());

const mongoose = require('mongoose');
const { application } = require('express');
mongoose.connect(config.mongoURI, {
  // useNewUrlParser: true, userUnifiedTopology: true, userCreateIndex: true, userFindAndModify: false 몽구스 6버전 이후 사용하지 않음
}).then(() => console.log('MongoDB 연결성공')).catch(err => console.log(err))

app.get('/', (req, res) => res.send('안녕하세요'))

app.post('/api/users/register', (req, res) => {
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

app.post('/api/users/login', (req, res) => {

  // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

    // 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인.
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})

    // 비밀번호 까지 맞다면 토큰을 생성하기.
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);

        // 토큰을 쿠키, 로컬스토리지 중에 저장한다. (쿠키에 저장)
        res.cookie("x_auth", user.token).status(200).json({ loginsuccess: true, userId: user._id })
      })
    })
  })
})

app.get('/api/users/auth', auth, (req, res) => {
  // 여기 까지 미들웨어를 통과해 왔다는 얘기는 Authentication 이 True 라는 말.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})