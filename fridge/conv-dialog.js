function init() {
    // open dialog
    const convButtonE = document.querySelector("#conv-button");
    convButtonE.addEventListener("click", ()=>{
        const dialogE = document.querySelector("#conv-dialog");
        dialogE.show();
        convButtonE.style.display = "none"
    }); 

    // submit dialog
    const convSubmitButtonE = document.querySelector("#conv-submit-button")
    convSubmitButtonE.addEventListener("click", ()=>{
        const dialogE = document.querySelector("#conv-dialog");
        const convButtonE = document.querySelector("#conv-button");
        dialogE.close();
        convButtonE.style.display = "flex"
    })

    // close dialog
    const convCloseButtonE = document.querySelector("#conv-close-button");
    convCloseButtonE.addEventListener("click", ()=>{
        const dialogE = document.querySelector("#conv-dialog");
        const convButtonE = document.querySelector("#conv-button");
        dialogE.close();
        convButtonE.style.display = "flex"
    })
}

window.addEventListener("DOMContentLoaded", init);