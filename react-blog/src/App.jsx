import { useState } from 'react'
import Header from './components/Header.jsx'
import PostList from './components/PostList.jsx'
import BlogPostForm from './components/Form.jsx'
import EditPost from './components/EditPost.jsx'
import SignIn from './components/SignIn.jsx'
import SignUp from './components/SignUp.jsx'
import api from './api'


function App() {

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)

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

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
