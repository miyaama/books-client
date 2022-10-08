import { Routes, Route } from "react-router-dom";

import AuthorizationPage from "../../pages/AuthorizationPage/";
import LoginPage from "../../pages/LoginPage";
import UserPage from "../../pages/UserPage/";
import HomePage from "../../pages/HomePage";
import CollectionPage from "../../pages/CollectionPage";
import AdminPage from "../../pages/AdminPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/authorization" element={<AuthorizationPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/user" element={<UserPage />} />
      <Route path="/collection/:collectionId" element={<CollectionPage />} />
      <Route path="/book/:bookId" element={<CollectionPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}
