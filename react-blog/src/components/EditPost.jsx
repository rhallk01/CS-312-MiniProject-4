//react imports
import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

//export the edit post function
export default function EditPost({ posts, tags, onSubmit }) {
  //get the id
  const { id } = useParams()
  //get the post to edit
  const post = useMemo(() => posts.find(p => String(p.id) === String(id)), [posts, id])
  //set the fields of the edit form with the values of the post
  const [title, setTitle] = useState(post?.title || '')
  const [content, setContent] = useState(post?.content || '')
  const [tag, setTag] = useState(post?.tag || 'all')

  //handle post not found
  if (!post) return <main><p>Post not found.</p></main>

  //submit edited post
  const handleSubmit = e => {
    e.preventDefault()
    //handle submission of edited post
    onSubmit(post.id, { blogTitle: title, content, tagName: tag })
  }

  //return pre-filled in form 
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
            {[post.tag, ...tags.filter(t=>t!==post.tag)].map(t => <option key={t} value={t}>{t}</option>)}
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
