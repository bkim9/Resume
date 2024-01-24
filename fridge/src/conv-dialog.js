export { addDialog }

let dialogEs;

function addDialog( dialogE ) {
    const convOpenButtonE = dialogE.nextElementSibling;
    const convSubmitButtonE = dialogE.querySelector("#conv-submit-button");
    const convCloseButtonE = dialogE.querySelector("#conv-close-button");
    // open
    convOpenButtonE.addEventListener("click", ()=>{
        dialogE.show();
        dialogE.style.display = "flex";
        convOpenButtonE.style.display = "none";
    }); 

    // submit
    convSubmitButtonE.addEventListener("click", ()=>{
        dialogE.close();
        dialogE.style.display = "none";
        convOpenButtonE.style.display = "flex";
    })

    // close
    convCloseButtonE.addEventListener("click", ()=>{
        dialogE.close();
        dialogE.style.display = "none";
        convOpenButtonE.style.display = "flex";
    })
}

function init() {
    dialogEs = document.querySelectorAll("dialog");
    for (const dialogE of dialogEs){
        addDialog(dialogE);
    }
}

window.addEventListener("DOMContentLoaded", init);