document.addEventListener("DOMContentLoaded", async function (event) {
    var goIcons = document.getElementsByTagName("footer")[0].getElementsByTagName("div");
    for (var i = 0; i < goIcons.length; i++) {
        goIcons[i].addEventListener('mousedown', Go, false);
    }
    await prepareData();
    await bindModalEvents();
    await prepareIcons();
});

async function prepareIcons() {
    const footer = document.getElementsByTagName("footer")[0];
    const elements = footer.getElementsByTagName("div");

    for (let i = 0; i < elements.length; i++) {
        const item = elements[i];

        item.style.backgroundImage = `url(../assets/Icons/${item.dataset.icon}.png)`;

        item.dataset.icon
    }
}

async function prepareData() {
    var data = JSON.parse(window.localStorage.getItem("Links")) || [];
    var container = document.getElementById("container");
    container.innerHTML = '';
    var counter = 0;

    for (let i = 0; i < data.length; i++) {
        const element = data[i];

        var btn = document.createElement("button");
        btn.dataset.link = element.link;
        btn.id = element.name;
        btn.innerText = element.name;
        btn.className = 'go-btn';
        container.appendChild(btn);
        counter++;
    }
    await bindLinks();
}

//#region Event Binding
async function bindLinks() {
    var goBtns = document.getElementsByClassName("go-btn");
    for (var i = 0; i < goBtns.length; i++) {
        goBtns[i].addEventListener('mousedown', Go, false);
        goBtns[i].innerHTML = goBtns[i].id;
    }
}

async function bindModalEvents() {
    var modalx = document.getElementById("modal-x");
    var newlink = document.getElementById("new-link");
    var modalbtn = document.getElementById("modal-button");
    modalx.addEventListener('mousedown', function () {
        closeModal()
    });
    newlink.addEventListener('mousedown', function () {
        openModal()
    })
    modalbtn.addEventListener('mousedown', function () {
        saveLink()
    })
}
//#endregion


//#region Modal
async function openModal() {
    var modal = document.getElementById("modal");
    if (modal.style.visibility === 'visible') {
        await closeModal();
        return;
    }
    modal.style.opacity = '100';
    modal.style.visibility = 'visible';
}

async function closeModal() {
    var modal = document.getElementById("modal");
    modal.style.visibility = 'hidden';
    modal.style.opacity = '0';
}

async function saveLink() {
    var name = document.getElementById("link-name");
    var link = document.getElementById("link-link");

    var data = JSON.parse(window.localStorage.getItem("Links")) || [];
    var item = {
        name: name.value,
        link: link.value
    }
    data.push(item);
    localStorage.setItem('Links', JSON.stringify(data));
    modal.style.display = 'none';
    name.value = '';
    link.value = '';

    prepareData();
}
//#endregion

async function Go(e) {
    var url = e.path[0].dataset.link;
    switch (e.button) {
        case 0:
            chrome.tabs.update(null, {
                url: url
            });
            break;
        case 1:
            chrome.tabs.create({
                "url": url
            });
            break;
    }
}