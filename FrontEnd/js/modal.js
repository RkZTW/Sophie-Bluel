document.addEventListener('DOMContentLoaded', async function () {
    // Vérifie si l'utilisateur est connecté
    const isLoggedIn = window.isLoggedIn || false;

    // Affiche le contenu approprié en fonction de la connexion de l'utilisateur
    if (isLoggedIn) {
        displayGalleryModal();
    }

});

/*------------------------------------------- Modal 1 -------------------------------------------*/

export function displayGalleryModal(arg) {
    createGalleryModal();
    const data = arg;
    const container = document.querySelector('.modal__gallery');

    data.forEach(entry => {
        const imgContainer = document.createElement('figure'); // Conteneur pour chaque image
        imgContainer.classList.add('modal__image-container');

        const img = document.createElement('img');
        img.classList.add('modal__gallery--img');
        img.src = entry.imageUrl;

        // Supprime l'image du conteneur gallery (trash icon)
        const trashIcon = document.createElement('i');
        trashIcon.classList.add('fa-solid', 'fa-trash-can', 'fa-xs', 'modal__gallery--trash');
        trashIcon.addEventListener('click', function () {
            //fonction deleteWork avec l'identifiant 
            deleteWork(entry.id);
        });

        imgContainer.appendChild(img);
        imgContainer.appendChild(trashIcon);
        container.appendChild(imgContainer);
    });
}
import { parsedWorksData } from './shared.js';
import { filteredData } from './shared.js';
import { categories } from './shared.js';
// Récupére l'élément modal par sa classe
export function createGalleryModal() {
    const modal = document.querySelector('.modal');

    if (!modal) {
        console.error("La classe 'modal' n'existe pas.");
        return;
    }

    // Supprime tout contenu existant à l'intérieur de la modal
    modal.innerHTML = '';

    // Création des éléments dynamiques
    const sectionModal = document.createElement('section');
    sectionModal.classList.add('modal__pages');

    const iconClose = document.createElement('i');
    iconClose.classList.add('fa-solid', 'fa-xmark', 'fa-xl', 'modal__close-icon');

    const titleModal = document.createElement('h2');
    titleModal.innerHTML = "Galerie photo";
    titleModal.classList.add('modal__title');

    const galleryContainer = document.createElement('article');
    galleryContainer.classList.add('modal__gallery');

    const lineModal = document.createElement('div');
    lineModal.classList.add('line');

    const inputModal = document.createElement('input');
    inputModal.type = 'submit';
    inputModal.value = 'Ajouter une photo';
    inputModal.classList.add('modal__input');

    // Ajoute les éléments à l'élément modal
    modal.appendChild(sectionModal);
    sectionModal.appendChild(iconClose);
    sectionModal.appendChild(titleModal);
    sectionModal.appendChild(galleryContainer);
    sectionModal.appendChild(lineModal);
    sectionModal.appendChild(inputModal);

    // modal doit rester fermée par défaut 
    let modalShouldStayOpen = false;

    // Fonction pour ouvrir la modal
    function openModal() {
        modal.classList.add('modal-visible');
        modalShouldStayOpen = true;
        // Affiche la page de la galerie par défaut lors de l'ouverture
        sectionModal.style.display = 'block';
    }

    // Fonction pour fermer la modal
    function closeModal() {
        modal.classList.remove('modal-visible');
        modalShouldStayOpen = false;
    }

    // Gestionnaire d'événements pour l'ouverture de la modal
    const contenu2Div = document.getElementById('contenu2');

    if (!contenu2Div) {
        console.error("L'élément 'contenu2' n'existe pas.");
        return;
    }
    contenu2Div.addEventListener('click', (event) => {
        event.stopPropagation();
        openModal();
        displayGalleryModal(parsedWorksData[0]);
    });

    // Gestionnaire d'événements pour fermer la modal
    window.addEventListener('click', (event) => {
        // Vérifie si le clic est en dehors de la modal et que la modal doit se fermer
        if (modalShouldStayOpen && !event.target.closest('.modal__pages')) {
            closeModal();
        }
    });

    // Gestionnaire de fermeture de la modal au clic sur la div "i" icone X (croix)
    const closeIcon = document.querySelector('.modal__close-icon');
    closeIcon.addEventListener('click', () => {
        closeModal();
    });

    // Bouton pour ajouter une photo = affichage modal 2

    inputModal.addEventListener('click', (event) => {
        displayUploadModal(filteredData, categories);
    });
}






/*------------------------------------------- Modal 2 -------------------------------------------*/



export function createUploadModal() {
    const modal = document.querySelector('.modal');
    if (modal) {

        // Supprime tout contenu existant à l'intérieur de la modal
        modal.innerHTML = '';

        // Création des éléments dynamiques
        const sectionModal = document.createElement('section');
        sectionModal.classList.add('modal__pages');

        const iconBack = document.createElement('i');
        iconBack.classList.add('fa-solid', 'fa-arrow-left', 'fa-xl', 'modal__back-icon');

        const iconClose = document.createElement('i');
        iconClose.classList.add('fa-solid', 'fa-xmark', 'fa-xl', 'modal__close-icon');

        const titleModal = document.createElement('h2');
        titleModal.innerHTML = "Ajout photo";
        titleModal.classList.add('modal__title');

        const container = document.createElement('article');
        container.classList.add('modal__gallery');

        const lineModal = document.createElement('div');
        lineModal.classList.add('line');

        // Ajoute le bouton de validation à l'élément container
        const inputGlobal = document.createElement('input');
        inputGlobal.type = 'submit';
        inputGlobal.value = 'Valider';
        inputGlobal.classList.add('input__default');
        inputGlobal.id = 'uploadGlobal';

        // Ajoute les éléments à l'élément modal
        modal.appendChild(sectionModal);
        sectionModal.appendChild(iconBack);
        sectionModal.appendChild(iconClose);
        sectionModal.appendChild(titleModal);
        sectionModal.appendChild(container);
        sectionModal.appendChild(lineModal);
        sectionModal.appendChild(inputGlobal);

    } else {
        console.error("class 'modal' do not exists.");
    }

    // Gestion de fermeture de la modal au clic sur la div "i" icone X (croix)
    const closeIcon = document.querySelector('.modal__close-icon');
    closeIcon.addEventListener('click', function () {
        modal.classList.remove('modal-visible'); // Classe pour fermer la modal (.remove)
    });

    // Gestion de retour de la modal au clic sur la div "i" icone arrow-left (fleche)
    const backIcon = document.querySelector('.modal__back-icon');
    backIcon.addEventListener('click', function () {
        displayGalleryModal(parsedWorksData[0]);
    });

}
let selectedCategoryId;
export function displayUploadModal(data, categories) {
    createUploadModal();
    const container = document.querySelector('.modal__gallery');
    let imageFile;

    const modulUpload = document.createElement('div');
    modulUpload.classList.add('modul__upload');

    const iconUpload = document.createElement('i');
    iconUpload.classList.add('fa-regular', 'fa-image', 'icon__upload');

    // Création de l'élément div avec la classe "button-wrapper"
    const buttonWrapper = document.createElement('div');
    buttonWrapper.classList.add('button-wrapper');

    // Création de l'élément span avec la classe "label"
    const labelSpan = document.createElement('span');
    labelSpan.classList.add('label');

    // Création de l'élément input de type fichier
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.id = 'fileInput';
    fileInput.name = 'upload';
    fileInput.classList.add('input__upload', 'image-button');

    const txtUpload = document.createElement('div');
    txtUpload.innerHTML = "jpg, png : 4mo max";
    txtUpload.classList.add('txt__upload');

    const titleUpload = document.createElement('div');
    titleUpload.innerHTML = "Titre";
    titleUpload.classList.add('title__upload');

    const inputTitleUpload = document.createElement('input');
    inputTitleUpload.type = 'text';
    inputTitleUpload.value = '';
    inputTitleUpload.classList.add('input__title');

    const titleCategorieUpload = document.createElement('div');
    titleCategorieUpload.innerHTML = "Catégorie";
    titleCategorieUpload.classList.add('categorie__title');

    const selectCategoriesUpload = selectCategoryDropdown(categories);

    container.appendChild(modulUpload);
    modulUpload.appendChild(iconUpload);
    buttonWrapper.appendChild(fileInput);
    buttonWrapper.appendChild(labelSpan);
    modulUpload.appendChild(buttonWrapper);
    modulUpload.appendChild(txtUpload);
    container.appendChild(titleUpload);
    container.appendChild(inputTitleUpload);
    container.appendChild(titleCategorieUpload);
    container.appendChild(selectCategoriesUpload);

    const imagePreview = document.createElement('img');
    imagePreview.classList.add('image-preview-off');
    modulUpload.appendChild(imagePreview);

    labelSpan.addEventListener('click', function () {
        fileInput.click();

        // Vérifie si l'image est déjà chargée (au cas où l'utilisateur a annulé la sélection précédente)
        if (imageFile) {
            showAlertAndPreview();
        }

        // Écoute l'événement de changement de l'image après le choix de l'utilisateur
        fileInput.addEventListener('change', function () {
            // Récupère le fichier sélectionné
            imageFile = fileInput.files[0];
            imagePreview.classList.remove('image-preview-off');
            imagePreview.classList.add('image-preview');
            const inputGlobal = document.getElementById('uploadGlobal');
            inputGlobal.classList.remove('input__default');
            inputGlobal.classList.add('input__green');


            // Affiche l'alerte et la prévisualisation
            showAlertAndPreview();
        });
    });

    // Fonction pour afficher l'alerte et prévisualiser l'image
    const showAlertAndPreview = () => {
        if (!imageFile) {
            alert('Veuillez sélectionner une image.');
            return;
        }

        const allowedFormats = ['jpg', 'jpeg', 'png'];
        const imageFormat = imageFile.name.split('.').pop().toLowerCase();
        if (!allowedFormats.includes(imageFormat)) {
            alert('Le format de l\'image doit être jpg ou png.');
            return;
        }

        const maxFileSize = 4 * 1024 * 1024; // 4 Mo 
        if (imageFile.size > maxFileSize) {
            alert('La taille de l\'image ne doit pas dépasser 4 Mo.');
            return;
        }

        // Crée un Blob à partir des données de l'image
        const blobImage = new Blob([imageFile], { type: imageFile.type });

        // Ajoute l'aperçu de l'image
        if (!imagePreview.classList.contains('image-preview')) {
            // Ajoute la classe 'image-preview' seulement si elle n'est pas déjà présente
            imagePreview.classList.add('image-preview');
        }

        imagePreview.src = URL.createObjectURL(blobImage);

        // Supprime les éléments inutiles
        if (modulUpload.contains(iconUpload)) {
            modulUpload.removeChild(iconUpload);
        }
        if (modulUpload.contains(txtUpload)) {
            modulUpload.removeChild(txtUpload);
        }
        if (modulUpload.contains(buttonWrapper)) {
            modulUpload.removeChild(buttonWrapper);
        }
    };

    const inputGlobal = document.getElementById('uploadGlobal');
    inputGlobal.addEventListener('click', function () {
        sendDataToAPI(inputTitleUpload.value, selectedCategoryId, imageFile);
    });
}


function selectCategoryDropdown(categoryList) {
    const selectCategoriesUpload = document.createElement('select');
    selectCategoriesUpload.classList.add('select__categories');

    // Ajoute une option vide par défaut
    const defaultOption = document.createElement('option');
    defaultOption.text = 'Sélectionner une catégorie';
    defaultOption.value = ''; // La valeur vide
    selectCategoriesUpload.appendChild(defaultOption);

    // Ajoute les options de catégories à partir du tableau 'categoryList'
    if (categoryList) {
        categoryList.forEach(function (category) {
            const option = document.createElement('option');
            option.value = category;
            option.text = category;
            selectCategoriesUpload.appendChild(option);
        });
    }

    // Écoute l'événement de changement de la catégorie sélectionnée
    selectCategoriesUpload.addEventListener('change', function () {
        // Récupère la catégorie sélectionnée
        const selectedCategory = selectCategoriesUpload.value;

        // Utilise selectedCategory pour obtenir l'ID correspondant
        const categoryId = filterCategoryId(selectedCategory);

        // Mise à jour de la variable globale selectedCategoryId
        selectedCategoryId = categoryId;
    });

    return selectCategoriesUpload;
}

// Fonction pour obtenir l'ID en fonction de la catégorie sélectionnée
function filterCategoryId(selectedCategory) {
    const lowerCaseCategory = selectedCategory.trim().toLowerCase();

    switch (lowerCaseCategory) {
        case 'objets':
            return 1;
        case 'appartements':
            return 2;
        case 'hotels & restaurants':
            return 3;
        default:
            return -1; // Valeur par défaut si la catégorie n'est pas reconnue
    }
}
async function sendDataToAPI(title, categoryId, imageFile) {
    const apiUrl = 'http://localhost:5678/api/works';
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', categoryId);
    formData.append('image', imageFile);
    const token = localStorage.getItem('accessToken');

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            const fileName = result.fileName;
            const imageURL = `http://localhost:5678/images/${fileName}`;

            return imageURL;
        } else {
            const errorText = await response.text();
            console.error('Erreur lors de la réponse de l\'API:', errorText);
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi des données à l\'API:', error);
    }
}
async function deleteWork(id) {
    try {
        const authToken = localStorage.getItem('accessToken');

        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        });

        if (response.ok) {
            // Actualise la galerie après la suppression
            updateGallery();
        } else {
            console.error('Échec de la suppression de l\'œuvre');
        }
    } catch (error) {
        console.error('Erreur lors de la requête DELETE:', error);
    }
}