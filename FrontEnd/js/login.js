import { filtersVisibility, showContent, updateLoginLinkText } from './shared.js';
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

    // Fonction pour gérer le clic sur le bouton de connexion
    function handleConnectButtonClick(event) {
        event.preventDefault();

        const emailInput = document.getElementById('email').value;
        const passwordInput = document.getElementById('pass').value;

        login(emailInput, passwordInput);
    }

    // Fonction spécifique à la gestion de la connexion
    async function login(email, password) {
        // Code de gestion de la connexion
        const apiUrl = 'http://localhost:5678/api/users/login';
        const userid = {
            email: email,
            password: password
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userid),
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token;

                localStorage.setItem('accessToken', token);
                //affiche logout
                updateLoginLinkText();

                // Redirection immédiate après la connexion
                window.location.href = '/FrontEnd/index.html';
            } else {
                alert("Email ou Mot de passe incorrect. Veuillez réessayer de saisir vos informations");
            }
        } catch (error) {
            console.error('Erreur lors de la demande de connexion:', error);
        }
    }
});

function initEventListeners() {
    document.addEventListener('DOMContentLoaded', function () {

        const connectButton = document.getElementById('connect');
        const loginLink = document.getElementById('loginLink');

        if (connectButton) {
            connectButton.addEventListener('click', handleConnectButtonClick);
        } else {
            console.error("L'élément avec l'ID 'connect' n'a pas été trouvé.");
        }

        if (loginLink) {
            loginLink.addEventListener('click', handleLoginLinkClick);
        } else {
            console.error("L'élément avec l'ID 'loginLink' n'a pas été trouvé.");
        }

    });
}

function handleLoginLinkClick(event) {

    // Vérifie si l'élément avec l'ID 'loginLink' existe avant de continuer
    const loginLink = document.getElementById('loginLink');
    if (!loginLink) {
        console.error("L'élément avec l'ID 'loginLink' n'a pas été trouvé.");
        return;
    }

    const loginText = loginLink.textContent.trim().toLowerCase();

    if (loginText === 'logout') {
        logout();
    }
}

// Fonction de déco (vide le token dans localstorage)+ appel a le function updateLoginLinkText (modifie logout en login)
function logout() {

    try {
        // Supprime le token du localStorage
        localStorage.removeItem('accessToken');

        // Met à jour le texte du lien après la déconnexion
        updateLoginLinkText();
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
    }
}







