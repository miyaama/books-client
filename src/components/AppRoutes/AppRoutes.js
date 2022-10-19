import { Routes, Route } from "react-router-dom";

import AuthorizationPage from "../../pages/AuthorizationPage/";
import LoginPage from "../../pages/LoginPage";
import UserPage from "../../pages/UserPage/";
import HomePage from "../../pages/HomePage";
import CollectionPage from "../../pages/CollectionPage";
import AdminPage from "../../pages/AdminPage";
import AddCollectionPage from "../../pages/AddCollectionPage";
import BookPage from "../../pages/BookPage"


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/authorization" element={<AuthorizationPage />} />
      <Route path="/user/:id" element={<UserPage />} />
      <Route path="/collection/:collectionId" element={<CollectionPage />} />
      <Route path="/book/:bookId" element={<BookPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/user/:id/create" element={<AddCollectionPage />} />
      <Route path="/collection/:id/update" element={<AddCollectionPage />} />
    </Routes>
  );
}
