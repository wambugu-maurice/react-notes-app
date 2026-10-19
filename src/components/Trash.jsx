import { collection, deleteDoc, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../../firebase"
import DOMPurify from 'dompurify'
import { RiDeleteBin6Line } from "react-icons/ri"
import { BsArrowCounterclockwise } from "react-icons/bs"
import Loader from "./Loader"
import toast from "react-hot-toast"


function Trash() {
  const[restore,setRestore]=useState([])
  const[error,setError]=useState("")
  const[loading,setLoading]=useState(true)

  useEffect(()=>{
    const deletedQuery = query(collection(db,"notes"),
                                          where("deletedAt","!=",null));
    const unsub = onSnapshot(deletedQuery,(snap)=>{
      setRestore(snap.docs.map((doc)=>({id: doc.id,...doc.data()})))
      setError("")
      setLoading(false)
    },(err)=>{
      setError(err.message)
      setLoading(false)
    }
  )


    return ()=> unsub()
  },[])

  async function handleRestore(id){
    const noteRef = doc(db,"notes",id);
    await updateDoc(noteRef,{deletedAt: null})
    toast.success("Note restored")
  }

  async function handleDeleteForever(id) {
    const noteRef = doc(db,"notes",id)
    await deleteDoc(noteRef)
    toast.success("Note deleted forever")
    
  }
  return (
    <div className="trashDiv">
      { error && <p className="errMsg">{error}</p>}
      { loading && <Loader />}
      {
        restore?.map((note)=>(
          <div className="trashCard" key={note.id}>
            <div className="trashTopSection">
                <h2>{note.title}</h2>
                    <div  dangerouslySetInnerHTML={{ 
                            __html: DOMPurify.sanitize(note.body)
                          }} />
                      </div>
                      <div className="trashBottomSection">
                         <p className="category">{note.category}</p>
                         <button className="deleteBtn" onClick={()=>handleDeleteForever(note.id)}><RiDeleteBin6Line className="deleteIcon" /> Delete forever</button><br/>
                         <button className="restoreBtn" onClick={()=>handleRestore(note.id)}><BsArrowCounterclockwise />Restore</button>
                      <p className="noteDate">{note.addedOn.toDate().toLocaleDateString()}</p>
                </div>
          </div>
          
        ))
      }
    </div>
  )
}

export default Trash