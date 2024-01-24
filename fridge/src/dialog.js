export { addDialog }

let dialogEs;

function addDialog( dialogE ) {
    const dialogOpenButtonE = dialogE.nextElementSibling;
    const dialogSubmitButtonE = dialogE.querySelector("#dialog-submit-button");
    const dialogCloseButtonE = dialogE.querySelector("#dialog-close-button");
    // open
    dialogOpenButtonE.addEventListener("click", ()=>{
        dialogE.show();
        dialogE.style.display = "flex";
        dialogOpenButtonE.style.display = "none";
    }); 

    // submit
    dialogSubmitButtonE.addEventListener("click", ()=>{
        dialogE.close();
        dialogE.style.display = "none";
        dialogOpenButtonE.style.display = "flex";
    })

    // close
    dialogCloseButtonE.addEventListener("click", ()=>{
        dialogE.close();
        dialogE.style.display = "none";
        dialogOpenButtonE.style.display = "flex";
    })
}

function init() {
    dialogEs = document.querySelectorAll("dialog");
    for (const dialogE of dialogEs){
        addDialog(dialogE);
    }
}

window.addEventListener("DOMContentLoaded", init);