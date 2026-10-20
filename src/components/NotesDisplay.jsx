import { Link } from "react-router-dom"
import useNotes from "../hooks/useNotes"
import Loader from "./Loader"
import DOMPurify from "dompurify"




function NotesDisplay({ searchQuery, category }) {
  const{notes,error,loading} = useNotes()

  const filteredNotes = notes.filter((note)=>{
    const searchedNotes = note.title.toLowerCase().includes(searchQuery.toLowerCase())
    const categoryNotes = category === "all" || category === note.category

    return searchedNotes && categoryNotes
  })


  return (
    <div className="notesDiv">
      { error && <p className="errMsg">{error}</p>}

      {
        loading ? <Loader /> :
        filteredNotes.length > 0 ? filteredNotes.map((note)=>(
          <Link key={note.id} to={`/notes/${note.id}`} className="notesCard">
            <div className="noteTopSection">
              <h2>{note.title}</h2>
              <div dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(note.body)
              }} />
            </div>
            <div className="noteBottomSection">
              <p className="category">{note.category}</p>
              <p className="noteDate">{note.addedOn.toDate().toLocaleDateString()}</p>
            </div>
          </Link>
        )) :
        !error && (
          <p className="emptyNotes">
            {category !== "all"
              ? `No notes found in "${category}".`
              : searchQuery
                ? "No notes match your search."
                : "No notes yet."}
          </p>
        )
      }
    </div>
  )
}

export default NotesDisplay