//react imports
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

//export the posts that fit with the selected tage
export default function PostList({ posts, onDelete }) {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const tag = (params.get('tag') || 'all').toLowerCase()
  const filtered = tag === 'all' ? posts : posts.filter(p => (p.tag || '').toLowerCase() === tag)

  //return blog posts formatted 
  return (
    <main>
      {/*Blog Posts*/}
      <h1 className="makeAPost">Blog Posts</h1>
      <div className="blogPostDiv">
        {/*if no posts, display be first to post message*/}
        {filtered.length === 0 && <h2>Be the first to post!</h2>}
        {/*map post data onto formatting*/}
        {/*loop through the array of blogPosts*/}
        {filtered.map(p => (
          <div className="postBox" key={p.id}>
            <div className="topRow">
              {/*put date at the top left*/}
              <span className="time">Date: {p.time}</span>
              {/*put the edit and delete buttons at the top right*/}
              <div className="buttonGroup">
                <Link to={`/edit/${p.id}`} className="editBtn">Edit</Link>
                <form onSubmit={(e)=>{e.preventDefault(); onDelete(p.id)}}>
                  <button type="submit" id="deletebtn">Delete</button>
                </form>
              </div>
            </div>
            {/*put the creator name, post title, content, and tag in the post*/}
            <p className="name">Creator: <strong>{p.name}</strong></p>
            <h3 className="title">{p.title}</h3>
            <p className="content">{p.content}</p>
            <h5 className="tag">{p.tag}</h5>
          </div>
        ))}
      </div>
      <hr />
    </main>
  )
}
