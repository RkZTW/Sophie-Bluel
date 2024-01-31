import { handleConnectButtonClick, handleLoginLinkClick, initEventListeners, filtersVisibility } from './shared.js';

// Appel de la fonction d'initialisation après le chargement complet du script
document.addEventListener('DOMContentLoaded', function () {
    
    // Appel de la fonction d'initialisation des écouteurs d'événements
    initEventListeners();

    // Mise à jour de la visibilité des filtres lors de l'initialisation
    filtersVisibility();

    // Récupération des éléments du DOM avec les ID 'connect' et 'loginLink'
    const connectButton = document.getElementById('connect');
    const loginLink = document.getElementById('loginLink');

    // Ajout d'un écouteur d'événements sur le bouton 'connect' si l'élément existe
    if (connectButton) {
        connectButton.addEventListener('click', handleConnectButtonClick);
    }

    // Ajout d'un écouteur d'événements sur le lien 'loginLink' si l'élément existe
    if (loginLink) {
        loginLink.addEventListener('click', handleLoginLinkClick);
    } else {
        // Log d'erreur si l'élément avec l'ID 'loginLink' n'est pas trouvé
        console.error("L'élément avec l'ID 'loginLink' n'a pas été trouvé.");
    }

});

