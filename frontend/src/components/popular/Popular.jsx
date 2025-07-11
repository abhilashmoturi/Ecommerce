import React, { useEffect } from 'react'
import './Popular.css'
import Item from '../items/Item'
const Popular = () => {

  const[data_product,setData_product]=React.useState([]);

  useEffect(()=>{
    fetch('https://ecommerce-wc28.onrender.com/popularinwomen').then((res)=>res.json()).then((data)=>setData_product(data));
  },[])

  return (
    <div className='popular'>
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      <div className="popular-item">
        {data_product.map((item,i)=>{
            return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
        })}
      </div>
    </div>
  )
}

export default Popular
