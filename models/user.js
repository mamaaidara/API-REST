const mongoose = require('mongoose');

// Définir le schéma de l'utilisateur
const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    age: {type: Number, required: true},
    favoriteFoods: [String]
});

//creer et exporter le model a partir du schema
module.exports = mongoose.model('User', userSchema);
