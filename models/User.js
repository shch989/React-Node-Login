const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true, // 공백 자동제거
    unique: 1 // 이메일 중복 없음
  },
  password: {
    type: String,
    minlength: 5
  },
  lastname: {
    type: String,
    maxlength: 50
  },
  role: { // 관리자 & 유저
    type: Number,
    default: 0
  },
  image: String,
  token: {
    type: String
  },
  tokenExp: { // 토큰 유효기간
    type: Number
  }
})

const User = mongoose.model('User', userSchema)

module.exports = { User }