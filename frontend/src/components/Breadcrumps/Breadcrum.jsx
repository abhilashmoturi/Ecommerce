import React from 'react'
import './Breadcrumps.css'
import arrow_icon from '../assets/arrow1.png'
const Breadcrum = (props) => {
    const {product}=props;
  return (
    <div className='breadcrum'>
      HOME <img src={arrow_icon} width={10} alt="1111" /> SHOP <img src={arrow_icon} width={10} alt="" /> 
      {product.category}
      <img src={arrow_icon} width={10} alt="111" />
      {product.name}
    </div>
  )
}

export default Breadcrum
