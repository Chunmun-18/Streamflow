import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../../App.css'

const Home = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getAllVideos()
  }, [])

  const getAllVideos = () => {
    setLoading(true)
    axios.get('https://yt-full-stack-clone-api.onrender.com/video/all-videos')
      .then(res => {
        setLoading(false)
        if (res.data && Array.isArray(res.data)) {
          setVideos(res.data)
        } else if (res.data?.videos) {
          setVideos(res.data.videos)
        }
      })
      .catch(err => {
        setLoading(false)
        console.log('Error fetching videos:', err)
        // Set mock data for UI demonstration
        setVideos([
          {
            _id: '1',
            title: 'Amazing Tech Review',
            description: 'Reviewing the latest technology trends',
            thumbnail: 'https://via.placeholder.com/320x180',
            channelName: 'Tech Channel',
            views: '1.2M',
            category: 'Technology'
          },
          {
            _id: '2',
            title: 'Cooking Tutorial',
            description: 'Learn to cook amazing dishes',
            thumbnail: 'https://via.placeholder.com/320x180',
            channelName: 'Chef Master',
            views: '850K',
            category: 'Entertainment'
          },
          {
            _id: '3',
            title: 'Science Explained',
            description: 'Understanding complex scientific concepts',
            thumbnail: 'https://via.placeholder.com/320x180',
            channelName: 'Science Hub',
            views: '2.1M',
            category: 'Science'
          }
        ])
      })
  }

  return (
    <div className='home-container'>
      <h2 className='page-title'>Explore Videos</h2>
      {loading ? (
        <div className='loading-container'>
          <div className='loading-spinner'></div>
          <p>Loading videos...</p>
        </div>
      ) : videos.length === 0 ? (
        <div className='empty-state'>
          <p>No videos available</p>
        </div>
      ) : (
        <div className='videos-grid'>
          {videos.map((video) => (
            <div key={video._id} className='video-card'>
              <div className='video-thumbnail'>
                <img 
                  src={video.thumbnail || 'https://via.placeholder.com/320x180'} 
                  alt={video.title}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/320x180'
                  }}
                />
                <div className='video-duration'>10:30</div>
              </div>
              <div className='video-info'>
                <h3 className='video-title'>{video.title || 'Untitled Video'}</h3>
                <p className='video-channel'>{video.channelName || 'Unknown Channel'}</p>
                <div className='video-meta'>
                  <span className='video-views'>{video.views || '0'} views</span>
                  <span className='video-category'>{video.category || 'General'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
