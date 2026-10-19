import { CgNotes } from "react-icons/cg"
import { FaRegTrashAlt } from "react-icons/fa"
import { GrFavorite } from "react-icons/gr"
import { Link } from "react-router-dom"
import AddCategory from "./AddCategory"
import AddNotes from "./AddNotes"
import useCategories from "../hooks/useCategories"


function Sidebar() {
  const { categories } = useCategories()
  const links = [
    {
      title:"All notes",
      path:"dashboard",
      icon: CgNotes 
    },{
      title:"favourites",
      path:"favourites",
      icon: GrFavorite
    },{
      title:"trash",
      path:"trash",
      icon: FaRegTrashAlt
    }
  ]
  return (
    <div className="SidebarDiv">
      <br />
      <div className="notesSideBar">
        <AddNotes />
        <br />
        <AddCategory />
      </div>
      <div className="linksSidebar">
        <ul>
          {
            links.map((link)=>(
              <li key={link.title}>
                <link.icon className="linkIcon"/>
                <Link to={link.path}>{link.title}</Link>
              </li>
            ))
          }
        </ul>
      </div>
      <div className="categoriesSidebar">
        <h3>Categories</h3>
        <ul>
          {
            categories?.map((category)=>(
              <li key={category.id}>{category.title}</li>
            ))
          }
        </ul>
      </div>
      <div className="logoutSidebar"></div>
    </div>
  )
}

export default Sidebar