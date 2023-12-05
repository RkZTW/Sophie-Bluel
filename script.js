// Récupérateur d'élements html
const filtersHTML = document.getElementById('filters'); //selection de l'ID filter html
const galleryHTML = document.querySelector('.gallery');


//fetch partie 2.// 
//Récupération donnée API (méthode fetch).
async function getWorks() {
    const r = await fetch("http://localhost:5678/api/works"),
         data = await r.json();
    let works = data
    return ( {
        works: [...works],
    })
}

// Fetch partie 1.
async function main() {
    try {
        // Récupération donnée API de Fetch partie 2.
        const result = await getWorks();
        // stockage des données dans la variable worksData
        const worksData = result.works;
        // Incrémenteur d'index pour se situer dans forEach
        let index = -1;
        // Initiliasateur du tableau comprenant nos catégories
        let categoryArray = []
        // Pour chacune des données, on push leur "category.name" dans categoryArray
        worksData.forEach(function(){
            index++;
            categoryArray.push(worksData[index].category.name)
        })

        //Initialisation des catégories
        getCategory(categoryArray);
        //Initialisation de l'affichage des données
        displayData(worksData);
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}
// Fonction pour supprimer les duplicatas des catégories
function getCategory(arg){
    //Permet de supprimer tous les duplicatas
    const categories = [...new Set(arg)] // set = enssemble de catégorie "unique" (pas de duplicata)
    // On envoie le resultats à la fonction d'initialisation de l'affichage des catégories
    categoriesDisplay(categories)
}

// Permet l'affichage des catégories
function categoriesDisplay(arg) {
    // Récupération des catégories triées
    let categories = arg
    let index = -1;
    // Pour chacune des catégories
    categories.forEach(function(){
        index++
        // On sépare les catégories contenant un espace pour n'afficher que le premier mot, qu'on puisse l'utiliser en temps qu'id
        // Exemple : "Hotel et Restaurant" deviendra splittedCategory[0] = "Hotel" ,splittedCategory[1] = " ", splittedCategory[2] = "et",  splittedCategory[3] = " ", splittedCategory[4] = "restaurant".
        let splittedCategory = categories[index].split(' ')
        // Création des éléments html (bouttons)
        let categoryHTML = `<input type='button' class="filters" id="${splittedCategory[0]}">${categories[index]}</input>`
        // Incrémentation des boutons à notre element id="filters"
        filtersHTML.innerHTML += categoryHTML;
        }
     )
     // Création du bouton "tous"
     let categoryAll = `<input type='button' class="filters" id="sortAll">Tous</input>`
     // Incrémentation du bouton "tous"
     filtersHTML.innerHTML += categoryAll; 
     // Récupération des boutons possédant la classe "filters", généré dynamiquement précédémment
     let categoriesHTML = document.querySelectorAll('.filters');
     let i = -1;
     // Ajouter une fonction pour chacune des catégories générées (addEventListener)
     categoriesHTML.forEach(function(arg){
            i++
            console.log(arg);
            let category = arg[i];
            let filters = document.querySelectorAll('.filters')
            /*switch (category) {
                case 'objets" : 
                //;
                case 'appartements': 
                //;
                case 'hotel' : 
                //;
            }*/
     })
}

// Affichage des données globales (filtrées, ou non)
function displayData(arg){
    let data = arg;
    let index = -1;
    // Réinitialisation des données dans la class html gallery
    galleryHTML.innerHTML = ""
    // Pour chaque donnée de worksData
    data.forEach(function(){
        index++
        // Génération du HTML
        let entryHtml = 
            `<article class="entries">
                <div class="entries_bkg">
                    <img src="${data[index].imageUrl}" alt="${data[index].title}"/>
                </div>
            </article>`
        galleryHTML.innerHTML += entryHtml;
        }
    )
}


// Initialisation du script
main();
