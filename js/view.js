const secretQuery = `ts=${secret.ts}&apikey=${secret.apiKey}&hash=${secret.hash}`;

const viewHeroId = localStorage.getItem('view_hero');

const url = `https://gateway.marvel.com/v1/public/characters/${viewHeroId}?${secretQuery}`;


fetch(url)
    .then(res => res.json())
    .then(resJson => {
        console.log(resJson);
        const hero = resJson.data.results[0];
        updateUI(hero);
    });

function updateUI(hero) {

    console.log(hero);

    const title = document.getElementById('hero-name');
    const description = document.getElementById('hero-description');
    const heroImage = document.getElementById('hero-image');
    const comicsCount = document.getElementById('comics');
    const storiesCount = document.getElementById('stories');
    const eventsCount = document.getElementById('events');
    const seriesCount = document.getElementById('series');

    // 'src', hero.thumbnail.path + "." + hero.thumbnail.extension

    title.textContent = hero.name
    if (hero.description == '') {
        description.textContent = "Not much information found."
    } else {
        description.textContent = hero.description
    }

    heroImage.setAttribute('src', hero.thumbnail.path + "." + hero.thumbnail.extension);

    comicsCount.textContent = "Comics: " + hero.comics.available;
    storiesCount.textContent = "Stories: " + hero.stories.available;
    eventsCount.textContent = "Events: " + hero.events.available;
    seriesCount.textContent = "Series: " + hero.series.available;

    //Update the title
    document.title = hero.name

}


document.getElementById('home-btn').addEventListener('click', (e)=>{
    location.replace(location.toString()+'/..')
})