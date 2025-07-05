import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-navbox">
            Description
        </div>
        <div className="descriptionbox-navbox fade">
            Reviews(122)
        </div>
      </div>
      <div className="descriptionbox-description">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos adipisci officia facere velit, dolorem expedita consequatur animi quia laborum eligendi voluptas harum quibusdam maxime rerum eos odio! Qui, corporis odit.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum fugiat aliquam libero qui a corrupti earum nulla. Hic similique, explicabo sit libero, praesentium reiciendis corrupti tempora, optio saepe voluptatibus consectetur?</p>
      </div>
    </div>
  )
}

export default DescriptionBox
