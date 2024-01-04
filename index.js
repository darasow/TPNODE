const express = require('express');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { engine } = require('express-handlebars');
const countriesList = require('countries-list');
const mkdirp = require('mkdirp');  // Ajout du module mkdirp pour créer le répertoire si nécessaire
const { error } = require('console');

const app = express();
const port = 3000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = 'public/images/';

    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    cb(null, uuidv4() + extension);
  },
});

const upload = multer({ storage: storage });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "views")))
app.use(express.static(path.join(__dirname, "public")))

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

async function api() {
  const response = await axios.get('https://openlibrary.org/authors/OL33421A.json');
  const author = response.data.name;
  return author;
}
async function listePays() {
    const response = await axios.get(`https://restcountries.com/v2/all`);
    const countries = response.data;
  return countries;
}

app.get('/', async (req, res) => {
  try {
    res.render('index', { author: await api(), countries: countriesList.countries, titre : "Formulaire"});
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur interne du server');
  }
});

app.get('/pays', async (req, res) => {
  try {
    // Appel à l'API Restcountries pour obtenir la liste des pays
     const countries = await listePays()

    // Création d'un tableau avec les données nécessaires (nom du pays et URL du drapeau)
    const countriesData = countries.map((country, index) => ({
      index : index,
      name: country.name,
      flag: country.flags.png,
    }));

    res.render('pays', { countriesData: countriesData });
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur interne du serveur');
  }
});

app.get('/pays/:id', async (req, res) => {
  try {
    const countryId = req.params.id;

    // Récupérer les informations spécifiques à ce pays depuis l'API Restcountries
    const countries = await listePays()

    // Trouver le pays correspondant à l'ID dans la liste
    const selectedCountry = countries.find((country, index) => index  == countryId);

    if (!selectedCountry) {
      // Gérer le cas où le pays n'est pas trouvé
      return res.status(404).render('404');
    }

    // Récupérer les coordonnées du pays
    const coordinates = selectedCountry.latlng;

    // Rendre la vue "carte" avec les données du pays
    res.render('carte', {
      countryName: selectedCountry.name,
      coordinates: coordinates,
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur interne du serveur');
  }
});

app.post('/submit', upload.fields([{ name: 'cv', maxCount: 1 }, { name: 'images', maxCount: 10 }]), async (req, res) => {
    const { nom, prenom, genre, pays, auteur} = req.body;
  
  if(!req.files['cv'] || !req.files['images'] || !nom || !prenom)
  {
    return res.render('index', { message: "Remplir tous les champs", author: await api(), countries: countriesList.countries  , titre : "Affichage"});
  }
    const cv = req.files['cv'][0].filename;
    const images = req.files['images'].map(image => image.filename);
  return res.render('show', {auteur : auteur, nom : nom, prenom : prenom, images : images, cv : cv, pays : pays, genre : genre , titre : "Affichage"});
});


app.get("*", (req, res) =>{
   res.render('404')
})

app.use((err, req, res, next) =>{
    console.error(err.stack);
    res.status(500).send("Erreur regarder le terminal !")


})

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});

