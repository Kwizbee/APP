import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from './images/forretningslogo.png';
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import BoardUser from "./components/BoardUser";
import BoardModerator from "./components/BoardModerator";
import BoardAdmin from "./components/BoardAdmin";

// import AuthVerify from "./common/AuthVerify";
import EventBus from "./common/EventBus";

const App = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    setShowModeratorBoard(false);
    setShowAdminBoard(false);
    setCurrentUser(undefined);
  };

  return (
    <div>
    <header class="primary">
        <div class="navcontainer">
            <section class="navsection">
                <nav class="primarynav">
                    <ul>
                        <Link to={"/home"} className="nav-link" class="headerbuttons"><i class="fa-solid fa-house"></i> Home</Link>
                        <Link to={"/quiz"} className="nav-link" class="headerbuttons"><i class="fa-solid fa-comment"></i> Quiz</Link>
                        <Link to={"/faq"} className="nav-link" class="headerbuttons"><i class="fa-solid fa-circle-info"></i> FAQ</Link>
                        {showModeratorBoard && (<Link to={"/mod"} className="nav-link" class="headerbuttons"> Mod</Link>)}
                        {showAdminBoard && (<Link to={"/admin"} className="nav-link" class="headerbuttons"> Admin</Link>)}
                        {currentUser && (<Link to={"/user"} className="nav-link" class="headerbuttons"> User Content</Link>)}
                    </ul>
                </nav>
                <div class="logocontainer">
                    <img src={logo} alt="LOGO"/>
                </div>
                <nav class="accountnav">
                    <ul>
                        <Link to={"/support"} className="nav-link" class="headerbuttons"><i class="fa-solid fa-bell-concierge"></i> Support</Link>
                        <Link to={"/shopping"} className="nav-link" class="headerbuttons"><i class="fa-solid fa-cart-shopping"></i> Shopping cart</Link>
                        {currentUser ? (
                        <>
                        <Link to={"/profile"} className="nav-link" class="headerbuttons"><i class="fa-solid fa-user"></i> {currentUser.username}</Link>
                        <a href="/login" className="nav-link" onClick={logOut} class="headerbuttons"> Log out</a>
                        </>
                          ) : (
                        <>
                        <Link to={"/login"} className="nav-link" class="headerbuttons"> Login</Link>
                        <Link to={"/register"} className="nav-link" class="headerbuttons"> Sign Up</Link>
                        </>
                        )}
                    </ul>
                </nav>
            </section>
        </div>
    </header>
      <div>
        <Routes>
          <Route exact path={"/"} element={<Home />} />
          <Route exact path={"/home"} element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route path="/user" element={<BoardUser />} />
          <Route path="/mod" element={<BoardModerator />} />
          <Route path="/admin" element={<BoardAdmin />} />
        </Routes>
      </div>

      {/* <AuthVerify logOut={logOut}/> */}
    </div>
  );
};

export default App;
