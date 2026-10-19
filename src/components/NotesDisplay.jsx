import { Link } from "react-router-dom"
import useNotes from "../hooks/useNotes"
import Loader from "./Loader"
import DOMPurify from "dompurify"




function NotesDisplay() {
  const{notes,error,loading} = useNotes()
  return (
    <div className="notesDiv">
      { error && <p className="errMsg">{error}</p>}

      {
        loading ? <Loader /> :
        notes?.map((note)=>(
          <Link key={note.id} to={`/notes/${note.id}`} className="notesCard">
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
        ))}
    </div>
  )
}

export default NotesDisplay