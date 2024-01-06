import { displayModal } from './shared.js';

document.addEventListener('DOMContentLoaded', async function () {
    // Vérifie si l'utilisateur est connecté
    const isLoggedIn = window.isLoggedIn || false;

    // Affiche le contenu approprié en fonction de la connexion de l'utilisateur
    if (isLoggedIn) {
        displayModal();
    }

});