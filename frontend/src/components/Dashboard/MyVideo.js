import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../../App.css'

const MyVideo = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getOwnVideo()
  }, [])

  const getOwnVideo = () => {
    setLoading(true)
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')

    const url = userId
      ? `https://yt-full-stack-clone-api.onrender.com/video/own-video?userId=${userId}`
      : 'https://yt-full-stack-clone-api.onrender.com/video/own-video'

    axios.get(url, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(res => {
        setLoading(false)
        if (res.data && Array.isArray(res.data)) {
          setVideos(res.data)
        } else if (res.data?.videos) {
          setVideos(res.data.videos)
        } else {
          setVideos([])
        }
      })
      .catch(err => {
        setLoading(false)
        console.log('Error:', err.response?.data || err.message)
        setVideos([])
      })
  }

  return (
    <div className='my-videos-container'>
      <h2 className='page-title'>My Videos</h2>
      {loading ? (
        <div className='loading-container'>
          <div className='loading-spinner'></div>
          <p>Loading your videos...</p>
        </div>
      ) : videos.length === 0 ? (
        <div className='empty-state'>
          <div className='empty-icon'>📹</div>
          <h3>No videos yet</h3>
          <p>Upload your first video to get started!</p>
        </div>
      ) : (
        <div className='videos-grid'>
          {videos.map((video, index) => (
            <div key={video._id || index} className='video-card'>
              <div className='video-thumbnail'>
                <img
                  src={video.thumbnail || 'https://via.placeholder.com/320x180'}
                  alt={video.title}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/320x180'
                  }}
                />
              </div>
              <div className='video-info'>
                <h3 className='video-title'>{video.title || 'Untitled Video'}</h3>
                <p className='video-description'>{video.description || 'No description'}</p>
                <div className='video-meta'>
                  <span className='video-category'>{video.category || 'General'}</span>
                  {video.views && <span className='video-views'>{video.views} views</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyVideo
