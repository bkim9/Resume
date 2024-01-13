function init() {
    const dialogE = document.querySelector("#conv-dialog");
    // open dialog
    const convButtonE = document.querySelector("#conv-button");
    convButtonE.addEventListener("click", ()=>{
        dialogE.show();
        convButtonE.style.display = "none"
    }); 

    // submit dialog
    const convSubmitButtonE = document.querySelector("#conv-submit-button")
    convSubmitButtonE.addEventListener("click", ()=>{
        dialogE.close();
    })

    // close dialog
    const convCloseButtonE = document.querySelector("#conv-close-button");
    convCloseButtonE.addEventListener("click", ()=>{
        dialogE.close();
        convButtonE.style.display = "flex"
    })
}

window.addEventListener("DOMContentLoaded", init);