import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react"
import { db } from "../../firebase";

function useNotes() {
    const[notes,setNotes]=useState([]);
    const[error,setError]=useState("")
    const[loading,setLoading]=useState(true);

    useEffect(()=>{
        const getNotes = query(collection(db,"notes"),
                                orderBy("addedOn","desc"),
                                where("deletedAt","==",null));
        const unsubscribe = onSnapshot(getNotes,(snapshot)=>{
            const fetchedNotes = snapshot.docs.map((doc)=>({
                id: doc.id,...doc.data()
            }));
            setNotes(fetchedNotes)
            setLoading(false)
            setError("")
        },(err)=>{
            setError(err.message)
            setLoading(false)
        })

        return ()=> unsubscribe()
    },[])
  return {notes,error,loading}
}

export default useNotes