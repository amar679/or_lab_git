const express = require('express');
const { Client } = require('pg');
const app = express();
const path = require('path');
const cors = require('cors');
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors());
const client = new Client({
  host: 'localhost',
  user: 'postgres', 
  password: 'sm2204',     
  database: 'kafici'
});

client.connect((err) => {
  if (err) {
    console.error('Greška pri spajanju na bazu podataka:', err);
    return;
  }
  console.log('Povezani na PostgreSQL bazu podataka');
});

app.get('/kafici', (req, res) => {
  const query = `SELECT 
          k.naziv,
          k.adresa,
          kv.naziv_kv,
          k.pros_ocjena,
          k.broj_recenzija,
          k.radno_vr,
          k.pet_friendly,
          k.wifi,
          (
              SELECT ARRAY_AGG(json_build_object('TipUsluge', tu.naziv_usl))
              FROM ima_usl ktu 
              JOIN usluga tu ON ktu.id_usl = tu.id_usl
              WHERE ktu.id = k.id
          ) AS tipovi_usluga,
          (
              SELECT ARRAY_AGG(json_build_object('SpecijalnaPonuda', sp.naziv_pon))
              FROM ima_pon ksp
              JOIN Specijalna_Ponuda sp ON ksp.id_pon = sp.id_pon
              WHERE ksp.id = k.id
          ) AS specijalne_ponude
      FROM kafic k
      JOIN Kvart kv ON k.id_kv = kv.id_kv
      GROUP BY k.id, k.naziv, k.adresa, kv.naziv_kv, k.pros_ocjena, 
               k.broj_recenzija, k.radno_vr, k.pet_friendly, k.wifi;`
  client.query(query, (err, result) => {
    if (err) {
      console.error('Greška pri dohvaćanju podataka:', err);
      res.status(500).send('Greška na serveru');
    } else {
      res.json(result.rows);
    }
  });
});

app.use(express.static(__dirname));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/openapi',(req,res) => {
  res.sendFile(path.join(__dirname, 'openapi.yaml'))
});

app.get('/api/kafici', (req, res) => {
  const query = `SELECT 
          k.naziv,
          k.adresa,
          kv.naziv_kv,
          k.pros_ocjena,
          k.broj_recenzija,
          k.radno_vr,
          k.pet_friendly,
          k.wifi,
          (
              SELECT ARRAY_AGG(json_build_object('TipUsluge', tu.naziv_usl))
              FROM ima_usl ktu 
              JOIN usluga tu ON ktu.id_usl = tu.id_usl
              WHERE ktu.id = k.id
          ) AS tipovi_usluga,
          (
              SELECT ARRAY_AGG(json_build_object('SpecijalnaPonuda', sp.naziv_pon))
              FROM ima_pon ksp
              JOIN Specijalna_Ponuda sp ON ksp.id_pon = sp.id_pon
              WHERE ksp.id = k.id
          ) AS specijalne_ponude
      FROM kafic k
      JOIN Kvart kv ON k.id_kv = kv.id_kv
      GROUP BY k.id, k.naziv, k.adresa, kv.naziv_kv, k.pros_ocjena, 
               k.broj_recenzija, k.radno_vr, k.pet_friendly, k.wifi;`
  client.query(query, (err, result) => {
    if (err) {
      console.error('Greška pri dohvaćanju podataka:', err);
      res.status(500).send('Greška na serveru');
    } else {
      res.json(result.rows);
    }
  });
});
app.get('/popis', (req, res) => {
  res.sendFile(path.join(__dirname, 'popis.html'));
});
app.get('/dodajKafic', (req, res) => {
  res.sendFile(path.join(__dirname, '.html'));
});
  
app.post('/api/kafici', async (req, res) => {
  const {
      naziv,
      adresa,
      naziv_kv,
      pros_ocjena,
      broj_recenzija,
      radno_vr,
      pet_friendly,
      wifi,
  } = req.body;

  if (!naziv) {
      return res.status(400).json({ error: "Naziv je obavezan" });
  }

  try {
      const result = await client.query(
          `INSERT INTO kafic (naziv, adresa, id_kv, pros_ocjena, broj_recenzija, radno_vr, pet_friendly, wifi) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
          [naziv, adresa, naziv_kv, pros_ocjena, broj_recenzija, radno_vr, pet_friendly, wifi]
      );

      res.status(201).json({
          message: "Kafić uspješno dodan",
          kafic: result.rows[0],
      });
  } catch (error) {
      console.error("Greška prilikom dodavanja u bazu:", error);
      res.status(500).json({ error: "Greška na serveru" });
  }
});


app.listen(port, () => {
  console.log(`server dostupan na http://localhost:${port}`);
});
