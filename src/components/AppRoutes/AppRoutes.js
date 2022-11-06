import { Routes, Route } from "react-router-dom";

import AuthorizationPage from "../../pages/AuthorizationPage/";
import LoginPage from "../../pages/LoginPage";
import UserPage from "../../pages/UserPage/";
import HomePage from "../../pages/HomePage";
import CollectionPage from "../../pages/CollectionPage";
import AdminPage from "../../pages/AdminPage";
import AddCollectionPage from "../../pages/AddCollectionPage";
import BookPage from "../../pages/BookPage";
import SearchPage from "../../pages/SearchPage";
import {
  HOME,
  LOGIN,
  AUTHORIZATION,
  USER,
  COLLECTION,
  BOOK,
  ADMIN,
  CREATE_COLLECTION,
  UPDATE_COLLECTION,
  SEARCH,
} from "../../shared/constants/";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={HOME} element={<HomePage />} />
      <Route path={LOGIN} element={<LoginPage />} />
      <Route path={AUTHORIZATION} element={<AuthorizationPage />} />
      <Route path={USER} element={<UserPage />} />
      <Route path={COLLECTION} element={<CollectionPage />} />
      <Route path={BOOK} element={<BookPage />} />
      <Route path={ADMIN} element={<AdminPage />} />
      <Route path={CREATE_COLLECTION} element={<AddCollectionPage />} />
      <Route path={UPDATE_COLLECTION} element={<AddCollectionPage />} />
      <Route path={SEARCH} element={<SearchPage />} />
    </Routes>
  );
}
