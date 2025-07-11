import React, { useEffect } from 'react'
import './ListProduct.css'
import remove_icon from '../../assets/cross_icon.png'

const ListProduct = () => {

  const [allproducts,setAllProducts]=React.useState([]);
  const fetchInfo=async()=>{
    await fetch('http://localhost:4000/allproducts')
    .then((resp)=>resp.json())
    .then((data)=>{setAllProducts(data)});

  }

  useEffect(()=>{
    fetchInfo();
  },[])


  const removeProduct=async(id)=>{
    await fetch('http://localhost:4000/removeproduct',{
      method:'POST',
      headers:{
        Accept:'application/json',
      'Content-Type':'application/json',
    },
    body:JSON.stringify({id:id})
  })
  await fetchInfo();
  }

  return (
    <div className='list-product'>
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        {allproducts.map((product,index)=>{
          return <><div key={index} className="listproduct-format-main listproduct-format">
            <img className='listproduct-product-icon'src={product.image} alt="" />
            <p>{product.name}</p>
            <p>${product.old_price}</p>
            <p>${product.new_price}</p>
            <p>{product.category}</p>
            <img className='listproduct-remove-icon' onClick={()=>{removeProduct(product.id)}} src={remove_icon} alt="" />
          </div>
          </>
        })}
        </div>
    </div>
  )
}

export default ListProduct;
