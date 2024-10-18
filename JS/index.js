
    // Side bar toggle
    document.querySelector(".openIcon").addEventListener("click", function () {
        document.querySelector(".sideBar .barContent").style.left = "0";
        document.querySelector(".sideBar .barFun").style.left = "250px";
        this.classList.add("d-none");
        document.querySelector(".closeIcon").classList.remove("d-none");
    });

    document.querySelector(".closeIcon").addEventListener("click", function () {
        document.querySelector(".sideBar .barContent").style.left = "-200px";
        document.querySelector(".sideBar .barFun").style.left = "0";
        this.classList.add("d-none");
        document.querySelector(".openIcon").classList.remove("d-none");
    });

    async function getApi(input) {
        try {
            const myAPI = await fetch(`https://www.themealdb.com/api/json/v1/1/${input}`);
            if (!myAPI.ok) {
                throw new Error("Failed to fetch");
            }
            const data = await myAPI.json();
            return data.meals;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async function getRandomMeals() {

let mainArray = [];
        for (let i = 0; i < 20; i++) {
            mainArray.push(getApi("random.php"));
        }
        let meals = await Promise.all(mainArray);
        meals = meals.flat();
        displayMeals(meals);

    }

    function displayMeals(arr) {
        let output = ``;
        for (let i = 0; i < arr.length; i++) {
            output += `<div class="col-md-3 p-1 rounded-3 meal-card" data-meal-id="${arr[i].idMeal}">
                        <div class="cardMeal position-relative overflow-hidden">
                            <img class="rounded-4" src="${arr[i].strMealThumb}" alt="${arr[i].strMeal}">
                            <div class="layerContent position-absolute p-4 rounded-3">
                                <h3>${arr[i].strMeal}</h3>
                            </div>
                        </div>
                    </div>`;
        }
        document.getElementById("MealsHomeRow").innerHTML = output;

        document.querySelectorAll(".meal-card").forEach(function (card) {
            card.addEventListener("click", function () {
                let mealId = this.getAttribute("data-meal-id");
                goToDetailsPage(mealId);
            });
        });
    }

    getRandomMeals();

    function goToDetailsPage(mealId) {
        localStorage.setItem("mealId", mealId);
        window.location = "details.html";
    }

    /* Details Page */
    async function displaySingleMeal(mealId) {
        let singleMeal = await getApi(`lookup.php?i=${mealId}`);
        if (singleMeal && singleMeal.length > 0) {
            singleMeal = singleMeal[0];
            let tagsArray = singleMeal.strTags ? singleMeal.strTags.split(",") : [];
            let tagsHTML = tagsArray.map(tag =>
                `<span class="bg-info p-2 rounded-3 m-1">${tag}</span>`
            ).join("");

            let ingredientsArray = [];
            for (let i = 1; i <= 20; i++) {
                if (singleMeal[`strIngredient${i}`]) {
                    ingredientsArray.push(`${singleMeal[`strIngredient${i}`]} ${singleMeal[`strMeasure${i}`]}`);
                }
            }
            let ingredientsHTML = ingredientsArray.map(ingredient =>
                `<span class="bg-secondary text-white p-2 rounded-3 m-2">${ingredient}</span>`
            ).join("");

            let output = `
                <div class="container">
                    <div class="row">
                        <div class="col-md-5">
                            <div class="mainInfo rounded-3">
                                <img class="rounded-3 w-100" src="${singleMeal.strMealThumb}" alt="${singleMeal.strMeal}">
                                <h1 class="text-center mt-3">${singleMeal.strMeal}</h1>
                            </div>
                        </div>
                        <div class="col-md-7">
                            <div class="secondInfo">
                                <h2>Instructions</h2>
                                <p>${singleMeal.strInstructions}</p>
                                <div class="smallInfo">
                                    <h3 class="d-inline-block">Area:</h3>
                                    <span class="fs-4"> ${singleMeal.strArea}</span>
                                </div>
                                <div class="smallInfo">
                                    <h3 class="d-inline-block">Category:</h3>
                                    <span class="fs-4"> ${singleMeal.strCategory}</span>
                                </div>
                                <div class="smallInfo">
                                    <h3>Recipes:</h3>
                                    <div class="recipes d-flex flex-wrap g-3">
                                        ${ingredientsHTML}
                                    </div>
                                </div>
                                <div class="smallInfo">
                                    <h3>Tags:</h3>
                                    <div class="tags d-flex flex-wrap g-3">
                                        ${tagsHTML}
                                    </div>
                                </div>
                                <div class="sources mt-4 ms-1">
                                    <span class="bg-success p-2 rounded-3"><a class="text-white" href="${singleMeal.strSource}">Source</a></span>
                                    <span class="bg-danger p-2 rounded-3"><a class="text-white" href="${singleMeal.strYoutube}">YouTube</a></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
            document.getElementById("singleMealDetails").innerHTML = output;
        }
    }

    if (document.getElementById("singleMealDetails")) {
        const mealId = localStorage.getItem("mealId");
        if (mealId) {
            displaySingleMeal(mealId);
        } else {
            console.log("No meal Id in local storage");
        }
    }

    /* Search By Letter */
    let inputByLetter = document.querySelector("#searchByLetter");
    let inputByName = document.querySelector("#searchByName");
if(window.location.pathname == "/examJs/search.html"){
        inputByName.addEventListener("input", function(){
        let searchValue = inputByName.value.toLowerCase();
        displaySearchedMeals(searchValue, "search.php?s=");
    });

    inputByLetter.addEventListener("input", function () {
        let searchValue = inputByLetter.value.toLowerCase();
        if (searchValue.length === 1) {
            displaySearchedMeals(searchValue, "search.php?f=");
        } else {
            document.getElementById("MealsHomeRow").innerHTML = "<p>Please enter a single letter</p>";
        }
    });
}

    async function displaySearchedMeals(letter, apiVal) {
        let meals = await getApi(`${apiVal}${letter}`);
        if (meals && meals.length > 0) {
            displayMeals(meals);
        } else {
            document.getElementById("MealsHomeRow").innerHTML = '<p>No meals found</p>';
        }
    }

// Category Page
if (window.location.pathname === "/examJs/search.html") {
    console.log("We Are IN Category Page");
    displayCat()
} 
async function displayCategories() { 
    try {
        const myAPI = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
        if (!myAPI.ok) {
            throw new Error("Failed to fetch");
        }
        const data = await myAPI.json();
        console.log(data.categories);
        
        return data.categories;
    } catch (error) {
        console.log(error);
        return null;
    }

}


async function displayCat() {
let cat = await displayCategories(); 
if (cat) {
let output = ``;
for (let i = 0; i < cat.length; i++) {
    output += `<div class="col-md-3 p-4 rounded-3 meal-card" data-cat-str="${cat[i].strCategory}">
                <div class="cardMeal position-relative overflow-hidden">
                    <img class="rounded-4" src="${cat[i].strCategoryThumb}" alt="${cat[i].strCategory}">
                    <div class="layerContent position-absolute p-4 rounded-3">
                        <h3>${cat[i].strCategory}</h3>
                    </div>
                </div>
            </div>`;
}
document.getElementById("MealsHomeRow").innerHTML = output;

document.querySelectorAll(".meal-card").forEach(function (card) {
    card.addEventListener("click", function () {
        
        goToCategoryMeals(card.getAttribute("data-cat-str"))
    })
})
}else{
    console.log(cat);
}
}
async function goToCategoryMeals(input){
    let categoryMealsInfo = await getApi(`filter.php?c=${input}`)
    displayMeals(categoryMealsInfo)
    // console.log(categoryMealsInfo);
}
// Area Section
async function displayArea() {
    let areas = await getApi("list.php?a=list");
    console.log(areas);

    let output = ``;
    for (let i = 0; i < areas.length; i++) {
        output += `<div class="col-md-3 justify-content-center mt-2" data-area="${areas[i].strArea}">
        <div class="item d-flex align-items-center flex-column">
        <i class="fa-solid fa-house-laptop fa-4x text-white"></i>
        <h3 class="text-white">${areas[i].strArea}</h3>
        </div>
        </div>`;
    }

    document.querySelector("#MealsHomeRow").innerHTML = output;

    document.querySelectorAll(".item").forEach(function (item) {
        item.addEventListener("click", async function () {
            let area = this.closest("[data-area]").getAttribute("data-area");
            let areaMealsInfo = await getApi(`filter.php?a=${area}`);
            console.log(areaMealsInfo);
            displayMeals(areaMealsInfo)
        });
    });
}


if(window.location.pathname =="/area.html"){
    displayArea()
}
// Area Section
// Ingredients
async function displayIngredients() {
    let ingredients = await getApi("list.php?i=list");
    ingredients = ingredients.slice(0, 20); 
    console.log(ingredients);
    let output = ``;
    for (let i = 0; i < ingredients.length; i++) {
        let limitedDescription = ingredients[i].strDescription ? ingredients[i].strDescription.substring(0, 100) : '';
        output += `<div class="col-md-3" data-ing="${ingredients[i].strIngredient}">
                    <div class="item d-flex flex-column align-items-center">
                        <i class="fa-solid fa-drumstick-bite fa-4x text-white"></i>
                        <h2 class="text-white text-center">${ingredients[i].strIngredient}</h2>
                        <p class="text-center text-white">${limitedDescription}</p>
                    </div>
                </div>`;
    }
    document.querySelector("#MealsHomeRow").innerHTML = output;
    document.querySelectorAll(".item").forEach(function (item) {
        item.addEventListener("click", async function () {
            let ingMeals = this.closest("[data-ing]").getAttribute("data-ing");
            let ingMealsInfo = await getApi(`filter.php?i=${ingMeals}`);
            console.log(ingMealsInfo);
            displayMeals(ingMealsInfo);
        });
    });
}
if (window.location.pathname === "/ingredient.html") {
        displayIngredients();
}
// Ingredients
// Contact US Page
const nameInput = document.getElementById("userName");
const emailInput = document.getElementById("userEmail");
const phoneInput = document.getElementById("userPhone");
const ageInput = document.getElementById("userAge");
const passInput = document.getElementById("userPassword");
const rePassInput = document.getElementById("RePass");
const submitButton = document.getElementById("submitButton");


const nameRgx = /^[a-zA-Z\s]{3,}$/; 
const emailRgx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  
const phoneRgx = /^(\+?\d{1,3}[-.\s]?)?\d{10}$/;  
const ageRgx = /^(1[89]|[2-9][0-9])$/;  
const passRgx = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;  

function validateInputs() {
    if (
        nameInput.value !== "" &&
        emailInput.value !== "" &&
        phoneInput.value !== "" &&
        ageInput.value !== "" &&
        passInput.value !== "" &&
        nameRgx.test(nameInput.value) &&
        emailRgx.test(emailInput.value) &&
        phoneRgx.test(phoneInput.value) &&
        ageRgx.test(ageInput.value) &&
        passRgx.test(passInput.value) &&
        passInput.value === rePassInput.value
    ) {
        submitButton.removeAttribute("disabled");  
        console.log("Form is valid.");
    } else {
        submitButton.setAttribute("disabled", "true");  
        console.log("Form is invalid.");
    }
}

nameInput.addEventListener("input", validateInputs);
emailInput.addEventListener("input", validateInputs);
phoneInput.addEventListener("input", validateInputs);
ageInput.addEventListener("input", validateInputs);
passInput.addEventListener("input", validateInputs);
rePassInput.addEventListener("input", validateInputs);
submitButton.setAttribute("disabled", "true");





