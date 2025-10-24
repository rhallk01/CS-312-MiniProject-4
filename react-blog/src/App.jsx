//imports
import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Header from './components/Header.jsx'
import PostList from './components/PostList.jsx'
import BlogPostForm from './components/Form.jsx'
import EditPost from './components/EditPost.jsx'
import SignIn from './components/SignIn.jsx'
import SignUp from './components/SignUp.jsx'
import api from './api'

//export app
export default function App() {
  //set up usestate consts
  const [user, setUser] = useState(null)
  const [tags, setTags] = useState(['all','tech','lifestyle','local','diy','art','gardening','sports'])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  //set load state to true
  const fetchPosts = async () => {
    setLoading(true)
  }

  //load all posts
  useEffect(() => {
    (async () => {
      try {
        //set loading state to true
        setLoading(true)
        //get request to api to send to index.js to get blog posts
        const { data } = await api.get('/api/blogs')
        //set the posts const with either posts retrieved or []
        setPosts(data || [])
      } catch (e) {
        console.error(e)
      } finally {
        //set loading state to false
        setLoading(false)
      }
    })()
  }, [])

  //handle creating a post
  const handleCreate = async (payload) => {
    try {
      //post request to api to send to index.js
      const { data } = await api.post('/api/blogs', payload)
      //add new post to posts list
      setPosts(prev => [data, ...prev])
      //navigate home
      navigate('/')
    } catch (e) {
      alert('Create failed. Are you logged in?')
      console.error(e)
    }
  }

  //handle going to edit page for a post
  const handleUpdate = async (id, payload) => {
    try {
      //put request to api to send to index.js
      const { data } = await api.put(`/api/blogs/${id}`, payload)
      //find edited post in post list and replace it w new version
      setPosts(prev => prev.map(post => post.id === id ? data : post))
      //navigate home
      navigate('/')
    } catch (e) {
      alert('Update failed (are you the creator?).')
      console.error(e)
    }
  }

  //handle delete post
  const handleDelete = async (id) => {
    try {
      //delete request to api to send to index.js
      await api.delete(`/api/blogs/${id}`)
      //update local state to delete the deleted post from list
      setPosts(prev => prev.filter(post => post.id !== id))
    } catch (e) {
      alert('Delete failed (are you the creator?).')
      console.error(e)
    }
  }

  //handle sign in submission
  const handleSignin = async (credentials) => {
    try {
      //post request to api to send to to index.js for login
      const { data } = await api.post('/api/login', credentials)
      //set user based on sign in id and name
      setUser({ id: data.user_id, name: data.name })
      //go back to home page
      navigate('/')
    } catch (e) {
      alert(e?.response?.data?.error || 'Login failed')
    }
  }

  //handle sign up submission
  const handleSignup = async (payload) => {
    try {
      //post request to api to send to to index.js for registration
      const { data } = await api.post('/api/register', payload)
      //set user based on sign up id and name
      setUser({ id: data.user_id, name: data.name })
      //go back to home page
      navigate('/')
    } catch (e) {
      alert(e?.response?.data?.error || 'Registration failed')
    }
  }

  //return pages and their handling
  return (
    <div>
      <Header tags={tags} />
      <Routes>
        <Route path="/" element={<PostList posts={posts} onDelete={handleDelete} />} />
        <Route path="/form" element={<BlogPostForm tags={tags} onSubmit={handleCreate} />} />
        <Route path="/edit/:id" element={<EditPost tags={tags} posts={posts} onSubmit={handleUpdate} />} />
        <Route path="/login" element={<SignIn onSubmit={handleSignin} />} />
        <Route path="/register" element={<SignUp onSubmit={handleSignup} />} />
      </Routes>
    </div>
  )
}