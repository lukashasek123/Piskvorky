
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
let probihaZemetreseni = false;
let casovacZemetreseni;
let vyherniPolicka = [];

function vytvorPole() {
    clearTimeout(casovac);
    clearTimeout(casovacZemetreseni);
    pole.classList.remove("zemetreseni");
    probihaZemetreseni = false;

    zvyraznene = -1;
    druhZvyrazneni = "";
    zpravaUdalosti = false;
    vyherniPolicka = [];
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

        if (vyherniPolicka.indexOf(i) != -1) {
            policka[i].className += " vyherni";
        }
    }
}

function zahraj(i) {
    if (konec || probihaZemetreseni || hra[i] != "") {
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

        if (probihaZemetreseni) {
            return;
        }

        if (zkontrolujVyhru()) {
            return;
        }
    }

    dokoncitTah();
}

function dokoncitTah() {
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
// AI Used, Model: OpenAI GPT-6
function vyhra(pozice, znak) {
    let radek = Math.floor(pozice / 15);
    let sloupec = pozice % 15;
    let smery = [[1, 0], [0, 1], [1, 1], [1, -1]];

    for (let i = 0; i < smery.length; i++) {
        let policka = [pozice];

        for (let strana = -1; strana <= 1; strana += 2) {
            let r = radek + smery[i][0] * strana;
            let s = sloupec + smery[i][1] * strana;

            while (r >= 0 && r < 15 && s >= 0 && s < 15 && hra[r * 15 + s] == znak) {
                policka.push(r * 15 + s);
                r += smery[i][0] * strana;
                s += smery[i][1] * strana;
            }
        }

        if (policka.length >= 7) {
            vyherniPolicka = policka;
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
            zobrazPole();

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

// AI Used, Model: OpenAI GPT-6
function zemetreseni() {
    probihaZemetreseni = true;
    udalost.textContent = "Zemětřesení! Celé herní pole se promíchává!";
    zprava.textContent = "Probíhá zemětřesení...";

    pole.classList.add("zemetreseni");

    casovacZemetreseni = setTimeout(function() {
        for (let i = 224; i > 0; i--) {
            let j = nahodneCislo(i + 1);

            let pomocna = hra[i];
            hra[i] = hra[j];
            hra[j] = pomocna;

            let pomocnyStit = stity[i];
            stity[i] = stity[j];
            stity[j] = pomocnyStit;
        }

        pole.classList.remove("zemetreseni");
        probihaZemetreseni = false;
        zobrazPole();

        if (zkontrolujVyhru()) {
            return;
        }

        dokoncitTah();
    }, 1800);
}

function nahodnaUdalost() {
    zpravaUdalosti = true;

    let typ = nahodneCislo(100);
    let moznosti = [];
    let i;

    if (typ < 5) {
        zemetreseni();
        return;
    }

    if (typ < 29) {
        typ = 0;
    } else if (typ < 53) {
        typ = 1;
    } else if (typ < 77) {
        typ = 2;
    } else {
        typ = 3;
    }

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
        clearTimeout(casovacZemetreseni);
        pole.classList.remove("zemetreseni");
        probihaZemetreseni = false;

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
