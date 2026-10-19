import {  doc, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { db } from "../../firebase"
import Loader from "./Loader"
import DOMPurify from 'dompurify'
import { IoIosArrowRoundBack } from "react-icons/io"
import { FcLike } from "react-icons/fc"
import { FaRegHeart } from "react-icons/fa"
import { RiDeleteBinLine } from "react-icons/ri"
import toast from "react-hot-toast"


function NoteDetail() {
    const { noteId } = useParams()
    const[content,setContent]=useState(null)
    const[error,setError]=useState("")
    const[loading,setLoading]=useState(true)
    const[,setLikeNote]=useState(false)
   
    const navigate = useNavigate()

   async function handleLiked(noteId) {
        const likeNote = !content.isLiked;
        setLikeNote(likeNote);
        try {
          await updateDoc(doc(db, "notes", noteId), { isLiked: likeNote });

          if (likeNote) {
            
            toast.success("Note added to favourites");
          } else {
            toast("Note removed from favourites"); 
          }
        } catch (err) {
          setError(err.message)
          setLikeNote(!likeNote);
          toast.error("Couldn't update favourites");
        }
    }

    async function handleDelete(id) {
      const noteRef = doc(db,"notes",id)
        updateDoc(noteRef,{deletedAt: serverTimestamp() }); 
        toast.success("Note deleted")
        navigate("/dashboard") 
    }

    useEffect(()=>{
        const noteRef = doc(db,"notes",noteId)
        const unsub = onSnapshot(noteRef,(snap)=>{
            setContent(snap.exists() ? {id: snap.id,...snap.data()}:null)
            setLoading(false)
            setError("")
        },(err)=>{
            setError(err.message)
            setLoading(false)
        })
        return ()=> unsub()

    },[noteId])

    if(loading) return <Loader />
    if(error) return <p className="errMsg">{error}</p>
    if(!content) return <p>No note details available</p>
  
   
  return (
    <div className="noteDetail">
      <Link to="/dashboard" className="backToNotes"><IoIosArrowRoundBack />Back to notes</Link>
      <article className="note">
        <div className="noteHeader">
          <h2>{content.title}</h2>
          <div className="body" dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(content.body)
          }} />
        </div>
        <div className="noteBottomSection">
          <p className="category">{content.category}</p>
          <button onClick={()=> handleLiked(content.id)}>{content.isLiked ? <FcLike />: <FaRegHeart />}</button>
          <button onClick={()=> handleDelete(content.id)} ><RiDeleteBinLine /></button>
          <p className="noteDate">{content.addedOn.toDate().toLocaleDateString()}</p>
        </div>
      </article>
    </div>
  )
}

export default NoteDetail