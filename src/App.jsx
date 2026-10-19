import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import ProtectedLayout from './pages/ProtectedLayout'
import Layout from './pages/Layout'
import Dashboard from './components/Dashboard'
import Signup from './pages/Signup'
import Login from './pages/Login'
import "react-quill-new/dist/quill.snow.css"
import NoteDetail from './components/NoteDetail'
import Favourites from './components/Favourites'
import Trash from './components/Trash'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route element={<ProtectedLayout />}>
        <Route path='' element={<Layout />}>
          <Route path='dashboard'  element={<Dashboard />}/>
          <Route path='notes/:noteId' element={<NoteDetail />} />
          <Route path='/favourites' element={<Favourites />} />
          <Route path='/trash' element={<Trash />} />
        </Route>
      </Route>
      <Route path='signup' element={<Signup />}/>
        <Route path='login' element={<Login />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App