const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true, // 공백 자동제거
    unique: 1, // 이메일 중복 없음
    required: 'Please enter your email',
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
// 스키마가 유저 정보를 저장하기 전에 function을 실행
userSchema.pre('save', function( next ) {
  var user = this; // userSchema를 의미

  if(user.isModified('password')) { // 비밀번호를 바꿀 때만 암호화 
    // 비밀번호를 암호화 시킨다.
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if(err) return next(err);

      bcrypt.hash(user.password, salt, function(err, hash) {
        if(err) return next(err);
        user.password = hash;
        next()
      })
    });
  } else { // 비밀번호 이외의 정보를 바꿀 경우
    next()
  }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
  //plainPassword 1234567 암호화된 비밀번호 $2b$10$WZ08RSOVSgKhmWXX6Q0xIujaejON9/EzrA5Ch4IkZmPST9QRZjq0m
  bcrypt.compare(plainPassword, this.password, function(err, isMatch){
    if(err) return cb(err);
    cb(null, isMatch)
  })
}

userSchema.methods.generateToken = function(cb) {
  var user = this;
  // jsonwebtoken을 이용해서 token을 생성하기
  var token = jwt.sign(user._id.toHexString(), 'secretToken') // user._id + 'secretToken' = token

  user.token = token;
  user.save(function(err, user) {
    if(err) return cb(err);
    cb(null, user)
  })
  
}

const User = mongoose.model('User', userSchema)

module.exports = { User }