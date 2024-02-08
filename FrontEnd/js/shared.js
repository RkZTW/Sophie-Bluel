/*------------------------------------------- Log et affichage -------------------------------------------*/
// Fonction pour afficher/masquer les filtres en fonction de l'état de connexion
export function filtersVisibility() {
    const accessToken = localStorage.getItem('accessToken');
    const filtersHTML = document.getElementById('filters');

    if (filtersHTML) {
        filtersHTML.classList.toggle('custom-hidden', !!accessToken);
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
// Verifie si le token est présent ou non et agis sur login logout en fonction 
export function updateLoginLinkText() {
    const loginLink = document.getElementById('loginLink');
    const accessToken = localStorage.getItem('accessToken');

    if (loginLink) {
        loginLink.textContent = accessToken ? 'logout' : 'login';

        // Si le token n'est pas présent, masque le contenu
        if (!accessToken) {
            hideContent();
        }
    } else {
        console.error("L'élément avec l'ID 'loginLink' n'a pas été trouvé.");
    }

}

/*------------------------------------------- Galerie -------------------------------------------*/

// Éléments DOM nécessaires
const filtersHTML = document.getElementById('filters');
const galleryHTML = document.querySelector('.gallery');
export const parsedWorksData = [];

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

// Déclaration à un niveau supérieur (externalisation pour input)
export let filteredData;
export let categories;

// Fonction principale pour exécuter le script
export async function main() {
    try {
        const result = await getWorks();
        const worksData = result.works;

        if (worksData && worksData.length > 0) {
            parsedWorksData.push(worksData);
            const categoryArray = worksData.map(entry => entry.category.name);
            getCategory([...new Set(categoryArray)]);

            categories = [...new Set(categoryArray)];

            filteredData = filterData('sortAll', worksData);

            displayData(filteredData);
            displayGalleryModal(filteredData);

            categories = [...new Set(categoryArray)];
            displayUploadModal(filteredData, categories);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}

// categories est accessible en dehors de la fonction main
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

/*------------------------------------------- Modal -------------------------------------------*/
import { displayGalleryModal, displayUploadModal } from './modal.js';

// Nouvelle fonction pour mettre à jour la galerie après l'ajout ou la suppression d'une image
export async function updateGallery() {
    try {
        const result = await getWorks();
        const worksData = result.works;

        if (worksData && worksData.length > 0) {
            parsedWorksData.length = 0; // Efface les données existantes
            parsedWorksData.push(worksData);

            const categoryArray = worksData.map(entry => entry.category.name);
            getCategory([...new Set(categoryArray)]);

            const filteredData = filterData('sortAll', worksData);
            displayData(filteredData);

            // Mette à jour la galerie modal avec les nouvelles données
            displayGalleryModal(parsedWorksData[0]);
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la galerie :', error);
    }
}