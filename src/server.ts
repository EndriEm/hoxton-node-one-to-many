import cors from 'cors'
import express from 'express'
import Database from 'better-sqlite3'

const db = Database('.db/data.db', {verbose: console.log})
const app = express()
app.use(cors())
app.use(express.json())

const port = 3333

const getMuseumById = db.prepare(`
SELECT * FROM museums WHERE id = @id;
`)

const getArtworkById = db.prepare(`
SELECT * FROM artworks WHERE id = @id
`)

const getArtworksForMuseum = db.prepare(`
SELECT * FROM artworks WHERE museumId = @museumId;
`)

const getMuseumOfArtwork = db.prepare(`
SELECT * FROM museums WHERE id=@id
`)

const addMuseum = db.prepare(`
INSERT INTO museums (name, location) VALUES (@name, @location);
`) 

const addArtwork = db.prepare(`
INSERT INTO artworks
  (name, year, image, museumId)
VALUES
  (@name, @year, @image, @museumId);
`)

const removeArtwork = db.prepare(`
UPDATE artworks SET museumId = @museumId WHERE id = @id
`);


app.get('/museums/:id', (req, res) => {
    const museum = getMuseumById.get(req.params)
  
    if (museum) {
      const artworks = getArtworksForMuseum.all({ museumId: museum.id })
      museum.artworks = artworks
      res.send(museum)
    } else {
      res.status(404).send({ error: 'Museum not found.' })
    }
  })


  app.get('/artworks/:id', (req, res) => {
    const artwork = getArtworkById.get(req.params)
  
    if (artwork) {
      const museum = getMuseumOfArtwork.get({ id: artwork.museumId })
      artwork.museum = museum
      res.send(artwork)
    } else {
      res.status(404).send({ error: 'Artwork not found.' })
    }
  })


  app.post('/museums', (req, res) => {
    let errors: string[] = []
  
    if (typeof req.body.name !== 'string') {
      errors.push('Name is missing or not a string')
    }
  
    if (typeof req.body.location !== 'string') {
      errors.push('Location is missing or not a string')

      if (errors.length === 0) {
        const info = addMuseum.run(req.body)
        const museum = getMuseumById.get({ id: info.lastInsertRowid })
        const artworks = getArtworksForMuseum.all({ museumId: museum.id })
        museum.artworks = artworks
      res.send(museum)
    }else {
      res.status(400).send({ errors })
    }
  }
})

  
  app.post('/artworks', (req, res) => {
    let errors: string[] = []
  
    if (typeof req.body.name !== 'string') {
      errors.push('Name is missing or not a string')
    }
  
    if (typeof req.body.year !== 'string') {
      errors.push('Year is missing')
    }

    if (typeof req.body.image !== 'string') {
      errors.push('Image is missing')
    }
  
    if (typeof req.body.museumId !== 'number') {
      errors.push('MuseumId is missing or not a number')
    }
  
    /*if (errors.length === 0) {
      const museum = getMuseumById.get({ id: req.body.museumId })
      if (museum) {
        const info = addArtwork.run(req.body)
        const artwork = getArtworkById.get({ id: info.lastInsertRowid })
        artwork.museum = museum
        res.send(artwork)
      } else {
        res.status(400).send({
          error:
            '*ERROR*'
        })
      }
    } else {
      res.status(400).send({ errors })*/
    
  })


  app.patch("/artworks/:id", (req, res) => {/*
    const artwork = getArtworkById.get(req.params);
    if (artwork) {
      const newArtworkObj = { ...artwork, ...req.body };
      removeArtwork.run(newArtworkObj);
      res.send(newArtworkObj);
    } else res.status(404).send({ error: "Quote not found" });*/
  });



app.listen(port, () => {});