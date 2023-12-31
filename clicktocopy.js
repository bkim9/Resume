// click to copy function 
// req: snackbar at the bottom
export function addClickBlock() {
  // click to copy
  const blockIconEs = document.querySelectorAll('.material-symbols-outlined[label=close]');
  blockIconEs.forEach(blockIconE => {
    blockIconE.addEventListener("click", () => { 
        const theArticle = blockIconE.parentElement.parentElement
        theArticle.parentElement.removeChild(theArticle)
        theArticle.blocked = true
    });
  })
}


// click to copy function 
// req: snackbar at the bottom
export function addClickCopy() {
  // click to copy
  const copyIconEs = document.querySelectorAll('.material-icons[label="copy"]');
  copyIconEs.forEach(copyIconE => {
    copyIconE.addEventListener("click", () => { 
      copyContent(
        copyIconE.previousElementSibling.textContent
      )
    });
  })
}

async function copyContent(copyText) {
  try {
    await navigator.clipboard.writeText(copyText);
    snackbar();
    /* Resolved - text copied to clipboard successfully */
  } catch (err) {
    console.error('Failed to copy: ', err);
    /* Rejected - text failed to copy to the clipboard */
  }
}

function snackbar() {
  // snackbar eleement
  var snackbarE = document.querySelector("#snackbar")
  snackbarE.style.display = "inline"
  // remove 2 second later

  setTimeout(function(){ snackbarE.style.display = "none"; }, 2000);

}

// document.addEventListener("DOMContentUpdated", addClickCopy);