import { useEffect, useState } from "react"
import { db } from "../../firebase"
import { collection, onSnapshot } from "firebase/firestore"
import Loader from "./Loader"
import { Link } from "react-router-dom"
import DOMPurify from "dompurify"


function Favourites() {
  const[likedNotes,setLikedNotes]=useState([])
  const[error,setError]=useState("")
  const[loading,setLoading]=useState(true)

  useEffect(()=>{
    const notesQuery = collection(db,"notes");
    const unsub = onSnapshot(notesQuery,(snap)=>{
      setLikedNotes(snap.docs.map((doc)=>({
        id: doc.id, ...doc.data()
      })))
      setLoading(false)
      setError("")
    },(err)=>{
      setError(err.message)
      setLoading(false)
    }
  )
    return ()=> unsub()
  },[likedNotes])

  const filteredFavourites = likedNotes?.filter((notes)=> notes.isLiked === true)
  return (
     <div className="notesDiv">
      { error && <p className="errMsg">{error}</p>}

      {
        loading ? <Loader /> : (
          filteredFavourites?.length === 0 ? <p>No Favourites</p> :
           (
            filteredFavourites?.map((note)=>(
          <Link key={note.id} to={`/notes/${note.id}`} className="favCard">
            <div className="noteTopSection">
              <h2>{note.title}</h2>
              <div  dangerouslySetInnerHTML={{ 
                __html: DOMPurify.sanitize(note.body)
              }} />
            </div>
            <div className="noteBottomSection">
              <p className="category">{note.category}</p>
              <p className="noteDate">{note.addedOn.toDate().toLocaleDateString()}</p>
            </div>
          </Link>
        ))
           )
        )
        }
    </div>
  )
}

export default Favourites