const secretQuery = `ts=${secret.ts}&apikey=${secret.apiKey}&hash=${secret.hash}`;

const heroIds = JSON.parse(localStorage.getItem('favorite_heros'));


Object.values(heroIds).forEach(async (heroId) => {
    // Getting all characters data for home page

    let res = await fetch(`https://gateway.marvel.com/v1/public/characters/${heroId}?${secretQuery}`, {
        method: 'GET'
    });
    const jsonRes = await res.json();

    const hero = jsonRes.data.results;

    udpateFavoriteHero(hero[0]);
});

function udpateFavoriteHero(hero) {
    const mainContainer = document.getElementById('fav-main');

    const template = document.getElementById('template-main-items').content.cloneNode(true).children[0];
    // console.log(template)
    template.setAttribute('id', 'hero_card_'+hero.id);
    const cardImg = template.getElementsByClassName('card-img-top')[0];
    const cardTitle = template.getElementsByClassName('card-title')[0];
    const cardBody = template.getElementsByClassName('card-body')[0];
    const viewBtn = template.getElementsByClassName('view-btn')[0];
    const removeBtn = template.getElementsByClassName('remove-btn')[0];
    removeBtn.addEventListener('click', removeFavoriteHero);

    cardImg.setAttribute('src', hero.thumbnail.path + "." + hero.thumbnail.extension);
    cardImg.setAttribute('alt', hero.name);
    cardTitle.textContent = hero.name;

    // console.log(viewBtn);
    viewBtn.setAttribute('id', 'view_' + hero.id);
    removeBtn.setAttribute('id', 'remove_' + hero.id);

    viewBtn.addEventListener('click', (e) => viewHero(hero.id))

    mainContainer.append(template);
}

function viewHero(heroId) {
    localStorage.setItem('view_hero', heroId);
    
    location.replace(location.toString()+ '/../view.html');
}

function removeFavoriteHero(e){
    const id = e.target.id.split("_")[1];

    console.log(id);

    //First remove ID from local storage.
    if(localStorage.getItem('favorite_heros')){
        let arr = JSON.parse(localStorage.getItem('favorite_heros'));
        localStorage.setItem('favorite_heros', JSON.stringify(arr.filter(ids=>ids!=id)));
        
    }else{
        localStorage.setItem('favorite_heros', JSON.stringify([]));
    }

    //This will remove the card from Fav page UI
    document.getElementById('hero_card_'+id).remove(); 
    
}