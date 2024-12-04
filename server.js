require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user'); 

const app = express(); 


// Middleware pour analyser le corps des requêtes en JSON
app.use(express.json());


// Fonction pour connecter à MongoDB
const connectDB = async () => {
    try {
     
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connexion à MongoDB réussie');
    } catch (error) {
      
        console.error('Erreur de connexion à MongoDB :', error);
        process.exit(1); // Arrêter l'application en cas d'erreur de connexion
    
    }
};

connectDB();

 // Arrêter l'application en cas d'erreur de connexion
app.get('/get-user', async (req, res) => {
    try{
        const user = await User.find();
        res.json(user);
    }catch (error){
        res.status(500).json({message: 'Erreur lors de la récupération des utilisateurs'});
    }
});

// Route pour ajouter un nouvel utilisateur
app.post('/create-user', async (req, res) => {
    try{
        const newUser = new User (req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
        res.status(400).json({ message: 'Erreur lors de l\'ajout de l\'utilisateur'});
    }
});

// Route pour éditer un utilisateur par ID
app.put('/put-user/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,            
                runValidators: true,    
                context: 'query'         
            }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.json({
            message: 'Utilisateur mis à jour avec succès',
            updatedUser
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error.message);
        res.status(400).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur', erreur: error.message });
    }
});

// Route pour supprimer un utilisateur par ID
app.delete('/delete-user/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.json({
            message: 'Utilisateur supprimé avec succès',
            deletedUser
        });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error.message);
        res.status(400).json({ message: 'Erreur lors de la suppression de l\'utilisateur', erreur: error.message });
    }
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT} 🌐`);
});


