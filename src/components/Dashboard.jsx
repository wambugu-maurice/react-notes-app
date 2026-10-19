import NotesDisplay from "./NotesDisplay"
import Search from "./Search"
import { useState } from "react"


function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("all")

  return (
    <div className="dashboardDiv">
      <Search
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        category={category}
        setCategory={setCategory}
      />
      <NotesDisplay searchQuery={searchQuery} category={category} />
    </div>
  )
}

export default Dashboard