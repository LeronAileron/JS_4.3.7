let reposArr = [];
const search = document.querySelector('.search');

//поисковая строка

autoRepos = debounce(autoRepos, 200)

const input = document.querySelector('input');

input.addEventListener('input', autoRepos)

function debounce(cb, ms) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => cb.apply(this, args), ms);
    }
}


async function autoRepos(e) {
    const pErr = document.querySelector('.p-error');
    if (pErr) pErr.remove();
    const pErrMes = document.querySelector('.p-error--message');
    if (pErrMes) pErrMes.remove();


    const userInput = e.target.value.trim();
    if (!userInput) {
        removeLIs()
    } else {
        let reposHeads;
        let response;
        try {
            try {
                reposHeads = await fetch(`https://api.github.com/search/repositories?q=${userInput}`);
                response = await reposHeads.json();
            } catch(err) {
                errorHere(err)
            }
            const repos = response.items;
            createLIs(repos);

            reposArr = repos;
            return repos;
        } catch (err) {
            errorHere(err);
        }

    }
}

function errorHere(e) {
    const p = document.createElement('p');
    p.classList.add('p-error');
    p.textContent = 'Возникла ошибка: ';

    const pError = document.createElement('p');
    pError.classList.add('p-error');
    pError.classList.add('p-error--message');
    pError.textContent = e;

    appendChild(search, p);
    appendChild(search, pError);
}


function createLIs(repos) {
    for (let i = 0; i < 5; i++) {
        const ul = document.querySelector('ul');

        let currentLIs = document.querySelectorAll('li');
        let li = document.createElement('li');
        li.classList.add('autocom-box__li');

        if (!repos[i]) {
            li.classList.add('autocom-box__li--not-found');

            removeLIs();
            li.textContent = 'No fitting repo';
        } else {
            li.textContent = repos[i].name;

            if (currentLIs.length >= 5) {
                ul.firstElementChild.remove();
            }
        }

        ul.append(li);
    }
}

function removeLIs() {
    const currentLIs = document.querySelectorAll('li')
    for (let li of currentLIs) {
        li.remove();
    }
}

//розовый список

const autocomBox = document.querySelector('.autocom-box');
const chosen = document.querySelector('.chosen');


autocomBox.addEventListener('click', e => {
    const target = e.target;
    if (target.classList.contains('autocom-box__li--not-found')) {
        return;
    }
    input.value = '';
    input.focus();
    removeLIs();

    const valueForCard = target.textContent;
    appendChild(chosen, createCard(valueForCard))
})

function createCard(val) {
    const card = document.createElement('div');
    card.classList.add('card');


    const cardInfo = document.createElement('div');
    cardInfo.classList.add('card__info');

    const cardName = document.createElement('div');
    cardName.classList.add('card__name');

    const cardOwner = document.createElement('div');
    cardOwner.classList.add('card__owner');

    const cardStars = document.createElement('div');
    cardStars.classList.add('card__stars');


    const cardClose = document.createElement('div');
    cardClose.classList.add('card__close');

    const cardCloseButton = document.createElement('button');
    cardCloseButton.classList.add('card__close-btn');

    const closeStrikeUp = document.createElement('div');
    closeStrikeUp.classList.add('card__close-strike');
    closeStrikeUp.classList.add('card__close-strike--up');

    const closeStrikeDown = document.createElement('div');
    closeStrikeDown.classList.add('card__close-strike');
    closeStrikeDown.classList.add('card__close-strike--down');


    for (let repo of reposArr) {
        if (repo.name == val) {
            cardName.textContent = `Name: ${repo.name}`;
            cardOwner.textContent = `Owner: ${repo.owner.login}`;
            cardStars.textContent = `Stars: ${repo.stargazers_count}`;
            break;
        }
    }

    cardInfo.appendChild(cardName);
    cardInfo.appendChild(cardOwner);
    cardInfo.appendChild(cardStars);

    cardCloseButton.appendChild(closeStrikeDown);
    cardCloseButton.appendChild(closeStrikeUp);
    cardClose.appendChild(cardCloseButton);

    card.appendChild(cardInfo);
    card.appendChild(cardClose);

    return card;
}

function appendChild(where, what) {
    where.appendChild(what);
}

chosen.addEventListener('click', function (e) {
    const target = e.target;
    deleteCard(target)
})

function deleteCard(target) {
    if (target.closest('.card__close-btn')) {
        const elem = target.closest('.card');
        elem.remove();
    }
}