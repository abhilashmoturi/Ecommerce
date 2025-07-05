import React, { useRef } from 'react'
import "./navbar.css"
import logo from "../assets/logo.png"
import carticon from "../assets/cart_icon.png"
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { ShopContext } from '../../context/ShopContext'
import nav_dropdown from '../assets/nav_dropdown.png'

const Navbar = () => {
  const[menu,setMenu]=useState()
  const {getItemsInCart}=useContext(ShopContext);
  const menuRef=useRef();
  const dropdown_toggle=(e)=>{
    menuRef.current.classList.toggle("nav-menu-visble");
    e.target.classList.toggle("open");
  }
  return (
    <div className='navbar'>
      <div className='nav-logo'>
        <img src={logo} alt="" />
        <p>SHOPPER</p>
      </div>
      <img className='nav-dropdown' onClick={dropdown_toggle} src={nav_dropdown} alt="" />
      <ul ref={menuRef} className='nav-menu'>
        <li onClick={()=>setMenu("shop")}><Link style={{textDecoration:"none"}} to={"/"}>Shop</Link> {menu==="shop"?<hr/>:<></>}</li>
        <li onClick={()=>setMenu("mens")}><Link style={{textDecoration:'none'}} to={"/mens"}>Men</Link> {menu==="mens"?<hr/>:<></>}</li>
        <li onClick={()=>setMenu("womens")}><Link style={{textDecoration:"none"}} to={"/womens"}>Women</Link>{menu==="womens"?<hr/>:<></>}</li>
        <li onClick={()=>setMenu("kids")}><Link style={{textDecoration:"none"}} to={"/kids"}>Kids</Link>{menu==="kids"?<hr/>:<></>}</li>
      </ul>
      <div className='nav-login-cart'>
        {localStorage.getItem("auth-token")?<button onClick={()=>{localStorage.removeItem("auth-token");window.location.replace('/')}}>Logout</button>
        :<Link to="/login"><button>Login</button></Link>}
        <Link to='/cart'> <img src={carticon} alt="" /> </Link>
        <div className="nav-cart-count">{getItemsInCart()}</div>
      </div>
    </div>
  )
}

export default Navbar
