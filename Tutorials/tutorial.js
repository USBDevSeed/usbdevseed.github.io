let burgerIcon = document.querySelector('.burgerIcon');
let imgVisibilityIcon = document.querySelector('.imgVisibilityIcon');
let tutorialSidebar = document.querySelector('.tutorialSidebar');
let navbar = document.querySelector('.tutorialSidebarNav');
let headings = document.querySelectorAll('h1, h2');
let accordions = document.querySelectorAll('.accordion');
let accordionsHeadings = document.querySelectorAll('.accordionHeading');
let codeSections = document.querySelectorAll('p code');

let notes = document.querySelectorAll('.note');
let alerts = document.querySelectorAll('.note.alert');

let mainBody = document.querySelector('body');
let tutorialDiv = document.querySelector('.tutorialDiv');
let images = document.querySelectorAll('img');

window.addEventListener('DOMContentLoaded', ()=>{
    /* Window resize fix */
    window.addEventListener("resize", onWindowResize);
    onWindowResize();

    /* Notes creation */
    notes.forEach((note, idx) => {
        const info_icon = document.createElement('img');
        info_icon.src = "/Assets/Icons/info.png";
        note.insertBefore(info_icon, note.firstChild);
    });
    alerts.forEach((alertNote, idx) =>{
        const info_icon = alertNote.querySelector('img');
        if(info_icon != null){
            info_icon.src = "/Assets/Icons/warning.png";
        }
    })

    /* Zoom on images */
    images.forEach((img) => {
        img.addEventListener("click", function(){onImgClicked(img)});
    });

    /*Dynamic heading sidebar */
    var lastHeadingIdx = -1;
    var lastHeading;
    var lastAccordionHeadingContainer;
    var lastAccordionContainer;
    var lastSubHeading;
    var subHeadingCount = 0;
    /* Automatic heading navigation on sidebar */
    headings.forEach((heading, idx) => {
        if(heading.tagName == 'H1'){
            lastHeadingIdx++;
            subHeadingCount = 0;
            heading.id = 'heading' + String(lastHeadingIdx);

            // Creation of navigation heading
            // Here i create a simple <a> heading for the navigation
            // If the heading then contains an H2 heading, then it will put it inside an accordion
            const headingInstance = document.createElement('a');
            headingInstance.textContent = heading.textContent;
            headingInstance.href = '#heading' + String(lastHeadingIdx);
            headingInstance.addEventListener("click", function(){onNavbarHeadingClicked(heading)});
            navbar.appendChild(headingInstance);
            lastHeading = headingInstance;
            
        }
        else if(heading.tagName == 'H2'){
            subHeadingCount++;
            heading.id = 'heading' + String(lastHeadingIdx) + "_" + String(subHeadingCount);

            //This means its the first heading, so it will convert it into an accordion
            if(subHeadingCount == 1){
                /* Creation of accordion */
                const accordionInstance = document.createElement("div");
                accordionInstance.classList.add('accordion');
                navbar.appendChild(accordionInstance);

                /*Accordion heading container*/
                const accordionHeadingContainer = document.createElement("div");
                accordionHeadingContainer.classList.add("headingContainer");
                accordionInstance.appendChild(accordionHeadingContainer);
                lastAccordionHeadingContainer = accordionHeadingContainer;

                /*Reparent last heading*/
                accordionHeadingContainer.appendChild(lastHeading);

                /*Creation of Accordion container*/
                const accordionContainer = document.createElement("div");
                accordionContainer.classList.add("accordionContainer");
                accordionInstance.appendChild(accordionContainer);
                lastAccordionContainer = accordionContainer;
            }

            /*Accordion content */
            const subHeading = document.createElement("a");
            subHeading.textContent = heading.textContent;
            subHeading.href = '#heading' + String(lastHeadingIdx) + "_" + String(subHeadingCount);
            subHeading.classList.add('accordionSubHeading');
            subHeading.addEventListener("click", function(){onNavbarHeadingClicked(heading)});
            lastAccordionContainer.appendChild(subHeading);
            lastSubHeading = heading;
        }
    });
    accordions = document.querySelectorAll('.accordion');

    /* Accordion maker*/
    accordions.forEach((accordion,idx) => {
        var accordionHeadingContainer = accordion.querySelector('.headingContainer');
        if(accordionHeadingContainer != null){
            /*Assigning the click event for the accordion*/
            accordionHeadingContainer.addEventListener("click", function(){onAccordionClicked(accordion)});

            /*Creating the arrow icon*/
            var accordionArrow = document.createElement("img");
            accordionArrow.classList.add('accordionArrow');
            accordionArrow.src = "../../Assets/Icons/arrow.png"
            accordionHeadingContainer.appendChild(accordionArrow);
        }
    });

    /*Scroll fix*/
    var navigationLinks = tutorialSidebar.querySelectorAll('a');
    navigationLinks.forEach((link, idx) => {
        link.addEventListener('click', function(i){
            i.preventDefault();

            //The substring function deletes the '#' from the href reference
            const targetId = link.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            tutorialDiv.scrollTo({
                top: target.offsetTop,
                behavior: 'smooth'
            });
        })
    })

    /* Code fix*/ 
    codeSections.forEach((code, idx)=>{
        code.classList.add('language-gdscript');
        genCodeIcons(code);
    });

});

function genCodeIcons(code){
    const imgInstance = document.createElement('img');
    imgInstance.style = "scale:1.5; margin-right: 7px"
    //imgInstance.classList.add('imgIcon');
    const codeText = code.textContent;

    switch(codeText){
        case "Node2D":
            imgInstance.src = "/Assets/GodotIcons/Node2D.svg"
            break;
        case "CharacterBody2D":
            imgInstance.src = "/Assets/GodotIcons/CharacterBody2D.svg"
            break;
        case "Sprite2D":
            imgInstance.src = "/Assets/GodotIcons/Sprite2D.svg"
            break;
        case "AnimatedSprite2D":
            imgInstance.src = "/Assets/GodotIcons/AnimatedSprite2D.svg"
            break;
        case "CollisionShape2D":
            imgInstance.src = "/Assets/GodotIcons/CollisionShape2D.svg"
            break;
        case "Camera2D":
            imgInstance.src = "/Assets/GodotIcons/Camera2D.svg"
            break;
        case "TileMapLayer":
            imgInstance.src = "/Assets/GodotIcons/TileMapLayer.svg"
            break;
        default:
            imgInstance.style.display = "none";
            break;
    }
    code.insertBefore(imgInstance, code.firstChild);
    //code.appendChild(imgInstance);
}

function onWindowResize(){
    if(window.innerWidth <= 700){
        tutorialSidebar.classList.add('closed');
    }
}

function onNavbarBurgerIconClicked() {
    if(tutorialSidebar.classList.contains('closed')){
        tutorialSidebar.classList.remove('closed');
        /*burgerIcon.classList.remove('closed');*/
    }
    else{
        tutorialSidebar.classList.add('closed');
        /*burgerIcon.classList.add('closed');*/
    }
}

function onAccordionClicked(accordionClicked){
    if(accordionClicked.classList.contains('open')){
        accordionClicked.classList.remove('open');
    }
    else{
        accordionClicked.classList.add('open');
    }
}

function onNavbarHeadingClicked(heading){
    //Display accordion
    var headingParent = heading.parentElement.parentElement
    if(headingParent.className == "accordion"){
        headingParent.classList.add('open');
    }

    //Display parent accordion if its a subheading
    if(headingParent.parentElement.parentElement.className == "accordion"){
        headingParent.parentElement.parentElement.classList.add('open');
    }


}

function toggleImgVisibility(){
    if(images[0].classList.contains('hidden')){
        images.forEach((img) => {
            img.classList.remove('hidden');
            imgVisibilityIcon.src = "../../Assets/Icons/images_show.png"
        });
    }
    else{
        images.forEach((img) => {
            img.classList.add('hidden');
            imgVisibilityIcon.src = "../../Assets/Icons/images_hidden.png"
        });
    }
}

function onImgClicked(clickedIMG){
    /* Remove the zoom from any image if applied */
    images.forEach((img) => {
        if(img.classList.contains('zoom') && !img.classList.contains("downloadImg") && img != clickedIMG) {
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