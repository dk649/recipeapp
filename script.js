
window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');


    const meals = document.getElementById('meals');
    const favoriteContainer = document.getElementById("fav-meals");

    const searchTerm = document.getElementById('search-term');
    const searchBtn = document.getElementById('search');

    getRandomMeal();
    fetchFavMeals();

    async function getRandomMeal(){

       const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");

       const respData = await resp.json();
       const randomMeal = respData.meals[0];

       

       addMeal(randomMeal, true);


    }

    async function getMealById(id){
        const resp = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i="+id);

        const respData = await resp.json();

        const meal = respData.meals[0];
        return meal;

    }

    async function getMealBySearch(term){

        const resp = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s="+term);

        const respData = await resp.json();
        const meals = await respData.meals;

        return meals;




    }


    // the random meal 
     function  addMeal(mealData, random = false) {

        // console.log(mealData);
        const meal = document.createElement("div"); // created a div element 
        meal.classList.add("meal"); // adds meal class from css file to div element pulling style from stylesheet 
    
        meal.innerHTML = `
        <div class="meal-header">
            ${
                random
                    ? `
            <span class="random"> Random Recipe </span>`
                    : ""
            }
            <img
                src="${mealData.strMealThumb}"
                alt="${mealData.strMeal}"
            />
            </div>
            <div class="meal-body">
                <h4>${mealData.strMeal}</h4>
                <button class="fav-btn"><svg  width="20" height="20" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg></button>
                <button class="btn-info"><i class="fas fa-info-circle"></i></button>
            </div>
    `;

    

    meals.appendChild(meal);

    // meal.addEventListener('click', (event) => { 
    //     if (!event.target.closest('.fav-btn')) return;


    //     console.log("button clicked");
    // }, false);

    const btn = meal.querySelector('.meal-body .fav-btn');

    btn.addEventListener('click', (event) => {

        // console.log(" new button clicked");

        if (btn.classList.contains("active")) {
            removeMealLS(mealData.idMeal);
            btn.classList.remove("active");
        } else {
            addMealLS(mealData.idMeal);
            btn.classList.add("active");
        }
        favoriteContainer.innerHTML = "";
        fetchFavMeals();

    });
    


    //info button
    const btninfo = meal.querySelector('.meal-body .btn-info');
     btninfo.addEventListener('click', (event) => {
         const ref = mealData.strSource;

         
         window.open(ref,);
         
        console.log(mealData);
     });
 
     }

     



     function addMealLS(mealId) {
        const mealIds = getMealsLS();
    
        localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
    }

    function removeMealLS(mealId) {
        const mealIds = getMealsLS();
    
        localStorage.setItem(
            "mealIds",
            JSON.stringify(mealIds.filter((id) => id !== mealId))
        );
    }

    function getMealsLS() {
        const mealIds = JSON.parse(localStorage.getItem("mealIds"));
    
        return mealIds === null ? [] : mealIds;
    }

    



    async function fetchFavMeals() {

        // clean the container
        favoriteContainer.innerHTML = "";


        const mealIds = getMealsLS();

        for (let i = 0; i < mealIds.length; i++) {
            const mealId = mealIds[i];
            meal = await getMealById(mealId);
    
            addMealFav(meal);
        }

    }// end of function 


    function addMealFav(mealData) {
        const favMeal = document.createElement("li");
    
        favMeal.innerHTML = `
            <img
                src="${mealData.strMealThumb}"
                alt="${mealData.strMeal}"
            /><span>${mealData.strMeal}</span>
            <button class="clear"><i class="fa fa-times-circle"></i></button>
        `;
    
        const btn = favMeal.querySelector(".clear");
    
        btn.addEventListener("click", () => {
            removeMealLS(mealData.idMeal);
    
            fetchFavMeals();
        });

        favMeal.addEventListener("click", () => {
            showMealInfo(mealData);
        });
    
        favoriteContainer.appendChild(favMeal);

    } // end


    searchBtn.addEventListener("click", async (element) => {

        console.log("search button clicked") 
        
        const search = searchTerm.value;
        const meals = await getMealBySearch(search);
        

    if (meals) {
        meals.forEach((meal) => {
            addMeal(meal);
        });
    }

    searchTerm.value ="";

    })



});