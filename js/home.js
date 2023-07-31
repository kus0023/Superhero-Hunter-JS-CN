const secretQuery = `ts=${secret.ts}&apikey=${secret.apiKey}&hash=${secret.hash}`;

//Search and its data
const searchElem = document.getElementById('search');

//To prevent multiple api call.
let apiCalledTimeout;

searchElem.addEventListener('keyup', (e) => {
    const searchData = e.target.value;

    //call the search api only when we have atleast 3 characters in search box
    if (searchData.length > 2) {

        //This will prevent calling the search api 
        //Clearing the prev api call if exists

        clearTimeout(apiCalledTimeout);

        //Calling the api after 3 sec if user stops writing in search input.
        //also it will prevent calling the fetch api until user stops writing 
        apiCalledTimeout = setTimeout(() => {
            getSearchDataAndUpdateList(searchData);
        }, 3000);

    }
})

function getSearchDataAndUpdateList(heroStartingName) {
    //Here we will get data from api and update the search list
    fetch('https://gateway.marvel.com/v1/public/characters?' + secretQuery + '&nameStartsWith=' + heroStartingName)
        .then(res => res.json())
        .then(jsonRes => {
            console.log(jsonRes);

            const heros = jsonRes.data.results;

            updateHomePageData(heros);
        })
}

// Getting all characters data for home page
fetch('https://gateway.marvel.com/v1/public/characters?' + secretQuery, {
    method: 'GET'
})
    .then(res => res.json())
    .then((jsonRes) => {

        const heros = jsonRes.data.results;

        updateHomePageData(heros);

    });

function updateHomePageData(heros) {

    const mainContainer = document.getElementById('home-main');
    mainContainer.innerHTML = ""; //clear the content of home page

    heros.forEach(hero => {
        const template = document.getElementById('template-main-items').content.cloneNode(true).children[0];
        // console.log(template)
        const cardImg = template.getElementsByClassName('card-img-top')[0];
        const cardTitle = template.getElementsByClassName('card-title')[0];
        const cardBody = template.getElementsByClassName('card-body')[0];
        const viewBtn = template.getElementsByClassName('view-btn')[0];
        const addBtn = template.getElementsByClassName('add-btn')[0];
        const removeBtn = template.getElementsByClassName('remove-btn')[0];

        cardImg.setAttribute('src', hero.thumbnail.path + "." + hero.thumbnail.extension);
        cardImg.setAttribute('alt', hero.name);
        cardTitle.textContent = hero.name;

        // console.log(viewBtn);
        viewBtn.setAttribute('id', 'view_' + hero.id);
        addBtn.setAttribute('id', 'add_' + hero.id);
        removeBtn.setAttribute('id', 'remove_' + hero.id);

        addBtn.addEventListener('click', addFavoriteHero);
        removeBtn.addEventListener('click', removeFavoriteHero);

        viewBtn.addEventListener('click', (e) => viewHero(hero.id))

        if (localStorage.getItem('favorite_heros')) {
            let arr = JSON.parse(localStorage.getItem('favorite_heros'));


            if (Object.values(arr).includes(hero.id + '')) {
                removeBtn.removeAttribute('hidden');
                addBtn.setAttribute('hidden', true);
            } else {
                addBtn.removeAttribute('hidden');
                removeBtn.setAttribute('hidden', true);
            }
        }

        mainContainer.append(template);
    });

    //update the header or navigation fav hero count
    const heroCountElem = document.getElementById('hero-count');
    heroCountElem.innerHTML = JSON.parse(localStorage.getItem('favorite_heros')).length;
}

// Add favorite hero
function addFavoriteHero(e) {
    const id = e.target.id.split("_")[1];
    if (localStorage.getItem('favorite_heros')) {
        let arr = JSON.parse(localStorage.getItem('favorite_heros'));

        localStorage.setItem('favorite_heros', JSON.stringify([...arr, id]));

    } else {

        localStorage.setItem('favorite_heros', JSON.stringify([id]));

    }

    toggleButton(id);
}

function removeFavoriteHero(e) {
    const id = e.target.id.split("_")[1];
    if (localStorage.getItem('favorite_heros')) {
        let arr = JSON.parse(localStorage.getItem('favorite_heros'));

        localStorage.setItem('favorite_heros', JSON.stringify(arr.filter(ids => ids != id)));

    } else {

        localStorage.setItem('favorite_heros', JSON.stringify([]));

    }
    toggleButton(id);
}

function toggleButton(id) {
    const addButton = document.getElementById('add_' + id);
    const removeButton = document.getElementById('remove_' + id);

    let arr = JSON.parse(localStorage.getItem('favorite_heros'));

    if (Object.values(arr).includes(id + '')) {
        removeButton.removeAttribute('hidden');
        addButton.setAttribute('hidden', true);
    } else {
        addButton.removeAttribute('hidden');
        removeButton.setAttribute('hidden', true);
    }

    //update the header or navigation fav hero count
    const heroCountElem = document.getElementById('hero-count');
    heroCountElem.innerHTML = JSON.parse(localStorage.getItem('favorite_heros')).length;
}


function viewHero(heroId) {
    localStorage.setItem('view_hero', heroId);
    location.replace('/view.html');
}