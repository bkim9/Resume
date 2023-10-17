function appendArray(el, arr) {
    arr.forEach( arrEl => {
        // Create DOM element
        let childNode = document.createElement('li');
        // Set content to current element
        childNode.innerHTML = arrEl;
        el.appendChild(childNode);
    })
}

function addExp(experinece) {
    const expE = document.querySelector('#experiences');

    // CreateElement
    if ("content" in document.createElement("template")) {
        const template = document.querySelector("#experience-template");

        // Clone
        const clone = template.content.cloneNode(true);

        // experience
        //      li   .label
        //#job       .title
        //#company   .company
        //#from      .from
        //#to        .to
        //#city      .city
        //#desc li   .desc
        const skilllist = clone.querySelector('#skills-box')
        appendArray(skilllist, experinece.label)
        clone.querySelector('#job').textContent = experinece.title
        clone.querySelector('#company').textContent = experinece.company
        clone.querySelector('#from').textContent = experinece.from
        clone.querySelector('#to').textContent = experinece.to
        clone.querySelector('#city').textContent = experinece.city
        const desclist = clone.querySelector('#desc')
        appendArray(desclist, experinece.desc)
        // appendChild
        expE.appendChild(clone);
    }
}

function addProj(proj) {
    console.log(proj);
    const projE = document.querySelector('#projects');
    // CreateElement
    if ("content" in document.createElement("template")) {
        const template = document.querySelector("#project-template");

        // Clone
        const clone = template.content.cloneNode(true);
    
        //       proj.label
        //           .title
        //           .from
        //           .to
        //           .language
        //           .decription
        const skilllist = clone.querySelector('#skills-box')
        appendArray(skilllist, proj.label)
        clone.querySelector('#title').textContent = proj.title
        clone.querySelector('#from').textContent = proj.from
        clone.querySelector('#to').textContent = proj.to
        // clone.querySelector('#language').textContent = proj.language
        const desclist = clone.querySelector('#desc')
        appendArray(desclist, proj.desc)
        // appendChild
        projE.appendChild(clone);
    }
}

async function importJSON() { 
    fetch("./data.json") 
        .then((res) => { 
        return res.json(); 
    }) 
    .then((data) => {
        exp = data.experience;
        projs= data.projects;
        // exp.forEach(addExp);
        projs.forEach(addProj);
        return data;
    }); 
}
importJSON()