import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from 'primereact/toast';
import { Button } from "primereact/button";
import { ProgressBar } from 'primereact/progressbar';
import './Signup.css'
import BASE_URL from "../../baseUrl";
import axios from "axios";
import { useUserContext } from "../../Context/user_context";


function Signup() {
  const [formVal, setFormVal] = useState({
    username : "",
    email : "",
    password : "",
    confirmPassword : ""
  });
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  //eslint-disable-next-line
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormVal({
      ...formVal,
      [name]: value,
    });
  };
  const context = useUserContext();

  const registerUser  = (e)=>{
    e.preventDefault();
    if(!formVal.username || !formVal.email || !formVal.password || !formVal.confirmPassword){
      toast.current.show({ severity: 'warn', summary: 'Missing required information', detail: 'Please fill all fields.' });
      return
    }
    // console.log(formVal); return;
    setLoading(true);
    axios.post(`${BASE_URL}user/register`, formVal)
    .then((res)=>{
      console.log(res);
      const cookies = new Cookies();
      let date = new Date();
      date.setTime(date.getTime()+(1*60*60*1000)); // 1hour
      cookies.set('authToken', res.data.token, {expires : date});
      localStorage.setItem('userId', res.data.userId);
      context.login_signup(res.data);
      setLoading(false);
      navigate('/')
    })
    .catch((err)=>{
      console.log(err);
      toast.current.show({ severity: 'error', summary: 'Error', detail: err.response.data.message});
    })
  }

  const googleRegisterUser = (resData)=>{
    setLoading(true);
    axios.post(`${BASE_URL}user/googleLogin`, {
      username : resData.name,
      email : resData.email,
      url : resData.picture
    })
    .then((res)=>{
      const cookies = new Cookies();
      let date = new Date();
      date.setTime(date.getTime()+(1*60*60*1000)); // 1hour
      cookies.set('authToken', res.data.token, {expires : date});
      localStorage.setItem('userId', res.data.userId);
      context.login_signup(res.data);
      setLoading(false);
      navigate('/')
    })
    .catch((err)=>{
      setLoading(false);
      toast.current.show({ severity: 'error', summary: 'Error', detail: err.response.data.message });
    })

  }

  return (
    <div className="loginwrapper">
      <Toast ref={toast} />
      <div className="form-container">
        {loading && <div className="loadingBar">
          <ProgressBar mode="indeterminate" style={{ height: '6px' }}></ProgressBar>
        </div> } 
        <div className="social-buttons p-fluid flex justify-content-center align-items-center w-full">
          <GoogleLogin shape="pill" size="large" text="continue_with" width="600px" theme="filled_blue"
            onSuccess={(credentialResponse) => {
              const response = jwtDecode(credentialResponse.credential);
              googleRegisterUser(response);
            }}
            onError={() => {
              toast.current.show({ severity: 'error', summary: 'Error', detail: 'Some internal error occured!' });
            }}
          />
        </div>
        <Divider layout="horizontal" align="center">
          <b>OR</b>
        </Divider>
        <form className="form">
          <div className="form-group p-fluid">
            <label htmlFor="email" className="flex align-items-center gap-2">
              <i className="pi pi-user"></i> Full name
            </label>
            <InputText
              v-model="value1"
              size="large"
              placeholder="Enter your full name..."
              required
              name = "username"
              value={formVal.username} onChange={handleChange}
            />
          </div>
          <div className="form-group p-fluid">
            <label htmlFor="email" className="flex align-items-center gap-2">
              <i className="pi pi-envelope"></i> Email
            </label>
            <InputText
              v-model="value1"
              size="large"
              required
              name = "email"
              placeholder="Enter your email here..."
              value={formVal.email} onChange={handleChange}
            />
          </div>

          <div className="passwordbox flex gap-3">
              <div className="form-group p-fluid">
                  <label htmlFor="password" className="flex align-items-center gap-2">
                  <i className="pi pi-lock"></i> Password
                  </label>
                  <Password
                    placeholder="Enter your password..."
                    value={formVal.password} onChange={handleChange}
                    className="p-inputtext-sm"
                    name = "password"
                    feedback={false}
                    required={true}
                    toggleMask={true}
                  />
              </div>
              <div className="form-group p-fluid">
                  <label htmlFor="password" className="flex align-items-center gap-2">
                  <i className="pi pi-lock"></i> Confirm password
                  </label>
                  <Password
                    value={formVal.confirmPassword} onChange={handleChange}
                    className="p-inputtext-sm"
                    name = "confirmPassword"
                    feedback={false}
                    toggleMask={true}
                  />
                  { (formVal.confirmPassword && formVal.password !== formVal.confirmPassword) && 
                  <div className="help text text-red-500" style={{fontSize : "0.8rem"}}>Not matching with password !</div>}
              </div>
          </div>

          <Button label={loading ? "Creating your account..." : "Create my account"} 
          disabled={loading || (!formVal.username || !formVal.email || !formVal.password || !formVal.confirmPassword || (formVal.password !== formVal.confirmPassword ))} onClick={registerUser}/>
        </form>

        <span>
          Already have an account ? &nbsp;
          <Link to="/login" className="forgot-password-link link">
            Login
          </Link>
        </span>
      </div>
    </div>
  )
}

export default Signup