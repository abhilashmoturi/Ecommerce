import React from 'react'
import { useContext } from 'react'
import {ShopContext} from '../context/ShopContext'
import { useParams } from 'react-router-dom'
import Breadcrum from '../components/Breadcrumps/Breadcrum'
import ProductDisplay from '../components/productdisplay/ProductDisplay'
import DescriptionBox from '../components/DescriptionBox/DescriptionBox'
import RelatedProducts from '../components/RelatedProducts/RelatedProducts'
const Product = () => {
  const {all_product}=useContext(ShopContext);
  const {productId}=useParams();
//   console.log('productId:', productId);
// console.log('all_product:', all_product);

  const product=all_product.find((e)=>e.id===Number(productId));
  return (
    <div>
      <Breadcrum product={product}/>
      <ProductDisplay product={product}/>
      <DescriptionBox/>
      <RelatedProducts/>
    </div>
  )
}

export default Product
