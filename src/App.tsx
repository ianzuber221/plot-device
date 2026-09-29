import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { LibraryPage } from "./pages/LibraryPage"
import { NewEntryPage } from "./pages/NewEntryPage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LibraryPage />} />
        <Route path="/new" element={<NewEntryPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
