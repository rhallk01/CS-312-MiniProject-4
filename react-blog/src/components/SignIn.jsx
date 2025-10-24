//react imports
import React, { useState } from 'react'

//export sign in function
export default function SignIn({ onSubmit }) {
  //set up usestate consts for user_id and password
  const [user_id, setUserId] = useState('')
  const [password, setPassword] = useState('')

  //handle submission of user_id and password
  const handleSubmit = e => {
    e.preventDefault()
    onSubmit({ user_id, password })
  }

  //return sign in form
  return (
    <main>
      {/*Log in form*/}
      <h1 className="makeAPost">Login</h1>
      <div className="formsDiv">
        <form onSubmit={handleSubmit}>
          {/*Get user id*/}
          <label htmlFor="user_id">User ID</label><br/>
          <input id="user_id" value={user_id} onChange={e=>setUserId(e.target.value)} required /><br/><br/>
          {/*Get password*/}
          <label htmlFor="password">Password</label><br/>
          <input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required /><br/><br/>
          {/*Submit*/}
          <input className="formSubmit" type="submit" value="Login" />
        </form>
      </div>
    </main>
  )
}
