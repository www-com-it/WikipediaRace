const inputIniziale = document.getElementById("input-iniziale");
const inputFinale = document.getElementById("input-finale");

const suggestionsInizio = document.getElementById("suggestions-inizio");
const suggestionsFine = document.getElementById("suggestions-fine");

inputIniziale.addEventListener("blur", () => {
    suggestionsInizio.style.display = "none";
});
inputFinale.addEventListener("blur", () => {
    suggestionsFine.style.display = "none";
});

// Funzione per effettuare la ricerca su wikipedia.
async function searchWikipedia(query) {
    const url = "https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srsearch=" + encodeURIComponent(query);
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.query.search; // Array dei risultati
    } catch (error) {
        console.error("Errore durante la ricerca:", error);
        return [];
    }
}

// Funzione per mostrare i risultati sotto l'input
async function showSuggestions(e, tipo) {
    const query = e.target.value.trim();
    console.log("Ricerca per:", query); // DEBUG
    let suggestionsContainer = tipo === 'inizio' ? suggestionsInizio : suggestionsFine;
    
    // Resetta la visibilità
    suggestionsContainer.style.display = "block";
    
    // Svuota i risultati precedenti
    suggestionsContainer.innerHTML = "";
    
    if(query.length === 0) {
        suggestionsContainer.style.display = "none";
        return;
    }
    
    const results = await searchWikipedia(query);
    console.log("Risultati trovati:", results); // DEBUG

    results.forEach(result => {
        const p = document.createElement("p");
        p.textContent = result.title;
        p.addEventListener("click", () => {
            if(tipo === 'inizio'){
                inputIniziale.value = result.title;
                const linkIniziale = "https://en.wikipedia.org/wiki/" + encodeURIComponent(result.title);
                localStorage.setItem("ArticoloUno", result.title);
                localStorage.setItem("inizioLink", linkIniziale);
            } else {
                inputFinale.value = result.title;
                const linkFinale = "https://en.wikipedia.org/wiki/" + encodeURIComponent(result.title);
                localStorage.setItem("ArticoloUltimo", result.title);
                localStorage.setItem("fineLink", linkFinale);
            }
            suggestionsContainer.innerHTML = "";
            suggestionsContainer.style.display = "none";
        });
        suggestionsContainer.appendChild(p);
    });
}

// Aggiungi listeners agli input per eseguire la ricerca ad ogni digitazione
inputIniziale.addEventListener("input", (e) => {
    showSuggestions(e, 'inizio');
});
inputFinale.addEventListener("input", (e) => {
    showSuggestions(e, 'fine');
});

async function randomArticleInizio() {
    const url = "https://en.wikipedia.org/w/api.php?action=query&format=json&list=random&rnnamespace=0&rnlimit=1&origin=*";

    try {
        const response = await fetch(url);
        const data = await response.json();

        let randomArticle = data.query.random[0].title;
        inputIniziale.value = randomArticle;

        localStorage.setItem("ArticoloUno", randomArticle);

        let linkIniziale = "https://en.wikipedia.org/wiki/" + encodeURIComponent(randomArticle);
        localStorage.setItem("inizioArticolo", randomArticle);
        localStorage.setItem("inizioLink", linkIniziale);

    } catch (error) {
        console.error("Errore nel recupero dell'articolo casuale:", error);
    }
}

async function randomArticleFine() {
    const url = "https://en.wikipedia.org/w/api.php?action=query&format=json&list=random&rnnamespace=0&rnlimit=1&origin=*";

    try {
        const response = await fetch(url);
        const data = await response.json();

        let randomArticle = data.query.random[0].title;
        inputFinale.value = randomArticle;

        localStorage.setItem("ArticoloUltimo", randomArticle);

        let linkFinale = "https://en.wikipedia.org/wiki/" + encodeURIComponent(randomArticle);
        localStorage.setItem("fineLink", linkFinale);
        localStorage.setItem("fineArticolo", randomArticle);

    } catch (error) {
        console.error("Errore nel recupero dell'articolo casuale:", error);
    }
}

function generaInizio() {
    randomArticleInizio();
}

function generaFine() {
    randomArticleFine();
}

function start() {
    const titoloIniziale = inputIniziale.value.trim();
    const titoloFinale = inputFinale.value.trim();

    if (titoloIniziale === "" || titoloFinale === "") {
        alert("Devi compilare entrambi i campi per iniziare a giocare!");
        return;
    }

    if (titoloIniziale === titoloFinale) {
        alert("Non puoi scegliere due articoli uguali! Riprova.");
        return;
    }

    // Genera i link aggiornati e salvali
    const linkInizio = "https://en.wikipedia.org/wiki/" + encodeURIComponent(titoloIniziale);
    const linkFine = "https://en.wikipedia.org/wiki/" + encodeURIComponent(titoloFinale);

    localStorage.setItem("ArticoloUno", titoloIniziale);
    localStorage.setItem("ArticoloUltimo", titoloFinale);
    localStorage.setItem("inizioLink", linkInizio);
    localStorage.setItem("fineLink", linkFine);

    // Pulisci gli input
    inputIniziale.value = "";
    inputFinale.value = "";

    // Vai alla pagina del gioco con il link iniziale
    window.location.href = "paginagioco.html?link=" + encodeURIComponent(linkInizio);
}

async function randomArticleIniziale() {
    if (inputIniziale.value.trim().length > 0) {
        const query = inputIniziale.value.trim();
        const results = await searchWikipedia(query);
        if(results.length > 0) {
            const randomIndex = Math.floor(Math.random() * results.length);
            let randomArticle = results[randomIndex].title;
            inputIniziale.value = randomArticle;
            localStorage.setItem("ArticoloUno", randomArticle);
            let linkIniziale = "https://en.wikipedia.org/wiki/" + encodeURIComponent(randomArticle);
            localStorage.setItem("inizioLink", linkIniziale);
        } else {
            console.error("Nessun risultato trovato dalla ricerca.");
        }
    } else {
        // Usa l'endpoint random
        const url = "https://en.wikipedia.org/w/api.php?action=query&format=json&list=random&rnnamespace=0&rnlimit=1&origin=*";
        try {
            const response = await fetch(url);
            const data = await response.json();
            let randomArticle = data.query.random[0].title;
            inputIniziale.value = randomArticle;
            localStorage.setItem("ArticoloUno", randomArticle);
            let linkIniziale = "https://en.wikipedia.org/wiki/" + encodeURIComponent(randomArticle);
            localStorage.setItem("inizioLink", linkIniziale);
        } catch (error) {
            console.error("Errore nel recupero dell'articolo casuale:", error);
        }
    }
}

async function randomArticleFinale() {
    // Se l'input ha già un valore, usa la ricerca
    if (inputFinale.value.trim().length > 0) {
        const query = inputFinale.value.trim();
        const results = await searchWikipedia(query);
        if (results.length > 0) {
            const randomIndex = Math.floor(Math.random() * results.length);
            let randomArticle = results[randomIndex].title;
            inputFinale.value = randomArticle;
            localStorage.setItem("ArticoloUltimo", randomArticle);
            let linkFinale = "https://en.wikipedia.org/wiki/" + encodeURIComponent(randomArticle);
            localStorage.setItem("fineLink", linkFinale);
        } else {
            console.error("Nessun risultato trovato dalla ricerca per l'articolo finale.");
        }
    } else {
        // Altrimenti usa l'endpoint random
        const url = "https://en.wikipedia.org/w/api.php?action=query&format=json&list=random&rnnamespace=0&rnlimit=1&origin=*";
        try {
            const response = await fetch(url);
            const data = await response.json();
            let randomArticle = data.query.random[0].title;
            inputFinale.value = randomArticle;
            localStorage.setItem("ArticoloUltimo", randomArticle);
            let linkFinale = "https://en.wikipedia.org/wiki/" + encodeURIComponent(randomArticle);
            localStorage.setItem("fineLink", linkFinale);
        } catch (error) {
            console.error("Errore nel recupero dell'articolo casuale finale:", error);
        }
    }
}