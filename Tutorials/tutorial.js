let burgerIcon = document.querySelector('.burgerIcon');
let tutorialSidebar = document.querySelector('.tutorialSidebar');
let navbar = document.querySelector('.tutorialSidebarNav');
let h1 = document.querySelectorAll('h1');

let tutorialDiv = document.querySelector('.tutorialDiv')
let images = document.querySelectorAll('img');


window.addEventListener('DOMContentLoaded', ()=>{
    images.forEach((img) => {
        img.addEventListener("click", function(){onImgClicked(img)});
    });

    h1.forEach((heading, idx) => {
        heading.id = 'heading' + String(idx);

        const navElement = document.createElement("a");
        navElement.textContent = heading.textContent;
        navElement.href = '#heading' + String(idx);
        navbar.appendChild(navElement);
    });
});

function onNavbarBurgerIconClicked() {
    if(tutorialSidebar.classList.contains('closed')){
        tutorialSidebar.classList.remove('closed');
        burgerIcon.classList.remove('closed');
        tutorialDiv.classList.remove('center');
    }
    else{
        tutorialSidebar.classList.add('closed');
        burgerIcon.classList.add('closed');
        tutorialDiv.classList.add('center');
    }
}

function onImgClicked(clickedIMG){
    /* Remove the zoom from any image if applied */
    images.forEach((img) => {
        if(img.classList.contains('zoom') && img != clickedIMG) {
            img.classList.remove('zoom');
        }
    });

    if(clickedIMG.classList.contains('zoom')){
        clickedIMG.classList.remove('zoom');
    }else{
        clickedIMG.classList.add('zoom');
    }
}

function onReturnClicked(){
    window.location.href = '../../index.html'
}