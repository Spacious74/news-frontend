import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './assets/themes/lara/lara-light/blue/theme.css'
import 'primeicons/primeicons.css';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import Homepage from './Components/Homepage/Homepage';
import Article from './Components/Article/Article';
import Category from './Components/Category/Category';
import PostArticle from './Admin-Components/PostArticle/PostArticle';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './Components/Login/Login';
import Signup from './Components/Register/Signup';
import { UserProvider } from './Context/user_context';

function App() {
  return (
    <UserProvider>
      <GoogleOAuthProvider clientId='322976796851-ilsuns31prl7dd1elvv46v9gluoad5ek.apps.googleusercontent.com'>
      <div className="App"> 
      <Router>
        <Navbar/>
        <Routes>
            <Route path='/' element={ <Homepage />}></Route>
          <Route path='/article/:articleId' element={ <Article />}></Route>
          <Route path='/category/:category' element={ <Category />}></Route>
          <Route path='/post-article' element={ <PostArticle/> } ></Route>
          <Route path='/login' element={ <Login/> } ></Route>
          <Route path='/signup' element={ <Signup/> } ></Route>
        </Routes>
      </Router>
      </div>
      </GoogleOAuthProvider>
    </UserProvider>

  );
}

export default App;
