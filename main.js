let intro = document.querySelector('.intro');
let intro_div_logo = document.querySelector('.introDivLogo');
let logos = document.querySelectorAll('.introLogo');
let intro_div_label = document.querySelector('.introLabelDiv');
let intro_dev_text = document.querySelector('.introDevLabel');
let intro_seed_text = document.querySelector('.introSeedLabel');

var type_speed = 50;
var dev_text_count = 0;

var seed_text_count = 0;

//Intro animation
window.addEventListener('DOMContentLoaded', ()=> {
    //Logos fade
    setTimeout(() => {
        logos.forEach((logo, idx)=>{
            setTimeout(() => {
               logo.classList.add('fade_in'); 
            }, (idx + 1) * 600);
        })
    });
    //Logos move up
    setTimeout(() => {
        logos.forEach((logo, idx)=>{
            setTimeout(() => {
               logo.classList.add('move_up'); 
            });
        })
    }, 1300);

    setTimeout(()=>{
        intro_dev_text.textContent = "";
        intro_seed_text.textContent = "";
    }, 1500);
    setTimeout(typeWriter, 1500);

    setTimeout(()=>{
        intro.classList.add('active');
    }, 2500);

})

function typeWriter() {
    //intro_dev_text.textContent = ""
    intro_div_label.classList.add('active');

    if(dev_text_count < 'dev'.length){
        intro_dev_text.innerHTML += 'dev'.charAt(dev_text_count);
        dev_text_count++;
    }
    if(seed_text_count < 'seed'.length){
        intro_seed_text.innerHTML += 'seed'.charAt(seed_text_count);
        seed_text_count++;
        setTimeout(typeWriter, 75);
    }
}

function onJuegosCategoryClicked() {
    window.open("https://wholstenholm.itch.io/", '_blank').focus();
}

function onTutorialesCategoryClicked(){
    window.location.href = 'Tutorials/PrimerPlataformero/index.html'
}

function onArticulosCategoryClicked() {
    window.open("https://usbcali.edu.co/exito-bonaventuriano-en-el-cali-game-jam-2025/", '_blank').focus();
}

