const searchInput = document.getElementById("search-input")
const searchButton = document.getElementById("search-btn")
const infoDiv = document.getElementById("info-part")
const spinner = document.getElementById("spinner")
const showResultsDiv = document.getElementById("show-results-div")

// function for Spinner
const spinnerToggle = displayProperty => {
    spinner.style.display = displayProperty
}
// Initial spinner condition
spinnerToggle("none")

// Load data from api
const loadData = async (searchText) => {
    const url = `https://openlibrary.org/search.json?q=${searchText}`

    // Spinner showing just before fetching
    spinnerToggle("block")

    // trying to fetch data from API
    try {
        const res = await fetch(url)
        const data = await res.json()
        showData(data, searchText)
    } catch(error) {
        console.log(error)
        infoDiv.innerHTML = `
            <p class="text-danger mb-0">${error}</p>
            <p class="text-danger">Please try again after sometime!</p>
        `
    }

    // Spinner hiding when fetching completed
    spinnerToggle("none")
}

// Show data on front-end
const showData = (data, searchText) => {

    if(data.numFound > 0) {
        infoDiv.innerHTML = `<p class="text-muted">Searched with <span class="fst-italic fw-bold">"${searchText}"</span> and showing ${data.docs.length} among ${data.numFound} results</p>`

        data.docs.forEach(bookObject => {
            generateCard(bookObject)
            console.log(bookObject)
        })
    } else {
        infoDiv.innerHTML = `<p class="text-muted">Searched with <span class="fst-italic fw-bold">"${searchText}"</span> and no results found!</p>`
    }
}

// Generate single card for each search result
const generateCard = (bookObject) => {
    const col = document.createElement("div")
    col.classList.add("col")

    const card = document.createElement("div")
    card.classList.add("card", "h-100")

    const cardBody = document.createElement("div")
    cardBody.classList.add("card-body")

    showResultsDiv.appendChild(col)
    col.appendChild(card)
    card.appendChild(cardBody)

    const coverImage = document.createElement("img")
    coverImage.classList.add("img-fluid", "d-block", "mx-auto", "mb-3")

    if(bookObject.cover_i !== undefined) {
        const coverUrl = `https://covers.openlibrary.org/b/id/${bookObject.cover_i}-M.jpg`
        coverImage.src = coverUrl
        cardBody.appendChild(coverImage)
    } else {
        coverImage.src = `images/no-image-found.jpg`
        cardBody.appendChild(coverImage)
    }

    const bookTitle = document.createElement("h5")
    bookTitle.classList.add("card-title", "fw-bold")
    bookTitle.textContent = `${bookObject.title}`
    cardBody.appendChild(bookTitle)

    if (bookObject.author_name !== undefined) {
        const authorString = bookObject.author_name.join(", ")
        const authorText = document.createElement("p")
        authorText.classList.add("card-text", "mb-2")
        authorText.innerHTML = `By <span class="text-primary">${authorString}</span>`
        cardBody.appendChild(authorText)
    }

    const firstPublishYear = document.createElement("p")
    firstPublishYear.classList.add("card-text", "mb-1")
    
    if (bookObject.first_publish_year !== undefined) {
        firstPublishYear.innerHTML = `<span class="fw-bold">First published:</span> ${bookObject.first_publish_year}`
        cardBody.appendChild(firstPublishYear)
    } else {
        firstPublishYear.innerHTML = `<span class="fw-bold">First published:</span> N/A`
        cardBody.appendChild(firstPublishYear)
    }


    const publisher = document.createElement("p")
    publisher.classList.add("card-text")

    if (bookObject.publisher !== undefined) {
        let publisherValue = bookObject.publisher.slice(0, 4).join(", ")
        publisher.innerHTML = `<span class="fw-bold">Publisher(s):</span> ${publisherValue}`
        cardBody.appendChild(publisher)
    } else {
        publisher.innerHTML = `<span class="fw-bold">Publisher(s):</span> N/A`
        cardBody.appendChild(publisher)
    }

} 


// Search button- click event
searchButton.addEventListener("click", (e) => {
    let searchText = searchInput.value
    searchText = searchText.trim()
    if(searchText.length > 0) {
        loadData(searchText)
        infoDiv.innerHTML = ""
        searchInput.value = ""
        showResultsDiv.innerHTML = ""
    } else {
        infoDiv.innerHTML = `<p class="text-muted">Please enter a valid search text</p>`
        searchInput.value = ""
        showResultsDiv.innerHTML = ""
    }
})

// Keyboard enter button event
window.addEventListener("keyup", (e) => {
    if(e.key === "Enter") {
        let searchText = searchInput.value
        searchText = searchText.trim()
        if(searchText.length > 0) {
            loadData(searchText)
            infoDiv.innerHTML = ""
            searchInput.value = ""
            showResultsDiv.innerHTML = ""
        } else {
            infoDiv.innerHTML = `<p class="text-muted">Please enter a valid search text</p>`
            searchInput.value = ""
            showResultsDiv.innerHTML = ""
        }
    }
})