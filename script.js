let pole = document.getElementById("pole");
let zprava = document.getElementById("zprava");
let tahy = document.getElementById("tahy");
let pocetHracu = document.getElementById("pocetHracu");
let novaHra = document.getElementById("novaHra");

let symboly = ["X", "O", "▲", "■"];
let hrac = 0;
let pocetTahu = 0;
let hra = [];
let konec = false;
let vyber = false;

function vytvorPole() {
    pole.innerHTML = "";
    hra = [];
    hrac = 0;
    pocetTahu = 0;
    konec = false;
    tahy.textContent = "Počet tahů: 0";
    zprava.textContent = "Na tahu je hráč 1 (X)";

    for (let i = 0; i < 225; i++) {
        hra.push("");
        let policko = document.createElement("button");
        policko.className = "policko";
        policko.addEventListener("click", function() {
            if (konec || hra[i] != "") {
                return;
            }
            hra[i] = symboly[hrac];
            policko.textContent = symboly[hrac];
            pocetTahu++;
            tahy.textContent = "Počet tahů: " + pocetTahu;

            if (vyhra(i)) {
                zprava.textContent = "Vyhrál hráč " + (hrac + 1) + " (" + symboly[hrac] + ")!";
                konec = true;
                return;
            }
            if (pocetTahu == 225) {
                zprava.textContent = "Remíza!";
                konec = true;
                return;
            }
            hrac++;
            if (hrac == Number(pocetHracu.value)) {
                hrac = 0;
            }
            zprava.textContent = "Na tahu je hráč " + (hrac + 1) + " (" + symboly[hrac] + ")";
        });
        pole.appendChild(policko);
    }
}

function vyhra(pozice) {
    let radek = Math.floor(pozice / 15);
    let sloupec = pozice % 15;
    let smery = [[1, 0], [0, 1], [1, 1], [1, -1]];

    for (let i = 0; i < smery.length; i++) {
        let pocet = 1;
        for (let strana = -1; strana <= 1; strana += 2) {
            let r = radek + smery[i][0] * strana;
            let s = sloupec + smery[i][1] * strana;
            while (r >= 0 && r < 15 && s >= 0 && s < 15 && hra[r * 15 + s] == symboly[hrac]) {
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

novaHra.addEventListener("click", function() {
    if (!vyber) {
        vyber = true;
        konec = true;
        pocetHracu.disabled = false;
        novaHra.textContent = "Spustit hru";
        zprava.textContent = "Vyber počet hráčů a spusť hru";
    } else {
        vyber = false;
        pocetHracu.disabled = true;
        novaHra.textContent = "Nová hra";
        vytvorPole();
    }
});

pocetHracu.disabled = true;
vytvorPole();
