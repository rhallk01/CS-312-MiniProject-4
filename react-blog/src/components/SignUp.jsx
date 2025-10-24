//react imports
import React, { useState } from 'react'

//export sign up function
export default function SignUp({ onSubmit }) {
  //set up usestate consts for username,  user_id and password
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user_id, setUserId] = useState('')

  //handle submission of username, user_id and password
  const handleSubmit = e => {
    e.preventDefault()
    onSubmit({ username, password, user_id })
  }

  //return sign UP form
  return (
    <main>
      {/*Sign up form*/}
      <h1 className="makeAPost">Register</h1>
      <div className="formsDiv">
        <form onSubmit={handleSubmit}>
          {/*Get user name*/}
          <label htmlFor="username">Name</label><br/>
          <input id="username" value={username} onChange={e=>setUsername(e.target.value)} required /><br/><br/>
          {/*Get password*/}
          <label htmlFor="password">Password</label><br/>
          <input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required /><br/><br/>
          {/*Get user id*/}
          <label htmlFor="user_id">User ID</label><br/>
          <input id="user_id" value={user_id} onChange={e=>setUserId(e.target.value)} required /><br/><br/>
          {/*Submit*/}
          <input className="formSubmit" type="submit" value="Register" />
        </form>
      </div>
    </main>
  )
}
