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

        // Si le token n'est pas présent, masque le contenu
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
        // Supprime le token du localStorage
        localStorage.removeItem('accessToken');

        // Met à jour le texte du lien après la déconnexion
        updateLoginLinkText();
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
    }
}

export function handleLoginLinkClick(event) {

    // Vérifie si l'élément avec l'ID 'loginLink' existe avant de continuer
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

// Déclaration à un niveau supérieur (externalisation pour input)
let filteredData;
let categories;

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

/*------------------------------------------- Modal 1 -------------------------------------------*/


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
function displayUploadModal(data, categories) {
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


/*--------------------------------------- Modal 2 Validation coté client/API ---------------------------------------*/

/*--------------------------------------- Modal 2 upload image ---------------------------------------*/
export async function sendDataToAPI(title, categoryId, imageFile) {
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

// Nouvelle fonction pour mettre à jour la galerie après l'ajout ou la suppression d'une image
async function updateGallery() {
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