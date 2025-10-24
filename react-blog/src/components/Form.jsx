//react imports
import React, { useState } from 'react'

//export the blog post submission form
export default function BlogPostForm({ tags, onSubmit }) {
  //set up necessary consts for title content and tag with useState
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tag, setTag] = useState('all')

  //handle submit new post
  const handleSubmit = e => {
    e.preventDefault()
    onSubmit({ title, content, tagName: tag })
  }

  //return form 
  return (
    <main>
      <h1 className="makeAPost">Build-a-Blog</h1>
      {/*Edit blog post form*/}
      <div className="formsDiv">
        <form onSubmit={handleSubmit}>
          {/*get title*/}
          <label htmlFor="blogTitle">Blog Title:</label><br/>
          <input id="blogTitle" name="blogTitle" value={title} onChange={e=>setTitle(e.target.value)} required /><br/><br/>
          {/*get tag with dropdown*/}
          <label htmlFor="tagName">Tag (optional):</label><br/>
          <select id="tagName" value={tag} onChange={e=>setTag(e.target.value)}>
            {tags.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <br/><br/>
          {/*get content*/}
          <label htmlFor="content">Content:</label><br/>
          <textarea id="content" name="content" rows="5" cols="50" value={content} onChange={e=>setContent(e.target.value)} />
          <br/><br/>
          {/*submit*/}
          <input className="formSubmit" type="submit" value="Submit" />
        </form>
      </div>
    </main>
  )
}