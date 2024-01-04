import { showContent, updateLoginLinkText, filtersVisibility, main, addActiveClassToFilters } from './shared.js';

document.addEventListener('DOMContentLoaded', async function () {
    // Vérifie si l'utilisateur est connecté
    const isLoggedIn = window.isLoggedIn || false;

    // Affiche le contenu approprié en fonction de la connexion de l'utilisateur
    if (isLoggedIn) {
        showContent();
        updateLoginLinkText(true);
        // Appel de la fonction pour mettre à jour la visibilité du contenu en fonction de l'état de connexion
        filtersVisibility();
    }

    // Exécute la fonction principale et initialise les comportements
    main();
    addActiveClassToFilters();
    updateLoginLinkText();
});
