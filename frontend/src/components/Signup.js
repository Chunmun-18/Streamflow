import React, { useState } from 'react'
import "../App.css"
// import "../index.css"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
const Signup=()=>{
    const [channelName, setChannelName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [logo, setLogo] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const fileHandler = (e) => {
        setLogo(e.target.files[0]);
        setImageUrl(URL.createObjectURL(e.target.files[0]));
    }
    const submitHandler = (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('channelName', channelName);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('password', password);
        
        if (logo) {
            formData.append('logo', logo);
        }
        
        axios.post('https://yt-full-stack-clone-api.onrender.com/user/signup',formData)
        .then(res=>{
            setLoading(false);
            console.log('Success:', res.data);
            navigate('/login');
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
                <input required onChange={(e)=>{setChannelName(e.target.value)}} type="text" placeholder="Channel Name"/>
                    <input required onChange={(e)=>{setEmail(e.target.value)}} type="email" placeholder="Email"/>
                    <input required onChange={(e)=>{setPhone(e.target.value)}} type="text" placeholder="Phone"/>
                    <input required onChange={(e)=>{setPassword(e.target.value)}} type="password" placeholder="Password"/>
                    <input required onChange={fileHandler} type="file"/>
                    <img className='preview-image' src={imageUrl} alt="logo-image" />
                    <button type="submit">{loading ? 'Loading...' : 'Submit'}</button>
                    <Link to="/login" className='Link'>Login with your account</Link>
                </form>
            </div>
        </div>
    )
}

export default Signup;