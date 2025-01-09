import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import DraftList from './pages/DraftList';
import AdminPanel from './pages/AdminPanel';
import ManuscriptManagement from './pages/ManuscriptManagement';
import MyManuscripts from './pages/MyManuscripts';
import DraftDetail from './pages/DraftDetail';
import ArticleDetail from "./pages/ArticleDetail";

function App() {
    return (
        <Router>
            <div className="app">
                <Header />
                <main className="main-content">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/"
                            element={
                                <PrivateRoute>
                                    <Home />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/drafts"
                            element={
                                <PrivateRoute>
                                    <DraftList />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/drafts/:id"
                            element={
                                <PrivateRoute>
                                    <DraftDetail />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/admin"
                            element={
                                <PrivateRoute>
                                    <AdminPanel />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/manuscripts"
                            element={
                                <PrivateRoute>
                                    <ManuscriptManagement />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/my-manuscripts"
                            element={
                                <PrivateRoute>
                                    <MyManuscripts />
                                </PrivateRoute>
                            }
                        />
                        <Route path="/article/:id" element={<ArticleDetail />} />
                        <Route path="/manuscripts/:id" element={<ArticleDetail />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;