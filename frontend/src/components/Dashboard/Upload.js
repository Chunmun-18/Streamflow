import React,{useState} from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Upload = () => {
    const [title,setTitle]=useState('')
    const [description,setDescription]=useState('')
    const [category,setCategory]=useState('')
    const [tags,setTags]=useState('')
    const [video,setVideo]= useState('null')
    const [thumbnail,setThumbnail]=useState('null')
    const [loading,setLoading]=useState(false)
    const [imageUrl,setImageUrl]=useState('null')

    const videoHandler = (e)=>{
        setVideo(e.target.files[0])
    }
    const thumbnailHandler = (e)=>{
        setThumbnail(e.target.files[0])
        setImageUrl(URL.createObjectURL(e.target.files[0]))
    }
    const submitHandler = (e)=>{
        e.preventDefault();
        setLoading(true);
        // console.log(title,tags,video,description,category);
        const formData = new FormData()
        formData.append('title',title)
        formData.append('description',description)
        formData.append('category',category)
        formData.append('tags',tags)
        formData.append('video',video)
        formData.append('thumbnail',thumbnail)

        axios.post('https://yt-full-stack-clone-api.onrender.com/video/upload',formData,{
            headers:{
                Authorization:"Bearer "+localStorage.getItem('token')
            }
        })
        .then(res=>{
            setLoading(false);
            console.log('Upload successful:', res.data);
            toast("Video uploaded")
        })
        .catch(err=>{
            setLoading(false);
            console.log(err.response.data.error);
            toast.error(err.response.data.error);
        })
    }

  return (
    <div className='upload-container'>
        <h2>Upload Video</h2>
      <form onSubmit={submitHandler}>
        <input onChange={(e)=>{setTitle(e.target.value)}} placeholder='Title' />
        <textarea onChange={(e)=>{setDescription(e.target.value)}} placeholder='Description'></textarea>
        <select onChange={(e)=>{setCategory(e.target.value)}}>
            <option value="science">Science</option>
            <option value="technology">Technology</option>
            <option value="education">Education</option>
            <option value="entertainment">Entertainment</option>
            <option value="motivation">Motivation</option>
        </select>
        <textarea onChange={(e)=>{setTags(e.target.value)}} placeholder='Tags'></textarea>

        <label>Select Video</label>
        <input onChange={videoHandler} type='file' />

        <label>Thumbnail</label>
        <input onChange={thumbnailHandler} type='file' />
        {imageUrl&& <img className='thumbnail' src={imageUrl}/>}
        <input type='submit' value={loading ? 'Uploading...' : 'Submit'} disabled={loading}/>
      </form>
    </div>
  )
}

export default Upload
