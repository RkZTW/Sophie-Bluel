import { getWorks, displayData } from './shared.js';

document.addEventListener('DOMContentLoaded', async function () {
    // Vérifie si l'utilisateur est connecté
    const isLoggedIn = window.isLoggedIn || false;

    // Affiche le contenu approprié en fonction de la connexion de l'utilisateur
    if (isLoggedIn) {
        showContent();
    }


    // Récupérer l'élément modal par sa classe
const modal = document.querySelector('.modal');
if (modal) {

// Supprime tout contenu existant à l'intérieur de la modal
modal.innerHTML = '';

// Création des éléments dynamiques
const sectionModal = document.createElement('section');
sectionModal.classList.add('modal__pages');

const iconClose = document.createElement('i');
iconClose.classList.add('fa-solid', 'fa-xmark', 'fa-xl');

const titleModal = document.createElement('h2');
titleModal.innerHTML = "Galerie photo"
titleModal.classList.add('modal__title');

const figure = document.createElement('figure');
figure.classList.add('modal__gallery');

const img = document.createElement('img');
img.classList.add('modal__gallery--img');

const trash = document.createElement('i');
trash.classList.add('modal__gallery--trash');

const lineModal = document.createElement('div');
lineModal.classList.add('line');

const inputModal = document.createElement('input');
inputModal.type = 'submit';
inputModal.value = 'Ajouter une photo';
inputModal.classList.add ('modal__input')

// Ajouter les éléments à l'élément modal
modal.appendChild(sectionModal);
sectionModal.appendChild(iconClose);
sectionModal.appendChild(titleModal);
sectionModal.appendChild(figure);
figure.appendChild(img);
img.appendChild(trash);
sectionModal.appendChild(lineModal);
sectionModal.appendChild(inputModal);
} else {
    console.error("class 'modal' do not exists.");
}


// Gestion de l'ouverture de la modal au clic sur la div "contenu2"
const contenu2Div = document.getElementById('contenu2');

contenu2Div.addEventListener('click', function () {
    modal.classList.add('modal-visible'); // Classe pour afficher la modal
});

});