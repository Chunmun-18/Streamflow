import React from 'react'
import '../../App.css'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate()
  const logoUrl = localStorage.getItem('logoUrl')
  const channelName = localStorage.getItem('channelName') || 'Your Channel'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('channelName')
    localStorage.removeItem('logoUrl')
    navigate('/login')
  }

  return (
    <div className='dashboard-container'>
        <div className='side-nav'> 
            <div className='profile-container'>
                {logoUrl ? (
                  <img 
                    src={logoUrl} 
                    alt="profile"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div 
                  className="profile-placeholder" 
                  style={{ display: logoUrl ? 'none' : 'flex' }}
                >
                  {channelName.charAt(0).toUpperCase()}
                </div>
                <h2>{channelName}</h2>
            </div>
            <div className='menu-container'>
                <NavLink to='/dashboard/home' end>Home</NavLink>
                <NavLink to='/dashboard/my-videos'>My Videos</NavLink>
                <NavLink to='/dashboard/upload'>Upload Video</NavLink>
                <NavLink to='/login' onClick={handleLogout}>Logout</NavLink>
            </div>
        </div>
        <div className='content-container'>
            <Outlet/>
        </div>
    </div>
  )
}

export default Dashboard
