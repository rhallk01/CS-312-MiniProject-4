//react imports
import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

//export header banner with nav buttons and tag filter
export default function Header({ tags }) {
  //set consts
  const [selected, setSelected] = useState('all')
  const navigate = useNavigate()
  const location = useLocation()

  //handle using tags to filter
  const onGo = () => {
    const params = new URLSearchParams(location.search)
    if (selected && selected !== 'all') params.set('tag', selected)
    else params.delete('tag')
    navigate({ pathname: '/', search: params.toString() })
  }

  //return the banner with buttons and dropdown
  return (
    <div id="titleBanner">
      <h1>Blog Buddies!</h1>
      <nav>
        {/*home and new post buttons*/}
        <Link to="/">Home</Link>
        <Link to="/form">New Post</Link>
        {/*register and login buttons*/}
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
        {/*if on the home page, put the tags dropdown in the banner*/}
        {location.pathname === '/' && (
          <form onSubmit={e => { e.preventDefault(); onGo() }} style={{ display: 'inline-block', marginLeft: '1rem' }}>
            <label htmlFor="tag">Sort by Tag:</label>
            {/*dropdown label*/}
            <select id="tag" value={selected} onChange={e => setSelected(e.target.value)}>
              {tags.map(t => (<option key={t} value={t}>{t}</option>))}
            </select>
            {/*submit the dropdown to make it so that only the posts w those tags show*/}
            <input className="selectorSubmit" type="submit" value="Go!" />
          </form>
        )}
      </nav>
    </div>
  )
}