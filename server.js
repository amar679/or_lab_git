const express = require('express');
const { Client } = require('pg');
const app = express();
const path = require('path');
const cors = require('cors');
const { auth, requiresAuth } = require('express-openid-connect');
const dotenv = require('dotenv');



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

dotenv.config();

const port = process.env.PORT || 3000;


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

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_CLIENT_SECRET,
    baseURL: process.env.AUTH0_BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
    authorizationParams: {
        response_mode: 'query',
      }
  };
  

app.use(auth(config));

app.get('/profile', (req, res) => {
    if (!req.oidc.isAuthenticated()) {
      return res.status(401).send('Prvo se morate prijaviti!');
    }
  
    const user = req.oidc.user;
  
    res.send(`
      <h1>Korisnički profil</h1>
      <p><strong>Ime:</strong> ${user.name || 'Nepoznato'}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Sub:</strong> ${user.sub}</p>
      <a href="/">Povratak na početnu</a>
    `);
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



app.get('/api/openapi',(req,res) => {
  res.sendFile(path.join(__dirname, 'static','openapi.yaml'))
});

app.get('/api/kafici', (req, res) => {
  const query = `SELECT 
          k.naziv,
          k.id,
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

app.get('/api/kafici/:id', async (req, res) => {
  const { id } = req.params;

  try {
      const query = `
          SELECT 
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
          WHERE k.id = $1
          GROUP BY k.id, k.naziv, k.adresa, kv.naziv_kv, k.pros_ocjena, 
                   k.broj_recenzija, k.radno_vr, k.pet_friendly, k.wifi;
      `;

      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
          return res.status(404).send('Kafić nije pronađen');
      }

      const kafic = result.rows[0];
      kafic.id = id;
      res.render('kafic', { kafic });
  } catch (err) {
      console.error('Greška pri dohvaćanju kafića:', err);
      res.status(500).send('Greška na serveru');
  }
});



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'static','index.html'));
});
app.get('/datatable', (req, res) => {
  res.sendFile(path.join(__dirname,'static', 'datatable.html'));
});

app.get('/profile', requiresAuth(), (req, res) => {
    res.send(`
      <h1>Korisnički profil</h1>
      <pre>${JSON.stringify(req.oidc.user, null, 2)}</pre>
      <p><a href="/">Početna</a></p>
    `);
  });
  

app.get('/edit/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const result = await client.query(`SELECT 
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
  WHERE k.id = $1
  GROUP BY k.id, k.naziv, k.adresa, kv.naziv_kv, k.pros_ocjena, 
           k.broj_recenzija, k.radno_vr, k.pet_friendly, k.wifi`, [id]);
      const kafic = result.rows[0];
      kafic.id = id;
      if (!kafic) {
          return res.status(404).send('Kafić nije pronađen');
      }
      res.render('edit', { kafic }); 
  } catch (err) {
      console.error(err);
      res.status(500).send('Greška na serveru');
  }
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
      usluge, 
      specijalne_ponude  
  } = req.body;

  if (!naziv) {
      return res.status(400).json({ error: "Naziv je obavezan" });
  }

  try {
      
    const kvartQuery = `
    INSERT INTO kvart (naziv_kv) 
    VALUES ($1) 
    ON CONFLICT (naziv_kv) DO NOTHING 
    RETURNING id_kv
`;
const kvartResult = await client.query(kvartQuery, [naziv_kv]);

let idKvart;
if (kvartResult.rows.length > 0) {
    idKvart = kvartResult.rows[0].id_kv;
} else {
    const existingKvartQuery = `SELECT id_kv FROM kvart WHERE naziv_kv = $1`;
    const existingKvartResult = await client.query(existingKvartQuery, [naziv_kv]);
    idKvart = existingKvartResult.rows[0].id_kv;
}

      const result = await client.query(
          `INSERT INTO kafic (naziv, adresa, id_kv, pros_ocjena, broj_recenzija, radno_vr, pet_friendly, wifi)
           VALUES ($1, $2, (SELECT id_kv FROM Kvart WHERE naziv_kv = $3), $4, $5, $6, $7, $8) RETURNING id`,
          [naziv, adresa, naziv_kv, pros_ocjena, broj_recenzija, radno_vr, pet_friendly, wifi]
      );

      const kaficId = result.rows[0].id;

      const uslugaIds = [];
      if (usluge && usluge.length > 0) {
          for (let usluga of usluge) {
              const uslugaResult = await client.query(
                  `SELECT id_usl FROM usluga WHERE naziv_usl = $1`,
                  [usluga]
              );
              if (uslugaResult.rows.length > 0) {
                  uslugaIds.push(uslugaResult.rows[0].id_usl);
              }
          }
      }

      for (let uslugaId of uslugaIds) {
          await client.query(
              `INSERT INTO ima_usl (id, id_usl) VALUES ($1, $2)`,
              [kaficId, uslugaId]
          );
      }

      const ponudaIds = [];
      if (specijalne_ponude && specijalne_ponude.length > 0) {
          for (let ponuda of specijalne_ponude) {
              const ponudaResult = await client.query(
                  `SELECT id_pon FROM specijalna_ponuda WHERE naziv_pon = $1`,
                  [ponuda]
              );
              if (ponudaResult.rows.length > 0) {
                  ponudaIds.push(ponudaResult.rows[0].id_pon);
              }
          }
      }

      for (let ponudaId of ponudaIds) {
          await client.query(
              `INSERT INTO ima_pon (id, id_pon) VALUES ($1, $2)`,
              [kaficId, ponudaId]
          );
      }

      res.status(201).json({
          message: "Kafić uspješno dodan",
          kaficId: kaficId,
      });

  } catch (error) {
      console.error("Greška prilikom dodavanja u bazu:", error);
      res.status(500).json({ error: "Greška na serveru" });
  }
});



app.delete('/api/kafici/:id', async (req, res) => {
  const { id } = req.params;

  try {
      await client.query(
          `DELETE FROM ima_pon WHERE id = $1`,
          [id]
      );

      await client.query(
          `DELETE FROM ima_usl WHERE id = $1`,
          [id]
      );

      await client.query(
          `DELETE FROM kafic WHERE id = $1`,
          [id]
      );

      res.status(200).json({ message: 'Kafić uspješno obrisan' });
  } catch (error) {
      console.error('Greška prilikom brisanja kafića:', error);
      res.status(500).json({ error: 'Greška na serveru' });
  }
});

app.put('/api/kafici/:id', async (req, res) => {
  const { id } = req.params;
  const { naziv, adresa, naziv_kv, pros_ocjena, broj_recenzija, radno_vr, pet_friendly, wifi, usluge, specijalne_ponude } = req.body;

  try {
      await client.query(
          `UPDATE kafic 
          SET naziv = $1, 
              adresa = $2, 
              id_kv = (SELECT id_kv FROM kvart WHERE naziv_kv = $3 LIMIT 1), 
              pros_ocjena = $4, 
              broj_recenzija = $5, 
              radno_vr = $6, 
              pet_friendly = $7, 
              wifi = $8
          WHERE id = $9;
          `,
          [naziv, adresa, naziv_kv, pros_ocjena, broj_recenzija, radno_vr, pet_friendly, wifi, id]
      );
      res.json({ message: 'Kafić uspješno ažuriran!' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Greška pri ažuriranju kafića' });
  }
});



app.listen(port, () => {
  console.log(`server dostupan na http://localhost:${port}`);
});
