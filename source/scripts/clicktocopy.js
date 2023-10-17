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
  snackbarE.style.display = ""
  // remove 3 second later
  setTimeout(function(){ snackbarE.style.display = "none"; }, 3000);
}
document.addEventListener("DOMContentUpdated", addClickCopy);