import { collection, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../../firebase"


function useCategories() {
    const[categories,setCategories]=useState([])
    const[error,setError]=useState("")
    const[loading,setLoading]=useState(true)

    useEffect(()=>{
        const getCategories = collection(db,"categories");
        const unsubscribe = onSnapshot(getCategories,(snapshot)=>{
            const storedCategories = snapshot.docs.map((doc)=>({
                id: doc.id, ...doc.data()
            }))
            setCategories(storedCategories)
            setLoading(false)
            setError("")
        },(err)=>{
            setError(err.message)
            setLoading(false)
        })

        return ()=> unsubscribe()
    },[])
  return {categories,error,loading}
}

export default useCategories