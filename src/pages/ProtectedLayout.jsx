import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom"
import Loader from "../components/Loader"


function ProtectedLayout() {
  const[loading,setLoading]=useState(true)
  const[error,setError]=useState("")
  const[authenticated,setAuthenticated]=useState(false)

  const auth = getAuth()

  useEffect(()=>{
   const unsubscribe = onAuthStateChanged(auth,(user)=>{
          setLoading(false)
          setAuthenticated(!!user)
        },(err)=>{
          setError(err.message)
        })
          return ()=> unsubscribe()
        },[auth])
        
  if(loading) return <Loader />
  if(!authenticated) return <Navigate to='/login' replace={true} />
  

  return (
    <>
      { error && <p>{error}</p>}
      <Outlet />
    </>
  )
}

export default ProtectedLayout