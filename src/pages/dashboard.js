import React from "react";
import connect from "../lib/database"
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";
import { getCookie, deleteCookie } from "cookies-next";
import User from "../models/User";

 function Dashboard({name, email}) {
  const router = useRouter();

  const logout = () =>{
    deleteCookie("token");
    router.replace("/")
  }

    return(
        <>
        <div>DASHBOARD</div>
        <div>Welcome {name}</div>
        <div>{email}</div>
        <button onClick={logout}>Logout</button>
        </>
        
    )
 }

 export async function getServerSideProps({ req, res}){
    try{
   await connect();
   const token = getCookie('token',{req,res});
   if(!token) return { redirect: {destination: '/'}}

   const verified = await jwt.verify(token, process.env.JWT_SECRET);
   const obj = await User.findOne({_id: verified.id});
   if(!obj) return { redirect: {destination: '/'}}
   return{
    props: {
        email: obj.email,
        name: obj.name
    }
   }

    }catch(err){
        deleteCookie('token',{req, res})
        return { redirect: {destination: '/'}}
    }
 }
 
 export default Dashboard;