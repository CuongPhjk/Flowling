// Original vector editorial covers, available offline without third-party image requests.
const fs = require("node:fs");
const out = "public/covers";
fs.mkdirSync(out, { recursive: true });
const wraps = (body, bg = "#dceadd") =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="600" viewBox="0 0 960 600"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="${bg}"/><stop offset="1" stop-color="#f4e6d2"/></linearGradient><linearGradient id="land" x2="0" y2="1"><stop stop-color="#517e68"/><stop offset="1" stop-color="#173d35"/></linearGradient><radialGradient id="glow"><stop stop-color="#fff4ce"/><stop offset="1" stop-color="#efbd83"/></radialGradient></defs><rect width="960" height="600" fill="url(#sky)"/>${body}</svg>`;
const covers = {
  science: wraps(
    '<rect width="960" height="600" fill="#182533"/><g fill="#e6d8be">' +
      Array.from(
        { length: 65 },
        (_, i) =>
          `<circle cx="${(i * 137) % 950}" cy="${(i * 71) % 600}" r="${i % 3 === 0 ? 2 : 1}"/>`,
      ).join("") +
      '</g><circle cx="610" cy="240" r="173" fill="#c77c5c"/><path d="M450 170Q530 100 630 190T770 190M445 280Q600 190 773 285M510 370Q610 310 700 370" fill="none" stroke="#b26950" stroke-width="33" opacity=".7"/><path d="M0 470L240 320 430 420 660 395 960 520V600H0" fill="#785c4c"/><path d="M0 570Q290 390 580 535T960 565V600H0" fill="#413d36"/>',
  ),
  psychology: wraps(
    '<circle cx="720" cy="145" r="68" fill="url(#glow)"/><path d="M0 380Q180 280 360 390T740 350 960 350V600H0" fill="#aabda3"/><path d="M0 430Q250 310 460 435T960 400V600H0" fill="#6c957b"/><path d="M0 480Q270 420 600 490T960 445V600H0" fill="url(#land)"/><path d="M490 600Q440 525 570 457T550 405" stroke="#e5d3a6" stroke-width="43" fill="none"/><path d="M135 500V190M135 365Q30 290 60 230Q150 240 135 365M135 285Q250 220 213 155Q137 190 135 285" fill="#365d46" stroke="#365d46" stroke-width="12"/>',
  ),
  environment: wraps(
    '<circle cx="740" cy="120" r="70" fill="#ffe4ab"/><path d="M0 230Q120 170 260 230T520 230 780 230 1040 230V600H0" fill="#81b9b9"/><path d="M0 290Q150 225 300 290T600 290 960 285V600H0" fill="#519999"/><path d="M0 380Q150 290 320 380T640 380 960 370V600H0" fill="#2c747d"/><path d="M0 500Q230 360 470 500T960 490V600H0" fill="#174e60"/><g fill="none" stroke="#bde1d7" stroke-width="4" opacity=".65"><path d="M80 325Q175 298 250 325M480 410Q620 370 750 410M60 530Q180 490 290 530"/></g><path d="M380 173q20-15 40 0q20-15 40 0M465 130q15-10 30 0q15-10 30 0" stroke="#507476" stroke-width="4" fill="none"/>',
    "#b9d5d8",
  ),
  tech: wraps(
    '<rect width="960" height="600" fill="#182e3f"/><g stroke="#3a7d86" stroke-width="2" opacity=".6">' +
      Array.from(
        { length: 16 },
        (_, i) => `<path d="M${i * 75} 0V600M0 ${i * 55}H960"/>`,
      ).join("") +
      '</g><circle cx="510" cy="280" r="170" fill="#31576a"/><circle cx="510" cy="280" r="123" fill="#72a7a2"/><circle cx="510" cy="280" r="70" fill="#d0dfbf"/><g stroke="#aad7c7" stroke-width="3" fill="none"><ellipse cx="510" cy="280" rx="290" ry="100" transform="rotate(-28 510 280)"/><ellipse cx="510" cy="280" rx="230" ry="200" transform="rotate(40 510 280)"/></g><circle cx="250" cy="420" r="22" fill="#f1c586"/><circle cx="720" cy="180" r="12" fill="#e9ddbd"/>',
  ),
  culture: wraps(
    '<circle cx="700" cy="170" r="110" fill="#d79676"/><path d="M0 440L180 270 350 390 590 290 960 445V600H0" fill="#879788"/><path d="M0 470Q320 390 960 440V600H0" fill="#536d60"/><path d="M360 600L425 380H535L620 600" fill="#c7b992"/><g fill="#9a4d38"><path d="M270 185H690V210H270zM330 200H357V535H330zM603 200H630V535H603zM300 285H660V307H300z"/><path d="M255 170Q480 215 705 170L690 207Q480 250 270 207Z" fill="#383f33"/></g><path d="M135 600V70M135 250Q55 225 30 150M135 175Q195 140 225 100" stroke="#364b3b" stroke-width="20" fill="none"/><g fill="#afbea3"><circle cx="60" cy="140" r="85"/><circle cx="170" cy="95" r="95"/><circle cx="260" cy="120" r="62"/></g>',
    "#e8d8c5",
  ),
  health: wraps(
    '<rect width="960" height="600" fill="#344746"/><rect x="115" y="65" width="340" height="340" rx="160" fill="#8ea89e"/><circle cx="295" cy="185" r="65" fill="#f5e4b6"/><circle cx="322" cy="160" r="65" fill="#8ea89e"/><path d="M280 65V405M115 265H455" stroke="#344746" stroke-width="12"/><rect y="465" width="960" height="135" fill="#bfa88a"/><rect x="560" y="360" width="220" height="110" rx="12" fill="#e1d8b9"/><path d="M590 370v-110h160v110" fill="#65887b"/><path d="M680 330v-150M680 240q-90-60-85-100q100 0 85 100M680 295q90-60 85-100q-100 0-85 100" fill="#779b80" stroke="#b4c6a1" stroke-width="5"/>',
  ),
  economy: wraps(
    '<rect y="400" width="960" height="200" fill="#b0bd9b"/><path d="M360 235H640L670 515H330Z" fill="#d4a76d"/><path d="M405 265V210Q405 120 500 120T595 210V265" fill="none" stroke="#8b714c" stroke-width="16"/><path d="M490 440V270M490 380Q390 330 420 280Q505 285 490 380M490 340Q590 290 565 245Q490 270 490 340" fill="#547e51" stroke="#547e51" stroke-width="8"/><circle cx="185" cy="395" r="60" fill="#e6c267"/><circle cx="775" cy="430" r="40" fill="#e9d18a"/>',
    "#e9dbb5",
  ),
  education: wraps(
    '<circle cx="730" cy="140" r="90" fill="#e8bd7e"/><path d="M140 475L455 550V230L140 180Z" fill="#fff4d9"/><path d="M455 550L790 460V160L455 230Z" fill="#e2d5b3"/><path d="M130 490L455 575 805 477" fill="none" stroke="#487865" stroke-width="18"/><g stroke="#b8b297" stroke-width="8"><path d="M190 260L400 308M190 315L400 365M190 370L365 412M510 302L733 244M510 359L733 301M510 416L684 373"/></g><path d="M830 470V260M830 355Q730 285 782 239Q851 275 830 355" fill="#698a5c" stroke="#698a5c" stroke-width="8"/>',
  ),
  society: wraps(
    '<circle cx="755" cy="135" r="70" fill="#f1dba4"/><path d="M50 400V210H220V400M240 400V130H410V400M435 400V260H590V400M620 400V175H820V400" fill="#819e8a"/><g fill="#d1d9b9">' +
      Array.from(
        { length: 16 },
        (_, i) =>
          `<rect x="${80 + (i % 8) * 95}" y="${225 + Math.floor(i / 8) * 85}" width="28" height="42" rx="2"/>`,
      ).join("") +
      '</g><rect y="405" width="960" height="195" fill="#70865d"/><path d="M0 545H960" stroke="#d6c9a1" stroke-width="80"/><rect x="420" y="400" width="235" height="15" fill="#3f5540"/><path d="M445 415V465M630 415V465" stroke="#3f5540" stroke-width="13"/><path d="M190 500V190M850 500V220" stroke="#455d42" stroke-width="20"/><g fill="#55794d"><circle cx="190" cy="190" r="90"/><circle cx="850" cy="225" r="85"/></g>',
  ),
};
for (const [name, svg] of Object.entries(covers))
  fs.writeFileSync(`${out}/${name}.svg`, svg);
