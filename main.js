// Created by Beomsu Kim on Oct.1st 2023
import {addClickCopy, addClickBlock} from "./clicktocopy.js"

var data = [];

function clearItems(parent) {
    while (parent.hasChildNodes())
        parent.removeChild(parent.firstChild)
}

function appendArray(el, arr, hidden=false) {
    let first = true
    arr.forEach( arrEl => {
        let childNode = document.createElement('li');
        // Set content to current element
        childNode.innerHTML = arrEl;
        if (hidden) childNode.innerHTML = "\u2022 " + childNode.innerText
        if (hidden && !first) childNode.innerHTML = "\n" + childNode.innerText;
        el.appendChild(childNode);
        first=false
    })
}

function updateDisplay() {
    clearItems(document.querySelector('#experiences'));
    clearItems(document.querySelector('#projects'));
    display_items(load_items(0));
}

function appendSkillButtons(el, arr) {
    arr.forEach( arrEl => {
        // Create DOM element
        let childNode = document.createElement('input');
        childNode.type = 'checkbox';
        childNode.className = 'hidden';
        childNode.checked = true;
        childNode.name  = arrEl;

        el.appendChild(childNode);

        childNode = document.createElement('label');
        childNode.className = 'filterby_label';
        childNode.textContent = arrEl;
        childNode.setAttribute('for', arrEl);
        childNode.addEventListener("click", () => {
            childNode.previousSibling.checked = !childNode.previousSibling.checked;
            updateDisplay();
        });
        el.appendChild(childNode);
    })

    // reset to false after clicking the Skills title
    const skillTitleE = document.querySelector('#skills-title');
    skillTitleE.addEventListener("click", ()=>{
        const checkBoxEs = document.querySelectorAll('input[type=checkbox]');
        for( const checkBoxE of checkBoxEs ){ 
            checkBoxE.checked = false; 
        }
        updateDisplay();
    });
}

function checkFit(item) {
    // if item is blocked, return false
    if (item.blocked) return false;
    let fit = false;
    const skillEs = document.querySelectorAll('input[type=checkbox]+label')

    for( let l of item.label ) {
        for( let s of skillEs) 
            if ( l == s.textContent && s.previousSibling.checked ) fit = true;
    }
    return fit;
}

function displayExp(experinece) {
    const expE = document.querySelector('#experiences');
    if( !checkFit(experinece) ) return;
    // CreateElement
    if ("content" in document.createElement("template")) {
        const template = document.querySelector("#experience-template");
        // Clone
        const clone = template.content.cloneNode(true);
        const skilllist = clone.querySelector('#skills-box')
        appendArray(skilllist, experinece.label)
        clone.querySelector('#job').textContent = experinece.title
        clone.querySelector('#company').textContent = experinece.company
        clone.querySelector('#from').textContent = experinece.from
        clone.querySelector('#to').textContent = experinece.to
        clone.querySelector('#city').textContent = experinece.city
        const desclist = clone.querySelector('#desc')
        appendArray(desclist, experinece.desc)
        // hidden-desc
        const hiddenDesc = clone.querySelector('#hidden-desc')
        appendArray(hiddenDesc, experinece.desc, true)
        // appendChild
        expE.appendChild(clone);
    }
}

function displayProj(proj) {
    const projE = document.querySelector('#projects');
    if ( !checkFit(proj) ) return;
    // CreateElement
    if ("content" in document.createElement("template")) {
        const template = document.querySelector("#project-template");
        // Clone
        const clone = template.content.cloneNode(true);
        const skilllist = clone.querySelector('#skills-box')
        appendArray(skilllist, proj.label)

        const cloneTitleE = clone.querySelector('#title');
        // if link exists in proj, attatch it
        if ( proj.link ) {
            const aE = document.createElement("a");
            aE.href = proj.link;
            aE.textContent = proj.title;
            cloneTitleE.appendChild(aE);
        } else {
            cloneTitleE.textContent = proj.title
        }

        const cloneDescRightE = clone.querySelector('.desc-right')
        // if img exists in proj, attach it
        if ( proj.img ) {
            const imgE = document.createElement("img");
            imgE.src = proj.img;
            imgE.alt = proj.img;
            cloneDescRightE.appendChild(imgE);
        }

        clone.querySelector('#from').textContent = proj.from
        clone.querySelector('#to')  .textContent = proj.to

        const desclist = clone.querySelector('ul#desc')
        appendArray(desclist, proj.desc)

        // hidden-desc for clipboard
        const hiddenDesc = clone.querySelector('#hidden-desc')
        appendArray(hiddenDesc, proj.desc, true)
        // appendChild
        projE.appendChild(clone);
    }
}

/** 
 * loads the current data from storage and appends
 *
 *  @return {Object[]|null} Article Array object from local storage or null if missing
 */

function load_items(storage_key) {
    let storageItem = window.localStorage.getItem(storage_key);
    let items = JSON.parse(storageItem);
    if (!items) {
        console.log('Faied loading');
        return [];
    } else {
        return items;
    }
}
  
/**
 * Stores items in localStorage
 *
 *  @param {Object[]} items - array of items to store
 */
function store_items(items, storage_key) {
    window.localStorage.setItem(storage_key, JSON.stringify(items));
}

function display_items() {
    const exp = data.experience;
    const projs= data.projects;    
    exp.forEach(displayExp);
    projs.forEach(displayProj);
    addClickCopy();
    addClickBlock();
}

// data->localStorage
async function importJSON() {
    await fetch("./data.json").then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Something went wrong');
      })
      .then((responseJson) => {
        data = responseJson;
        store_items(responseJson,0);
      })
      .catch((error) => {
        console.log(error)
      });
    store_items(data,0);
}


async function init() {
    await importJSON();
    data = load_items(0);        
    // append skills buttons
    const skillsEBox = document.querySelector('details.skills');
    appendSkillButtons(skillsEBox,data.skills);

    display_items(data);
}

window.addEventListener("DOMContentLoaded", init);