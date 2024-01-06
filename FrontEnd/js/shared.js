export function initEventListeners() {
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

// fonction pour supprimer le display none (custom-hidden)
export function showContent() {
    const contenuElement1 = document.getElementById('contenu1');
    const contenuElement2 = document.getElementById('contenu2');
    const filtersHTML = document.getElementById('filters');

    if (contenuElement1) {
        contenuElement1.classList.remove('custom-hidden');
    }

    if (contenuElement2) {
        contenuElement2.classList.remove('custom-hidden');
    }
}

// function pour ajouter le display none (custom-hidden) et il boucle pour remettre la class une fois déco 
export function hideContent() {
    const hiddenElements = document.querySelectorAll('.custom-hidden');
    hiddenElements.forEach(element => {
        element.classList.add('custom-hidden');
    });

    const contenuElement1 = document.getElementById('contenu1');
    const contenuElement2 = document.getElementById('contenu2');
    const filtersHTML = document.getElementById('filters');

    if (contenuElement1) {
        contenuElement1.classList.add('custom-hidden');
    }

    if (contenuElement2) {
        contenuElement2.classList.add('custom-hidden');
    }
}

// Fonction pour afficher/masquer les filtres en fonction de l'état de connexion
export function filtersVisibility() {
    const accessToken = localStorage.getItem('accessToken');
    const filtersHTML = document.getElementById('filters');

    if (filtersHTML) {
        filtersHTML.classList.toggle('custom-hidden', !!accessToken);
    }
}

// Verifie si le token est présent ou non et agis sur login logout en fonction 
export function updateLoginLinkText() {
    const loginLink = document.getElementById('loginLink');
    const accessToken = localStorage.getItem('accessToken');

    if (loginLink) {
        loginLink.textContent = accessToken ? 'logout' : 'login';

        // Si le token n'est pas présent, masquer le contenu
        if (!accessToken) {
            hideContent();
        }
    } else {
        console.error("L'élément avec l'ID 'loginLink' n'a pas été trouvé.");
    }

}

// Fonction de déco (vide le token dans localstorage)+ appel a le function updateLoginLinkText (modifie logout en login)
export function logout() {

    try {
        // Supprimer le token du localStorage
        localStorage.removeItem('accessToken');

        // Mettre à jour le texte du lien après la déconnexion
        updateLoginLinkText();
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
    }
}

export function handleLoginLinkClick(event) {

    // Vérifier si l'élément avec l'ID 'loginLink' existe avant de continuer
    const loginLink = document.getElementById('loginLink');
    if (!loginLink) {
        console.error("L'élément avec l'ID 'loginLink' n'a pas été trouvé.");
        return;
    }

    const loginText = loginLink.textContent.trim().toLowerCase();

    if (loginText === 'logout') {
        logout();
    } else {
        console.error("L'élément avec l'ID 'loginLink' n'a pas été trouvé.");
    }
}

export function handleConnectButtonClick(event) {
    event.preventDefault();

    const emailInput = document.getElementById('email').value;
    const passwordInput = document.getElementById('pass').value;

    login(emailInput, passwordInput);
}

export async function login(email, password) {
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
/*------------------------------------------- Filtre galerie -------------------------------------------*/

// Éléments DOM nécessaires
const filtersHTML = document.getElementById('filters');
const galleryHTML = document.querySelector('.gallery');
const parsedWorksData = [];

// Fonction asynchrone pour obtenir les données de la galerie depuis l'API
export async function getWorks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        const data = await response.json();
        return {
            works: [...data],
        };
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        throw error;
    }
}

// Fonction principale pour exécuter le script
export async function main() {
    try {
        const result = await getWorks();
        const worksData = result.works;

        if (worksData && worksData.length > 0) {
            parsedWorksData.push(worksData);
            const categoryArray = worksData.map(entry => entry.category.name);
            getCategory([...new Set(categoryArray)]);
            const filteredData = filterData('sortAll', worksData);
            displayData(filteredData);
            displayModal(filteredData);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}

let currentCategory = 'sortAll';

// Fonction pour obtenir et afficher les catégories de galerie
function getCategory(arg) {
    const categories = arg;
    categoriesDisplay(categories);
}

// Fonction pour afficher les catégories
function categoriesDisplay(arg) {
    const categories = arg;

    // Crée le filtre pour "Tous"
    const categoryAll = createFilterButton('Tous', 'sortAll', true);
    filtersHTML.appendChild(categoryAll);

    // Crée les filtres pour chaque catégorie
    categories.forEach(category => {
        const splittedCategory = category.split(' ');
        const categoryHTML = createFilterButton(category, splittedCategory[0]);
        filtersHTML.appendChild(categoryHTML);
    });

    // Gère les clics sur les filtres
    document.querySelectorAll('.filters').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.filters').forEach(btn => {
                btn.classList.remove('active');
            });

            btn.classList.add('active');
            const worksData = parsedWorksData[0];
            const filteredData = filterData(btn.id, worksData);
            displayData(filteredData);
        });
    });
}

// Fonction pour créer un bouton de filtre
function createFilterButton(label, id, isActive = false) {
    const filterButton = document.createElement('input');
    filterButton.setAttribute('type', 'button');
    filterButton.setAttribute('class', `filters${isActive ? ' active' : ''}`);
    filterButton.setAttribute('id', id);
    filterButton.setAttribute('value', label);
    return filterButton;
}

// Fonction pour filtrer les données en fonction de la catégorie sélectionnée
function filterData(categoryId, data) {
    if (!data) {
        console.error("Data is undefined or null");
        return [];
    }

    switch (categoryId) {
        case 'Objets':
            return data.filter(entry => entry.category && entry.category.name.includes("Objets"));
        case 'Appartements':
            return data.filter(entry => entry.category && entry.category.name.includes("Appartements"));
        case 'Hotels':
            return data.filter(entry => entry.category && entry.category.name.includes("Hotels & restaurants"));
        default:
            return data;
    }
}

// Fonction pour afficher les données filtrées dans la galerie
export function displayData(arg) {
    const data = arg;
    galleryHTML.innerHTML = "";
    data.forEach(entry => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');

        figure.classList.add('entries');

        img.src = entry.imageUrl;
        img.alt = entry.title;
        figcaption.innerHTML = entry.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        galleryHTML.appendChild(figure);
    });
}

// Fonction pour ajouter une classe active aux filtres
export function addActiveClassToFilters() {
    const filters = document.querySelectorAll('.filters');
    filters.forEach(filter => {
        filter.addEventListener('click', function () {
            filters.forEach(otherFilter => {
                otherFilter.classList.remove('active');
            });

            filter.classList.toggle('active');
            active(filter);
        });
    });
}

/*------------------------------------------- Modal 1 -------------------------------------------*/


// Récupérer l'élément modal par sa classe
export function createModal() {
    const modal = document.querySelector('.modal');
    if (modal) {

        // Supprime tout contenu existant à l'intérieur de la modal
        modal.innerHTML = '';

        // Création des éléments dynamiques
        const sectionModal = document.createElement('section');
        sectionModal.classList.add('modal__pages');

        const iconClose = document.createElement('i');
        iconClose.classList.add('fa-solid', 'fa-xmark', 'fa-xl', 'modal__close-icon');

        const titleModal = document.createElement('h2');
        titleModal.innerHTML = "Galerie photo"
        titleModal.classList.add('modal__title');

        const container = document.createElement('article');
        container.classList.add('modal__gallery');

        const lineModal = document.createElement('div');
        lineModal.classList.add('line');

        const inputModal = document.createElement('input');
        inputModal.type = 'submit';
        inputModal.value = 'Ajouter une photo';
        inputModal.classList.add('modal__input')

        // Ajouter les éléments à l'élément modal
        modal.appendChild(sectionModal);
        sectionModal.appendChild(iconClose);
        sectionModal.appendChild(titleModal);
        sectionModal.appendChild(container);
        sectionModal.appendChild(lineModal);
        sectionModal.appendChild(inputModal);
    } else {
        console.error("class 'modal' do not exists.");
    }

    // Gestion de l'ouverture de la modal au clic sur la div "contenu2"
    const contenu2Div = document.getElementById('contenu2');
    contenu2Div.addEventListener('click', function () {
        modal.classList.add('modal-visible'); // Classe pour afficher la modal (.add)
    });

    // Gestion de fermeture de la modal au clic sur la div "i"
    const closeIcon = document.querySelector('.modal__close-icon');
    closeIcon.addEventListener('click', function () {
        modal.classList.remove('modal-visible'); // Classe pour fermer la modal (.remove)
    });
}

export function displayModal(arg) {
    createModal();
    const data = arg;
    const container = document.querySelector('.modal__gallery');

    data.forEach(entry => {
        const imgContainer = document.createElement('figure'); // Conteneur pour chaque image
        imgContainer.classList.add('modal__image-container');

        const img = document.createElement('img');
        img.classList.add('modal__gallery--img');
        img.src = entry.imageUrl;

        const trashIcon = document.createElement('i');
        trashIcon.classList.add('fa-solid', 'fa-trash-can','fa-xs', 'modal__gallery--trash');
        trashIcon.addEventListener('click', function () {
            // logique pour supprimer l'image
            imgContainer.remove(); // Supprime l'image du conteneur
        });

        imgContainer.appendChild(img);
        imgContainer.appendChild(trashIcon);
        container.appendChild(imgContainer);
    });
}

