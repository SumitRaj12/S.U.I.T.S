import { createContext, useState,useEffect } from "react";

export const Context = createContext();

const Provider=(props)=>{
    const [credId,setCredId]=useState(null);
    const [secret,setSecret]=useState(null)
    const updateId=(id)=>{
        setCredId(id)
    }
    const updateSec=(sec)=>{
        setSecret(sec)
    }
    useEffect(()=>{
        setCredId(localStorage.getItem('id') || null)
        setSecret(localStorage.getItem('sec')||null)
    },[])
    return(
        <Context.Provider value={{credId,secret,setCredId:updateId,setSecret:updateSec}}>{props.children}</Context.Provider>
    )
}

export default Provider;