// eslint-disable-next-line
import React, { useRef, useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from 'primereact/toast';
import { Button } from "primereact/button";
import { ProgressBar } from 'primereact/progressbar';
import BASE_URL from "../../baseUrl";
import axios from "axios";
import Cookies from "universal-cookie";
import { useUserContext } from "../../Context/user_context";


function Login() {
  //  const userLogin = () => {};
  const [passwordValue, setPasswordValue] = useState("");
  const [email , setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const context = useUserContext();
  const navigate = useNavigate();

  const userLogin = (e)=>{

    e.preventDefault();

    if(!passwordValue || !email){
      toast.current.show({ severity: 'warn', summary: 'Missing required information', detail: 'Please fill all fields.' });
      return
    }
    setLoading(true);

    axios.post(`${BASE_URL}user/login`, {
      email : email, 
      password : passwordValue
    })
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
      setLoading(false);
      toast.current.show({ severity: 'error', summary: 'Error', detail: err.response.data.message });
    })

  }
  
  const userGoogleLogin = (resData)=>{
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
          <GoogleLogin
            shape="pill"
            theme="filled_blue"
            size="large"
            width="300px"
            ux_mode="popup"
            text="continue_with"
            onSuccess={(credentialResponse) => {
              const response = jwtDecode(credentialResponse.credential);
              userGoogleLogin(response);
            }}
            onError={() => {
              toast.current.show({ severity: 'error', summary: 'Error', detail: 'Some internal error occured!' });
            }}
          />
        </div>
        <div className="svglogo">
      
        </div>
        <Divider layout="horizontal" align="center">
          <b>OR</b>
        </Divider>
        <form className="form">
          <div className="form-group p-fluid">
            <label htmlFor="email" className="flex align-items-center gap-2">
              <i className="pi pi-envelope"></i> Email
            </label>
            <InputText
              v-model="value1"
              size="large"
              placeholder="Enter your email..."
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
            />
          </div>

          <div className="form-group p-fluid">
            <label htmlFor="password" className="flex align-items-center gap-2">
              <i className="pi pi-lock"></i> Password
            </label>
            <Password
              placeholder="Enter your password..."
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
              className="p-inputtext-sm"
              feedback={false}
              toggleMask={true}
            />
            <div className="help text-right">
              <a className="forgot-password-link link" href="none">
                Forgot Password ?
              </a>
            </div>
          </div>

          <Button label={loading ? "Checking for credentials..." : "Log In"} 
          disabled={loading || !email || !passwordValue} onClick={userLogin}/>
        </form>

        <span>
          Don't have any account ?{" "}
          <Link to="/signup" className="forgot-password-link link">
            Create account
          </Link>
        </span>
      </div>
    </div>
  );
}

export default Login;
