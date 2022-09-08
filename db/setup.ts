import Database from "better-sqlite3";

const db = Database(".db/data.db", { verbose: console.log });

const museums = [
  {
    name: "Iconografic Museum Onufri",
    location: "Berat, Albania",
  },
  {
    name: "National Museum",
    location: "Tirane, Albania",
  },
  {
    name: "Museum of Vienna",
    location: "Vienna, Austria",
  },
];

const artworks = [
  {
    name: "Head of Dea",
    year: "500 B.C.",
    image:
      "https://www.balkanweb.com/wp-content/uploads/2014/11/dea-e-butrintit.jpg",
    museumId: 2,
  },
  {
    name: "Skanderbeg Header",
    year: "1599",
    image:
      "https://3.bp.blogspot.com/-PMDBt1JK-kY/XDpGokucBwI/AAAAAAAAerM/iX-YZj3tiV4WFEi4XyEPo7JyCmjYR_ZcgCLcBGAs/s1600/10952283_883134085072558_458040893526594989_o.jpg",
    museumId: 3,
  },
  {
    name: "Codex Purpureus Beratinus",
    year: "6th century",
    image:
      "https://i0.wp.com/muzeumet-berat.al/wp-content/uploads/2019/01/4.-kodiket-e-beratit.jpg?resize=2048%2C1365&ssl=1",
    museumId: 1,
  },
  {
    name: "Iconostas St. Mary",
    year: "1807",
    image:
      "https://i1.wp.com/muzeumet-berat.al/wp-content/uploads/2019/01/2.-Ikonostas-scaled.jpg?resize=2560%2C1696&ssl=1",
    museumId: 1,
  },
];

const deleteMuseumsTable = db.prepare(`
DROP TABLE IF EXISTS museums;
`);
deleteMuseumsTable.run();

const createMuseumsTable = db.prepare(`
CREATE TABLE IF NOT EXISTS museums (
    id INTEGER,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    PRIMARY KEY(id)
);
`);
createMuseumsTable.run();

const createMuseum = db.prepare(`
INSERT INTO museums (name, location) VALUES (@name, @location);
`);

for (let museum of museums) {
  createMuseum.run(museum);
}

const dropArtworksTable = db.prepare(`
DROP TABLE IF EXISTS artworks;
`)
dropArtworksTable.run()


const createArtworksTable = db.prepare(`
CREATE TABLE IF NOT EXISTS artworks (
  id INTEGER,
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
  image TEXT NOT NULL
  museumId INTEGER NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (museumId) REFERENCES museums(id)
);
`)
createArtworksTable.run()

const createArtwork = db.prepare(`
INSERT INTO artworks
  (name, year, image, museumId)
VALUES
  (@name, @year, @image, @museumId);
`)

for (let artwork of artworks) {
    createArtwork.run(artwork)
}