import React, { useState } from 'react'
import "../App.css"
// import "../index.css"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login=()=>{
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        setLoading(true);

        
        axios.post('https://yt-full-stack-clone-api.onrender.com/user/login',{
          email:email,
          password:password
        })  
        .then(res=>{
            setLoading(false);
            console.log('Success:', res.data);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userId', res.data._id);
            localStorage.setItem('channelName', res.data.channelName);
            localStorage.setItem('logoUrl', res.data.logoUrl);
            navigate('/dashboard');
        })
        .catch(err=>{
            setLoading(false);
            console.log(err.response.data.error);
            toast.error(err.response.data.error);
        })
    }
    return(
        <div className='main-wrapper'>
            <div className='wrapper-header'>
                <div className='brand'>
                    <img className="logo-image" alt='logo' src={require('../assets/logo.png')}/>
                    <h2 className='c-name'>StreamSphere</h2>
                </div>
            </div>
            <div className='page-body'>
                <form className='form-wrapper' onSubmit={submitHandler}>
                
                    <input required onChange={(e)=>{setEmail(e.target.value)}} type="email" placeholder="Email"/>
                    <input required onChange={(e)=>{setPassword(e.target.value)}} type="password" placeholder="Password"/>
              
                    <button type="submit">{loading ? 'Loading...' : 'Submit'}</button>

                    <Link to="/signup" className='Link'>Create your account</Link>
                </form>
            </div>
        </div>
    )
}

export default Login;
