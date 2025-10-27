//Add import statements
import express from "express";
import bodyParser from "body-parser";
import methodOverride from 'method-override';
import pg from "pg";
import ejs from "ejs";
import cors from 'cors'

//set up express and the port
const app = express();
const port = 3000;
app.engine("ejs", ejs.__express);

//connect to database 
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "BlogDB",
  password: "darkgreyseaslug1234",
  port: 5432,
});
db.connect();


//tell express what folder the static files are, make them accessible with relative urls
app.use(express.static("public"));
app.use(express.json())
// allow requests from react
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

//parse data that is recieved
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method
      console.log(method,req.body._method)
      delete req.body._method
      return method
    }
  }))

//set up tags variables to be used later
var tags = ["all" ,"tech", "lifestyle", "local", "diy", "art", "gardening", "sports"];
//set up variables to track the current user [NEW]
let currentUserId;
let currentUserName; 

//rewrite to work with react

//function to get posts
app.get('/api/blogs', async (req, res) => {
  try {
    //get all posts from DB from most recent to oldest
    const result = await db.query('SELECT * FROM blogs ORDER BY time_updated DESC NULLS LAST, date_created DESC NULLS LAST');
    //map fields onto dict
    const posts = result.rows.map((post) => ({
      id: post.blog_id,
      name: post.creator_name,
      title: post.title,
      content: post.body,
      time: post.time_updated,
      initTime: post.date_created,
      tag: post.tag,
      creator_id: post.creator_user_id,
    }));
    //render posts
    res.json(posts);
  } catch (e) { res.status(500).json({ error: 'Failed to load posts' }); }
});

//submit and create a blog post, then go back to home page
app.post('/api/blogs', async (req, res) => {
  try {
    //make sure they are a user!
    if (!currentUserId) return res.status(401).json({ error: 'Login required' });
    //retrieve name, title, content, and tag from form
    const { title, content, tagName = 'all' } = req.body;
    //add post to DB
    const result = await db.query(
      `INSERT INTO blogs (creator_name, creator_user_id, title, body, date_created, time_updated, tag)
       VALUES ($1,$2,$3,$4,NOW(),NOW(),$5)
       RETURNING *`,
      [currentUserName, currentUserId, title, content, tagName.toLowerCase()]
    );
    const new_post = result.rows[0];
    res.status(201).json({
      id: new_post.blog_id, name: new_post.creator_name, title: new_post.title, content: new_post.body,
      time: new_post.time_updated, initTime: new_post.date_created, tag: new_post.tag, creator_id: new_post.creator_user_id
    });
  } catch (e) { res.status(500).json({ error: 'Create failed' }); }
});

//if the delete button on a post is clicked, delete it and redirect home
app.delete('/api/blogs/:id', async (req, res) => {
  try {
    //check that the user is logged in
    if (!currentUserId) return res.status(401).json({ error: 'Login required' });
    //get id number of post to delete
    const got_rows = await db.query('SELECT * FROM blogs WHERE blog_id=$1', [req.params.id]);
    //check if post found
    if (!got_rows.rows.length) return res.status(404).json({ error: 'Not found' });
    //get row
    const post = got_rows.rows[0];
    //check that the person deleting is also the creator
    if (post.creator_user_id !== currentUserId) return res.status(403).json({ error: 'Forbidden' });
    //delete from DB
    await db.query('DELETE FROM blogs WHERE blog_id=$1', [req.params.id]);
    res.status(204).end();
  } catch (e) { res.status(500).json({ error: 'Delete failed' }); }
});

//go to the edit page with a particular post
app.get('/api/blogs/:id', async (req, res) => {
  //find the original post by id
  const got_rows = await db.query('SELECT * FROM blogs WHERE blog_id=$1', [req.params.id]);
  //check if post found
  if (!got_rows.rows.length) return res.status(404).json({ error: 'Not found' });
  //get the row
  const new_post = got_rows.rows[0];
  res.json({
    id: new_post.blog_id, name: new_post.creator_name, title: new_post.title, content: new_post.body,
    time: new_post.time_updated, initTime: new_post.date_created, tag: new_post.tag, creator_id: new_post.creator_user_id
  });
});

//update the existing blog post on submit
app.put('/api/blogs/:id', async (req, res) => {
  try {
    //check that the user is logged in
    if (!currentUserId) return res.status(401).json({ error: 'Login required' });
    const { id } = req.params;
    const { title, content, tagName = 'all' } = req.body;
    //find the post being updated
    const result = await db.query('SELECT * FROM blogs WHERE blog_id=$1', [id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    const post = result.rows[0];
    //heck that the logged-in user owns the post
    if (post.creator_user_id !== currentUserId)
      return res.status(403).json({ error: 'Forbidden: You can only edit your own posts' });
    //update the post
    const updated = await db.query(
      `UPDATE blogs
       SET title=$1, body=$2, tag=$3, time_updated=NOW()
       WHERE blog_id=$4
       RETURNING *`,
      [title, content, tagName.toLowerCase(), id]
    );

    const new_post = updated.rows[0];
    res.json({
      id: new_post.blog_id,
      name: new_post.creator_name,
      title: new_post.title,
      content: new_post.body,
      time: new_post.time_updated,
      initTime: new_post.date_created,
      tag: new_post.tag,
      creator_id: new_post.creator_user_id
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Update failed' });
  }
});


//handle submitted login request
app.post('/api/login', async (req, res) => {
  //get the userid and password that was entered
  const { user_id, password } = req.body;
  console.log('Login attempt:', user_id, password);
  //get all instances of rows in the database with the user id that was entered
  const result = await db.query('SELECT * FROM users WHERE user_id=$1', [user_id]);
  console.log('Query result:', result.rows);
  //if user id doesnt exist, show message on login page
  if (!result.rows.length) return res.status(404).json({ error: 'User not found' });
  //get the row and store the password for checking
  const user = result.rows[0];
  console.log('DB user password:', user.password);
  //check if entered password matches db password
  if (user.password !== password) return res.status(401).json({ error: 'Incorrect password' });
  //if so, store current user
  currentUserId = user.user_id;
  currentUserName = user.name;
  res.json({ user_id: user.user_id, name: user.name });
});

//handle submitted register request
app.post('/api/register', async (req, res) => {
  //get the username, userid, and password that was entered
  const { user_id, password, username } = req.body;
  //get all instances of rows in the database with the user id that was entered
  //this is to make sure that it doesn't already exist, as it must be unique
  const exists = await db.query('SELECT 1 FROM users WHERE user_id=$1', [user_id]);
  //if there aren't zero results, render exists message
  if (exists.rows.length) return res.status(409).json({ error: 'User ID already exists. Try logging in' });
  //insert the new user into the users table
  await db.query('INSERT INTO users (user_id, password, name) VALUES ($1,$2,$3)', [user_id, password, username]);
  //set the current user to the new user
  currentUserId = user_id; currentUserName = username;
  res.status(201).json({ user_id, name: username });
});

//start the Express server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
