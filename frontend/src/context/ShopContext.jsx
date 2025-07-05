import React, { createContext, useEffect } from "react";

import { useState } from "react";

export const ShopContext=createContext(null);

const getDefaultCart=()=>{
    let cart={};
    for(let i=0;i<300+1;i++){
        cart[i]=0;
    }
    return cart;
   }

const ShopContextProvider = (props) => {


    const [all_product,setAllProducts]=useState([]);

    const [authToken, setAuthToken] = useState(localStorage.getItem("auth-token"));

    useEffect(()=>{
        fetch('https://ecommerce-wc28.onrender.com//allproducts').then((res)=>res.json()).then((data)=>setAllProducts(data));
        if(localStorage.getItem('auth-token')){
            setAuthToken(localStorage.getItem('auth-token'));
            fetch('https://ecommerce-wc28.onrender.com//getcart', {
                method:'GET',
                headers: {
                    Accept:"application/form-data",
                    'auth-token':`${localStorage.getItem("auth-token")}`,
                    'Content-Type':'application/json',
                },
            })
            .then((response)=>response.json())
            .then((data)=>setCartItem(data));
        }
    },[authToken])  

    const [cartItems,setCartItem]=useState(getDefaultCart());
    const getTotalCartAmount=()=>{
        let totalAmount=0;
        for(const item in cartItems){
            if(cartItems[item]>0){
                let itemInfo=all_product.find((product)=>product.id===Number(item));
                totalAmount+=itemInfo.new_price*cartItems[item];
            }
        }
        return totalAmount;
    }
    const getItemsInCart=()=>{
        let sum=0;
        for(const item in cartItems){
            sum=sum+cartItems[item];
        }
        return sum;
    }

   const addToCart=(itemId)=>{
    setCartItem((prev)=>({...prev,[itemId]:prev[itemId]+1}));
    if(localStorage.getItem("auth-token")){
        fetch('https://ecommerce-wc28.onrender.com//addtocart', {
            method:'POST',
            headers: {
                Accept:"application/form-data",
                'auth-token':`${localStorage.getItem("auth-token")}`,
                'Content-Type':'application/json',
            },
            body:JSON.stringify({"itemId":itemId})
        })
        .then((response)=>response.json())
        .then((data)=>console.log(data));
    }
   }
   const removeFromCart=(itemId)=>{
    setCartItem((prev)=>({...prev,[itemId]:prev[itemId]-1}
    ))
    if(localStorage.getItem('auth-token')){
        fetch('https://ecommerce-wc28.onrender.com//removefromcart', {
            method:'POST',
            headers: {
                Accept:"application/form-data",
                'auth-token':`${localStorage.getItem("auth-token")}`,
                'Content-Type':'application/json',
            },
            body:JSON.stringify({"itemId":itemId})
        })
        .then((response)=>response.json())
        .then((data)=>console.log(data));
    }
   }

   const contextvalue={all_product,cartItems,addToCart,removeFromCart,getTotalCartAmount,getItemsInCart};

   return(
    <ShopContext.Provider value={contextvalue}>
        {props.children}
    </ShopContext.Provider>
   )
}


export default ShopContextProvider;