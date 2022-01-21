window.onload = () => {
    // variables
    const loader = document.querySelector('.loader');
    const randomFoodImage = document.querySelector('.food-img');
    const randomFoodName = document.querySelector('.food-content__name');
    const randomFoodDescription = document.querySelector('.food-content__description');
    const ingridientList = document.querySelector('.ingridiet__list');
    const measureList = document.querySelector('.measure__list');
    const inputSearch = document.querySelector('#search-inp');
    const getRandom = document.querySelector('.getRandomMealBtn')
    const blockShowRandom = document.querySelector('.showMeal');
    const searchBtn = document.querySelector('.searchBtn');
    const showSearchMeal = document.querySelector('.showSearchMeal');
    const erorBlock = document.querySelector('.error');


    //loader 

    const closeLoader = () => {
        setTimeout(() => {
            loader.classList.remove('active')
        }, 1000)
    }
    closeLoader()


    // get random meal
    async function getData(url) {

      
            // запрос и получение данных, приведение к json
            let res = await fetch(url).then(r => {
                if (!r.ok) {
                    erorBlock.classList.add("active");
                    blockShowRandom.classList.remove('active');
                }
                return r.json();
            }).then(data => data.meals[0]);

            randomFoodImage.setAttribute('src', res.strMealThumb);
            randomFoodName.textContent = res.strMeal;
            randomFoodDescription.textContent = res.strInstructions;

            const meals = res;
            let ing = [];
            let measure = [];
          
            // пробегаем по свойствам обьекта, сравниваем если свойство содежит подстроку то формириуем новые масивы с этими подстроками
            for (let k in meals) {
                if (k.includes("strIngredient")) {
                    ing.push(meals[k]);
                } else if (k.includes("strMeasure")) {
                    measure.push(meals[k]);
                }
            }

            // вставка ингридиентов через метод map
            let allIng = ing.filter(el => el !== '' && el !== null).map(item => `<li class="ingridient-item">${item}</li> `).join('')
            let allMesure = measure.filter(el => el !== '' && el !== null).map(item => `<li class="ingridient-item">${item}</li> `).join('')
            ingridientList.innerHTML = allIng;
            measureList.innerHTML = allMesure;
        

    }

    getRandom.addEventListener('click', () => {
        if (blockShowRandom.classList.contains('active')) {

        } else {
            blockShowRandom.classList.add('active');
        }
        showSearchMeal.classList.remove('active')
        getData('https://www.themealdb.com/api/json/v1/1/random.php')
    })


    // get meal in input
    inputSearch.addEventListener('click', (e) => {

    })

    searchBtn.addEventListener('click', (e) => {
        let userMeal = inputSearch.value;
        getSearchMeal(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${userMeal}`)
        showSearchMeal.classList.add('active')
        blockShowRandom.classList.remove('active');


    })

    async function getSearchMeal(url) {

        let res = await fetch(url).then(r => {
            if (!r.ok) {
                erorBlock.classList.add("active");
                showSearchMeal.classList.remove('active');
            }
            return r.json();
        }).then(data => data.meals);
        
       
     
        if (res) {
            let data = res.map(item => (
                `<div class="searchMeal" data-id=${item.idMeal}>
                <h3 class="searchMeal__name">${item.strMeal}</h3>
                <img src=${item.strMealThumb} alt="" class="searchMeal__img">
            
            </div>`
            )).join('')
            showSearchMeal.innerHTML = data;
            const searchMealCard = document.querySelectorAll('.searchMeal');
            searchMealCard.forEach(elem => {
            elem.addEventListener('click', (e) => {
                let index = elem.getAttribute('data-id');
                const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${index}`;
                getData(url);
                showSearchMeal.classList.remove('active')
                blockShowRandom.classList.add('active');
            })
        })
        } else {
            const notFoundBlock = document.createElement('div');
            notFoundBlock.classList.add('not-found');
            const image = document.createElement("img");
            const notFoundText = document.createElement('p');
            notFoundText.classList.add('not-found__text');
            notFoundText.innerHTML = 'К сожалению ничего не найдено, измените запрос!'
            image.setAttribute('src','img/not-found.png');
            image.classList.add('not-found__image')
            notFoundBlock.appendChild(image)
            notFoundBlock.appendChild(notFoundText)
            showSearchMeal.innerHTML = ''
            showSearchMeal.appendChild(notFoundBlock)
        }
        

    }



}