let cards = document.querySelectorAll('.card');

function plataformeroCardClicked(){
    window.location.href = '../Tutorials/PrimerPlataformero/index.html'
}

//Intro animation
window.addEventListener('DOMContentLoaded', ()=> {
    //Cards fade
    setTimeout(() => {
        cards.forEach((card, idx)=>{
            setTimeout(() => {
               card.classList.add('active'); 
            }, (idx + 1) * 300);
        })
    });
})