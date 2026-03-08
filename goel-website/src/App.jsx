import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar             from './components/Navbar'
import ToastNotifications from './components/ToastNotifications'
import KeyboardShortcuts  from './components/KeyboardShortcuts'
import Home               from './pages/Home'
import About              from './pages/About'
import NotFound           from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <ToastNotifications />
      <KeyboardShortcuts />
      <Routes>
        <Route path="/"      element={<Home />}     />
        <Route path="/about" element={<About />}    />
        <Route path="*"      element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
