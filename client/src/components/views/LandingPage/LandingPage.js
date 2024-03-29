import React, { useEffect } from 'react'
import axios from 'axios'

function LandingPage() {
  // 렌딩 페이지에 들어오자 마자 실행
  useEffect(() => {
    axios.get('/api/hello') // 해당 위치로 get req를 보낸다
    .then(response => {console.log(response.data)}) // 보내졌을 경우 보내진 res를 콘솔로 보여준다
  }, [])

  return (
    <div style={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center'
      , width: '100%', height: '100vh'}}>
        <h2>시작 페이지</h2>
      </div>
  )
}

export default LandingPage