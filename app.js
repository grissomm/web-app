const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/html/welcome.html");
});

let dramas = [
  { id:1, title: 'Hospital Playlist', episode:12, genre: 'Medical', country: 'Korean', 
    image: 'https://www.bornincolour.com/pub/media/mageplaza/blog/post/image/h/o/hospital-playlist-official-poster.jpg'},
  { id:2, title: 'Falling into Your Smile', episode:31, genre: 'Gaming', country: 'China', 
    image:'https://hivemindedness.com/wp-content/uploads/2022/09/falling-into-your-smile-promo.jpg'},
  { id:3, title: 'Weak Hero Class', episode:8, genre: 'School', country: 'Korean', 
    image:'https://i.mydramalist.com/pq2lr_4f.jpg'}
];

let ratings = [];

app.get('/dramas', (req, res) => {
  let list = '';
  for (let i = 0; i < dramas.length; i++) {
    list += `<li>${dramas[i].title} (Genre: ${dramas[i].genre}) (Episode: ${dramas[i].episode}) (Country: ${dramas[i].country}) (Rating: ${dramas[i].rating || 'Not Rated'})<br>
    <img src="${dramas[i].image}" alt="${dramas[i].title}" width="200"><br></li>`;
    list += `<a href="/editDrama/${dramas[i].id}">Edit</a>
        <form action="/deleteDrama/${dramas[i].id}" method ="POST">
        <button type="submit">Delete</button>
        </form>
        </li>`;
  }
  res.send(`<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"> 
    <body class="p-4 bg-light">
    <div class="container">
    <h1>Drama List</h1>
    <div class="d-flex flex-wrap gap-3">
    <ul>${list}</ul>

    <a href="/" class="btn btn-secondary mt-4">← Back to Home</a><br>`);
});

app.get('/addDrama', (req, res) => {
  res.send(`<!DOCTYPE html>
  <html>
  <head>
    <title>Add Drama</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  </head>
  <body class="bg-light p-4">
    <div class="container">
      <h1 class="mb-4">Add a Drama</h1>
      <form action="/addDrama" method="POST" class="mb-3">
        <div class="mb-3">
          <label class="form-label">Drama Title</label>
          <input class="form-control" name="title" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Episode</label>
          <input class="form-control" name="episode" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Genre</label>
          <input class="form-control" name="genre" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Country</label>
          <input class="form-control" name="country" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Rating (1-5)</label>
          <input class="form-control" type="number" name="rating" min="1" max="5">
        </div>
        <div class="mb-3">
          <label class="form-label">Image URL</label>
          <input class="form-control" name="image">
        </div>
        <button class="btn btn-success">Add Drama</button>
      </form>
      <a href="/dramas" class="btn btn-secondary">← Back to Drama List</a>
    </div>
  </body>
  </html>`);
});

app.post('/addDrama', (req, res) => {
  const newId = dramas.length + 1;
  dramas.push({ id: newId, title: req.body.title, episode: req.body.episode, genre: req.body.genre, country: req.body.country, rating: req.body.rating, image: req.body.image });
  res.redirect('/dramas');
});

app.post('/deleteDrama/:id', (req, res) => {
  const id = parseInt(req.params.id);
  dramas = dramas.filter(d => d.id !== id);
  res.redirect('/dramas');
});

app.get('/editDrama/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const drama = dramas.find(d => d.id === id);
  if (drama) {
    res.send(`
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            <body class="bg-light p-4">
            <div class="container">
            <h1 class="mb-4">Edit Drama</h1>
            <form action="/editDrama/${drama.id}" method="POST" class="mb-3">
            <div class="mb-3">
              <label class="form-label">Drama Title</label>
              <input name="title" class="form-control" value="${drama.title}" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Episode</label>
              <input name="episode" class="form-control" value="${drama.episode}" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Genre</label>
              <input name="genre" class="form-control" value="${drama.genre}" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Country</label>
              <input name="country" class="form-control" value="${drama.country}" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Rating (1-5)</label>
              <input name="rating" type="number" min="1" max="5" class="form-control" value="${drama.rating || ''}" />
            </div>
            <div class="mb-3">
              <label class="form-label">Image URL</label>
              <input name="image" class="form-control" value="${drama.image}" />
            </div>
            <button type="submit" class="btn btn-primary">Update Drama</button>
            <a href="/dramas" class="btn btn-secondary ms-2">Cancel</a>
          </form>
        </div>
      </body>
        `);
  } else {
    res.status(404).send('Drama not found');
  }
});

app.post('/editDrama/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  for (let i = 0; i < dramas.length; i++) {
    if (dramas[i].id === id){
      dramas[i].title = req.body.title;
      dramas[i].episode = req.body.episode;
      dramas[i].genre = req.body.genre;
      dramas[i].country = req.body.country;
      dramas[i].rating = req.body.rating;
      dramas[i].image = req.body.image;
    }
  }
  res.redirect('/dramas');
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});