const express = require('express');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { engine } = require('express-handlebars');
const countriesList = require('countries-list');
const mkdirp = require('mkdirp');  // Ajout du module mkdirp pour créer le répertoire si nécessaire
const {connexionMongoos} = require('./src/services/mongoose');
const  mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const { User } = require('./src/models/User');
const { Documents } = require('./src/models/Documents');
require('dotenv').config()

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
    const countriesData = countries.map((country, index) => ({
      index : index,
      name: country.name,
      flag: country.flags.png,
      coordinates : country.latlng,
    }));
  return countriesData;
}

// async function connexionMongoos() {
//   try {
//      const client = new MongoClient(process.env.URL);

//      await client.connect()
//      console.log("Connexion reussie");
//      const db = client.db("nodeMongo")
//      const collection = db.collection('documents')
//     //  await collection.insertMany([{}])// les donnee 

//     // await mongoose.connect(process.env.URL);

//     // const User = mongoose.model('User', {
//     //   name: {
//     //     type: String,
//     //     required: true,
//     //   },
//     //   age: {
//     //     type: Number,
//     //     required: true,
//     //     validate: {
//     //       validator: (v) => v >= 0,
//     //       message: "L'age doit être positif",
//     //     },
//     //   },
//     //   email: {
//     //     type: String,
//     //     required: true,
//     //     validate: {
//     //       validator: (v) => validator.isEmail(v),
//     //       message: "L'email n'est pas valide",
//     //     },
//     //   },
//     //   password: {
//     //     type: String,
//     //     required: true,
//     //     validate: {
//     //       validator: (v) => validator.isLength(v, { min: 5, max: 20 }),
//     //       message: "Le mot de passe est invalide",
//     //     },
//     //   },
//     // });

//     // const mamadou = new User({
//     //   name: 'Kadiza',
//     //   age: 21,
//     //   email: 'kadiza@gmail.com',
//     //   password: 'dizalove',
//     // });



//     try {
//       // await mamadou.save();
//       // const data1 = await collection.findOne({name : 'ivysaur'})
//       const data1 = await collection.find()
//       console.table(data1);
//       console.log('User saved successfully!');

//     } catch (error) {
//       console.error('Error saving user:', error.message);
//     } finally {
//       // mongoose.disconnect(); // Close the connection after saving
//     }

//     return 'Done!';
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error.message);
//     throw error; // Rethrow the error to be caught in the route handler
//   }
// }


/*
apiKey = '29f83a1cf93485288601b303e6748b89'; // Remplacez par votre clé API weatherstack
    
    const apiUrl = `http://api.weatherstack.com/current?access_key=${this.apiKey}&query=${this.cityInput}`;
    axios
      .get(apiUrl)
      .then((response) => {
        this.data = response.data
        this.location = response.data.location;
        this.current = response.data.current;
        this.errorMessage = null;
      })
      .catch((error) => {
        this.data = null;
        this.errorMessage = 'Le pays n\'existe pas ou une erreur s\'est produite.';
        console.error('Erreur lors de la récupération des données météo', error);
      });

*/ 
app.get('/', async (req, res) => {
  try {
    // Création d'un tableau avec les données nécessaires (nom du pays et URL du drapeau)
    res.render('index', { author: await api(), countries: await listePays(), titre : "Formulaire"});
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur interne du server');
  }
});

app.get('/pays', async (req, res) => {
  try {
    // Appel à l'API Restcountries pour obtenir la liste des pays
<<<<<<< HEAD
     const countries = await listePays()

    // Création d'un tableau avec les données nécessaires (nom du pays et URL du drapeau)
    const countriesData = countries.map((country, index) => ({
      index : index,
      name: country.name,
      flag: country.flags.png,
      population: country.population,
      latlng: country.latlng,
    }));
    res.render('pays', { countriesData: countriesData });
=======
    res.render('pays', { countriesData: await listePays() });
    
>>>>>>> 376eec2e263f31cc030d7165f7aa06d312893b5f
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

    // Rendre la vue "carte" avec les données du pays
    res.render('carte', {
      countryName: selectedCountry.name,
      coordinates: selectedCountry.coordinates,
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
    return res.render('index', { message: "Remplir tous les champs", author: await api(), countries: await listePays()  , titre : "Affichage"});
  }
    const cv = req.files['cv'][0].filename;
    const images = req.files['images'].map(image => image.filename);
  return res.render('show', {auteur : auteur, nom : nom, prenom : prenom, images : images, cv : cv, pays : pays, genre : genre , titre : "Affichage"});
});


app.get('/mongodb', async (req, res) => {
  try {
    await connexionMongoos();
    const user = new User(req.body)
    // console.log(document);
    const resultat = user.save()
    // const t = await Documents.findOne({name : 'dara'})
      // console.log(t);
    console.table(resultat);
    res.render('mongodb', { data: resultat });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur interne du serveur');
  }
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

