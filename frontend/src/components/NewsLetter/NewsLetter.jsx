import React from 'react'
import './NewsLetter.css'
const NewsLetter = () => {
  return (
    <div className='newsletter'>
      <h1>Get Exclusive Offers on your Email</h1>
      <p>Subscribe to our newsletter to stay updated</p>
      <div>
        <input type="email" placeholder='Your Email Id' />
        <button>subscribe</button>
      </div>
    </div>
  )
}

export default NewsLetter
