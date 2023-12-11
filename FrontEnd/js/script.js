// Récupérateur d'élements html
const filtersHTML = document.getElementById('filters'); //selection de l'ID filter html
const galleryHTML = document.querySelector('.gallery');
const parsedWorksData = [];


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
// Début du script
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
        // push de worksData dans parsedWorksData
        parsedWorksData.push(worksData);
        // Pour chacune des données, on push leur "category.name" dans categoryArray
        worksData.forEach(function(){
            index++;
            categoryArray.push(worksData[index].category.name);
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
        let categoryHTML = `<input type='button' class="filters" id="${splittedCategory[0]}" value="${categories[index]}"></input>`
        // Incrémentation des boutons à notre element id="filters"
        filtersHTML.innerHTML += categoryHTML;
        }
     )
     // Création du bouton "tous"
     let categoryAll = `<input type='button' class="filters" id="sortAll" value="tous"></input>`
     // Incrémentation du bouton "tous"
     filtersHTML.innerHTML += categoryAll; 
     // Récupération des boutons possédant la classe "filters", généré dynamiquement précédémment
     let categoriesHTML = document.querySelectorAll('.filters');
     let i = -1;
     // Ajouter une fonction pour chacune des catégories générées (addEventListener)
     categoriesHTML.forEach(function(arg){
            let category = arg.value;
            let splittedCategory = category.split(' ');
            let filters = document.querySelectorAll('.filters')
            let worksData = parsedWorksData[0];
            switch (splittedCategory[0]) {
                case 'Objets' : 
                    arg.addEventListener("click",function(){
                        let filteredData = worksData.filter(data => data.category.name.includes("Objets"))
                        displayData(filteredData);
                })
                break;
                ;
                case 'Appartements':
                    arg.addEventListener("click",function(){
                        let filteredData = worksData.filter(data => data.category.name.includes("Appartements"))
                        displayData(filteredData);
                })
                break;
                ;
                case 'Hotels' :
                    arg.addEventListener("click",function(){
                        let filteredData = worksData.filter(data => data.category.name.includes("Hotels & restaurants"))
                        displayData(filteredData);
                })
                break;
                ;
                case 'tous' : 
                    arg.addEventListener("click",function(){
                        displayData(worksData);
                    })
                break;
                ;
                default : 
                displayData(worksData);
                break;
                ;
            }
     })
}
// fonction d'affichage 
function displayData(arg){
    let data = arg;
    let index = -1;
    // Réinitialisation des données dans la class html gallery
    galleryHTML.innerHTML = ""
    // Pour chaque donnée de worksData
    data.forEach(function(entry, index){
        // Génération du HTML
        let article = document.createElement('article');
        let div = document.createElement('div');
        let img = document.createElement('img');
        let h3 = document.createElement('h3');

        article.classList.add('entries');
        div.classList.add('entries_bkg');

        img.src = entry.imageUrl;
        img.alt = entry.title;
        h3.innerHTML = entry.title;

        div.appendChild(img);
        div.appendChild(h3);
        article.appendChild(div);
        galleryHTML.appendChild(article);
    }
    )
}

// Initialisation du script
main();
