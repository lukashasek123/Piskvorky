let pole = document.getElementById("pole");
let zprava = document.getElementById("zprava");
let tahy = document.getElementById("tahy");
let pocetHracu = document.getElementById("pocetHracu");
let novaHra = document.getElementById("novaHra");

let symboly = ["X", "O", "▲", "■"];
let hrac = 0;
let pocetTahu = 0;
let hra = [];

function vytvorPole() {
    pole.innerHTML = "";
    hra = [];
    hrac = 0;
    pocetTahu = 0;
    tahy.textContent = "Počet tahů: 0";
    zprava.textContent = "Na tahu je hráč 1 (X)";

    for (let i = 0; i < 225; i++) {
        hra.push("");
        let policko = document.createElement("button");
        policko.className = "policko";
        policko.addEventListener("click", function() {
            if (hra[i] != "") {
                return;
            }
            hra[i] = symboly[hrac];
            policko.textContent = symboly[hrac];
            pocetTahu++;
            tahy.textContent = "Počet tahů: " + pocetTahu;
            hrac++;
            if (hrac == Number(pocetHracu.value)) {
                hrac = 0;
            }
            zprava.textContent = "Na tahu je hráč " + (hrac + 1) + " (" + symboly[hrac] + ")";
        });
        pole.appendChild(policko);
    }
}

novaHra.addEventListener("click", vytvorPole);
vytvorPole();
