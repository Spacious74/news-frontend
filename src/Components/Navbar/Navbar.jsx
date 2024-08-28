import React, { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import logo from "../../assets/kt-logo.png";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';
import BASE_URL from "../../baseUrl";
import axios from "axios";
import { useUserContext } from "../../Context/user_context";


function Navbar() {
  const label = [
    "होम",
    "ताज़ा",
    "लोकसभा चुनाव 2024",
    "मनोरंजन",
    "क्रिकेट",
    "बिजनेस",
    "शिक्षा",
    "टेक ज्ञान",
  ];
  const categories = [
    "Home",
    "Latest",
    "Election",
    "Entertainment",
    "Cricket",
    "Business",
    "Education",
    "Technology"
  ]
  const navigate = useNavigate();
  const toast = useRef();
  const [loggedIn, setLoggedIn] = useState(false);
  const {user, isLoggedIn} = useUserContext();

  const redirect = ()=>{
    // navigate('/post-article');
    navigate('/login');
  }
  const getProfileData = ()=>{
    axios.get(`${BASE_URL}user/get-user/${user.userId}`)
    .then((res)=>{
      console.log(res);
    })
    .catch((err)=>{
      console.log(err);
      toast.current.show({ severity: 'error', summary: 'Error', detail: err.response.data.message});
    })
  }
  // eslint-disable-next-line
  useEffect(()=>{
    if(isLoggedIn()){
      setLoggedIn(true)
      console.log(user);
    }else{
      setLoggedIn(false);
    }
  },[])


  return (
    <>
    <Toast ref={toast} />
    <div className="container">
      <nav className="flex">
        <div className="left flex">
          <div className="logocont flex">
            <img src={logo} alt="" className="logoimg" />
          </div>
          <div className="logotext">
            <span style={{ fontWeight: "bolder" }}>कानपुर</span>
            <span>
              <i>today</i>
            </span>
          </div>
        </div>
        <div className="right flex align-items-center">
          <IconField iconPosition="right" className="flex align-items-center searchBar ">
            <InputIcon className="pi pi-search"> </InputIcon>
            <InputText  className="p-inputtext-sm" v-model="value1" placeholder="Search anything..." />
          </IconField>
          <InputIcon className="pi pi-search searchIcon"> </InputIcon>
          <div className="buttons flex align-items-center gap-2">
            {/* <Button icon="pi pi-plus" label="Create" size="small" onClick={redirect} /> */}

            {/* LOGIN BUTTON */}
            {!loggedIn && <Button icon="pi pi-sign-in" label="Login" size="small" onClick={redirect} />}

            {/* PROFILE */}
            {loggedIn && <Button icon="pi pi-user" outlined="true" size="small" onClick={getProfileData} />}

          </div>
        </div>
      </nav>
      <div className="categories">
        {label.map((name, i) => {
          return (
            (i<1) ? 
            <NavLink to={'/'} key={i} style={{textDecoration : "none"}}>
              <span className="cate">
                {name}
              </span>
            </NavLink> :
            <NavLink to={'/category/'+categories[i]} key={i} style={{textDecoration : "none"}}>
              <span className="cate">
                {name}
              </span>
            </NavLink>
          );
        })}
      </div>
    </div>
    </>
  );
}

export default Navbar;

