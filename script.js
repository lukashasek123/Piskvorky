let pole = document.getElementById("pole");
let zprava = document.getElementById("zprava");
let tahy = document.getElementById("tahy");
let pocetHracu = document.getElementById("pocetHracu");
let novaHra = document.getElementById("novaHra");
let udalost = document.getElementById("udalost");

let symboly = ["X", "O", "▲", "■"];
let hrac = 0;
let pocetTahu = 0;
let hra = [];
let stity = [];
let konec = false;
let vyber = false;
let dvojityTah = false;
let zvyraznene = -1;
let druhZvyrazneni = "";
let casovac;
let zpravaUdalosti = false;

function vytvorPole() {
    clearTimeout(casovac);
    zvyraznene = -1;
    druhZvyrazneni = "";
    zpravaUdalosti = false;
    pole.innerHTML = "";
    hra = [];
    stity = [];
    hrac = 0;
    pocetTahu = 0;
    konec = false;
    dvojityTah = false;
    tahy.textContent = "Počet tahů: 0";
    zprava.textContent = "Na tahu je hráč 1 (X)";
    udalost.textContent = "";

    for (let i = 0; i < 225; i++) {
        hra.push("");
        stity.push(false);
        let policko = document.createElement("button");
        policko.className = "policko";
        policko.addEventListener("click", function() {
            zahraj(i);
        });
        pole.appendChild(policko);
    }
}

function zobrazPole() {
    let policka = pole.children;
    for (let i = 0; i < 225; i++) {
        policka[i].textContent = hra[i];
        policka[i].className = "policko";
        if (stity[i] && hra[i] != "") {
            policka[i].className = "policko stit";
        }
        if (i == zvyraznene) {
            policka[i].className += " " + druhZvyrazneni;
        }
    }
}

function zahraj(i) {
    if (konec || hra[i] != "") {
        return;
    }
    if (zpravaUdalosti) {
        udalost.textContent = "";
        zpravaUdalosti = false;
    }
    hra[i] = symboly[hrac];
    pocetTahu++;
    tahy.textContent = "Počet tahů: " + pocetTahu;
    zobrazPole();

    if (zkontrolujVyhru()) {
        return;
    }
    if (pocetTahu % 5 == 0) {
        nahodnaUdalost();
        zobrazPole();
        if (zkontrolujVyhru()) {
            return;
        }
    }
    if (hra.indexOf("") == -1) {
        zprava.textContent = "Remíza!";
        konec = true;
        return;
    }

    if (dvojityTah) {
        dvojityTah = false;
        zprava.textContent = "Hráč " + (hrac + 1) + " hraje ještě jednou (" + symboly[hrac] + ")";
    } else {
        hrac++;
        if (hrac == Number(pocetHracu.value)) {
            hrac = 0;
        }
        zprava.textContent = "Na tahu je hráč " + (hrac + 1) + " (" + symboly[hrac] + ")";
    }
}

// AI Used, Model: OpenAI GPT-5.6-sol
function vyhra(pozice, znak) {
    let radek = Math.floor(pozice / 15);
    let sloupec = pozice % 15;
    let smery = [[1, 0], [0, 1], [1, 1], [1, -1]];
    for (let i = 0; i < smery.length; i++) {
        let pocet = 1;
        for (let strana = -1; strana <= 1; strana += 2) {
            let r = radek + smery[i][0] * strana;
            let s = sloupec + smery[i][1] * strana;
            while (r >= 0 && r < 15 && s >= 0 && s < 15 && hra[r * 15 + s] == znak) {
                pocet++;
                r += smery[i][0] * strana;
                s += smery[i][1] * strana;
            }
        }
        if (pocet >= 7) {
            return true;
        }
    }
    return false;
}

function zkontrolujVyhru() {
    for (let i = 0; i < 225; i++) {
        if (hra[i] != "" && vyhra(i, hra[i])) {
            let vitez = symboly.indexOf(hra[i]);
            zprava.textContent = "Vyhrál hráč " + (vitez + 1) + " (" + hra[i] + ")!";
            konec = true;
            return true;
        }
    }
    return false;
}

function nahodneCislo(max) {
    return Math.floor(Math.random() * max);
}

function zvyrazniPolicko(i, druh) {
    clearTimeout(casovac);
    zvyraznene = i;
    druhZvyrazneni = druh;
    casovac = setTimeout(function() {
        zvyraznene = -1;
        druhZvyrazneni = "";
        zobrazPole();
    }, 1800);
}

function nahodnaUdalost() {
    zpravaUdalosti = true;
    let typ = nahodneCislo(4);
    let moznosti = [];
    let i;

    if (typ == 0) {
        for (i = 0; i < 225; i++) {
            if (hra[i] != "" && !stity[i]) {
                moznosti.push(i);
            }
        }
        if (moznosti.length > 0) {
            i = moznosti[nahodneCislo(moznosti.length)];
            hra[i] = "";
            zvyrazniPolicko(i, "zmizel");
            udalost.textContent = "Ztráta symbolu: jeden náhodný symbol zmizel.";
        } else {
            udalost.textContent = "Ztráta symbolu: všechny symboly jsou chráněné.";
        }
    }

    if (typ == 1) {
        for (i = 0; i < 225; i++) {
            if (hra[i] == symboly[hrac] && !stity[i]) {
                moznosti.push(i);
            }
        }
        if (moznosti.length > 0) {
            i = moznosti[nahodneCislo(moznosti.length)];
            stity[i] = true;
            udalost.textContent = "Štít: jeden symbol hráče " + (hrac + 1) + " je chráněný (zelené pole).";
        } else {
            udalost.textContent = "Štít: není žádný symbol, který by šlo ochránit.";
        }
    }

    if (typ == 2) {
        dvojityTah = true;
        udalost.textContent = "Dvojitý tah: hráč " + (hrac + 1) + " hraje ještě jednou!";
    }

    if (typ == 3) {
        for (i = 0; i < 225; i++) {
            if (hra[i] != "" && hra[i] != symboly[hrac] && !stity[i]) {
                moznosti.push(i);
            }
        }
        if (moznosti.length > 0) {
            i = moznosti[nahodneCislo(moznosti.length)];
            hra[i] = symboly[hrac];
            zvyrazniPolicko(i, "ukraden");
            udalost.textContent = "Krádež symbolu: hráč " + (hrac + 1) + " získal soupeřův symbol.";
        } else {
            udalost.textContent = "Krádež symbolu: není co ukrást.";
        }
    }
}

novaHra.addEventListener("click", function() {
    if (!vyber) {
        vyber = true;
        konec = true;
        pocetHracu.disabled = false;
        novaHra.textContent = "Spustit hru";
        zprava.textContent = "Vyber počet hráčů a spusť hru";
        udalost.textContent = "";
        zpravaUdalosti = false;
        clearTimeout(casovac);
        zvyraznene = -1;
        druhZvyrazneni = "";
        zobrazPole();
    } else {
        vyber = false;
        pocetHracu.disabled = true;
        novaHra.textContent = "Nová hra";
        vytvorPole();
    }
});

pocetHracu.disabled = true;
vytvorPole();
