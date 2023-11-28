const express = require('express');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const {engine} = require('express-handlebars');
const countriesList = require('countries-list');
const fs = require('fs')

const app = express();
const port = 3000;
// Activer le middleware Helmet avec CSP

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/'); // Indiquez le chemin où vous souhaitez stocker les fichiers
    },
    filename: function (req, file, cb) {
      const extension = path.extname(file.originalname);
      cb(null, uuidv4() + extension); // Utilisation de l'UUID comme nom de fichier unique
    },
  });
  
  const upload = multer({ storage: storage });

// Middleware pour parser le corps des requêtes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "views")))
app.use(express.static(path.join(__dirname, "public")))
// Configuration de Handlebars comme moteur de modèle
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

// Endpoint pour le formulaire
app.get('/', async (req, res) => {
  try {
    // Récupération de la liste des auteurs depuis l'API
    const response = await axios.get('https://openlibrary.org/authors/OL33421A.json');
    const author = response.data.name;
    // Rendu du formulaire avec la liste des auteurs et des pays
    res.render('index', { author, countries: countriesList.countries });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/submit', upload.fields([{ name: 'cv', maxCount: 1 }, { name: 'images', maxCount: 10 }]), (req, res) => {
  // Récupération des données du formulaire
  const { nom, prenom, genre, pays, auteur } = req.body;
  const cv = req.files['cv']; // Utilisez 'cv' au lieu de 'file' pour récupérer les fichiers du champ 'cv'
  const images = req.files['images'];

  // Traitement des données (à adapter selon vos besoins)
  console.log('Nom:', nom);
  console.log('Prénom:', prenom);
  console.log('Genre:', genre);
  console.log('Pays:', pays);
  console.log('Auteur sélectionné:', auteur);

  if (cv && cv.length > 0) {
    console.log('CV:', cv[0].filename);
  } else {
    console.log('Aucun fichier CV téléchargé.');
  }

  if (images && images.length > 0) {
    console.log('Images :');
    images.forEach(image => {
      console.log(image.filename);
    });
  } else {
    console.log('Aucune image téléchargée.');
  }

  // Réponse au client
  res.send('Données reçues avec succès!');
});





// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
