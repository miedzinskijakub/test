const Papa = require("papaparse");

const CSV_URL = "https://docs.google.com/spreadsheets/d/1oVB9E0bPJmFyJ1YXhzJH6wyNPV9j6vUhJ6CIjIFxSKE/gviz/tq?tqx=out:csv&sheet=WFPiK";
const SITE_URL = "https://test-pi-plum-24.vercel.app";

async function check404() {
    console.log("Pobieram arkusz...");

    const csv = await fetch(CSV_URL).then(r => r.text());

    const { data } = Papa.parse(csv, {
        header: true,
        skipEmptyLines: true
    });

    let errors = 0;

    for (const row of data) {
        const name = row.name || "(brak nazwy)";

        for (const lang of ["PL", "EN"]) {
            const file = row[`sylwetka_${lang}`];

            if (!file) continue;

            const url =
                `${SITE_URL}/profiles/${lang.toLowerCase()}/${encodeURIComponent(file)}`;

            try {
                const res = await fetch(url, { method: "HEAD" });

                if (res.ok) {
                    console.log(`✅ ${name} (${lang})`);
                } else {
                    console.log(`❌ ${name} (${lang}) -> ${res.status}`);
                    console.log(`   ${url}`);
                    errors++;
                }
            } catch (e) {
                console.log(`❌ ${name} (${lang})`);
                console.log(e.message);
                errors++;
            }
        }
    }

    console.log("\n=========================");
    console.log(`Znaleziono ${errors} błędów.`);
}

check404();