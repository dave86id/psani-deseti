import type { Lesson, Section } from '../types';
import { generateExerciseText } from '../utils/exerciseGenerator';

function makeLessons(
  lessonDefs: Array<{
    id: string;
    title: string;
    newLetters: string[];
    allLetters: string[];
    numExercises?: number;
    customTexts?: (string | undefined)[];
  }>
): Lesson[] {
  return lessonDefs.map(def => {
    const n = def.numExercises ?? 8;
    const exercises = Array.from({ length: n }, (_, i) => ({
      id: i + 1,
      text: def.customTexts?.[i] ?? generateExerciseText(def.newLetters, def.allLetters, i + 1),
    }));
    return {
      id: def.id,
      title: def.title,
      newLetters: def.newLetters,
      allLetters: def.allLetters,
      exercises,
    };
  });
}

// Cumulative letter sets
const homeRow = ['f','j','d','k','s','l','a','ů','g','h'];
const topRow = [...homeRow, 'r','u','t','z','e','i','w','o','p','q','ú'];
const allRows = [...topRow, 'v','m','b','n','c','x','y',',',' ','.', '-'];
const withDiacritics = [...allRows, 'í','á','é','ě','ý','š','č','ř','ž','ó','ď','ť','ň'];
const withSpecial = [...withDiacritics, '?', '!'];
const withNumbers = [...withSpecial, '1','2','3','4','5','6','7','8','9','0'];

export const sections: Section[] = [
  {
    id: 1,
    title: 'Střední řada',
    lessons: makeLessons([
      {
        id: '1.1', title: 'f, j', newLetters: ['f','j'], allLetters: ['f','j'],
        customTexts: [
          'f j f j f j f j f j f j f j f j f j f j f j f j f j',
          'ff jj ff jj fj jf ff jj fj jf ff jj fj jf fj jf ff',
          'fjf jfj ffj jjf fjj jff ffjj jjff fjfj jfjf fjf jfj',
          'ffjj jjff fjfj jfjf fffj jjjf ffjj jjff fjfjfj jfjfjf',
          'fj ff jj fj jf fjj jff ffj jjf fjfj fjfj fj jf jj ff',
          'fjfjfj jfjfjf fffj jjjf fjfj jfjf fjfjfj jfjfjf fjfj',
          'ffj jjf fjf jfj ffjj jjff fjfjf jfjfj fjfj jjf fjf jfj',
          'fjfjfjfj jfjfjfjf ffjjffjj jjffjjff fjfjfj jfjfjf fjfj',
        ],
      },
      {
        id: '1.2', title: 'd, k', newLetters: ['d','k'], allLetters: ['f','j','d','k'],
        customTexts: [
          'd k d k d k d k d k d k d k d k d k d k',
          'dd kk dd kk dk kd dd kk dk kd dd kk dk kd dk kd',
          'dkd kdk ddk kkd dkk kdd ddkk kkdd dkdk kdkd dkd',
          'fj dk fj dk fjdk dkfj jkdf fdkj fj dk fjdk dkfj',
          'fjdk dkfj jfkd kdjf fdjk jkfd fjdk dkfj fjdk kdjf',
          'ff jj dd kk fj dk fjdk jkfd dkfj fjdk fj dd kk jj',
          'fjd jkd fdk jfdk dkfj fjdk kjfd fjdkfj jkfd dkfj',
          'fjdkfjdk dkfjdkfj jkfdfjdk fjdkfjdk dkfjfjdk fjdk',
        ],
      },
      {
        id: '1.3', title: 's, l', newLetters: ['s','l'], allLetters: ['f','j','d','k','s','l'],
        customTexts: [
          's l s l s l s l s l s l s l s l s l s l',
          'ss ll ss ll sl ls ss ll sl ls ss ll sl ls sl ls',
          'sls lsl ssl lls slk lsf sljk lsk sll lsl sls lsl',
          'fj dk sl fj dk sl fjdksl sldkfj fjsl sldk fj sl',
          'sldkfj fjdksl fjsl sldk djls kslf slfjdk fjsl sldk',
          'fdjk sldk fjsl jdls kslf djls fjdksl sldk fjsl djls',
          'fdjk sldk fjsl lsdk dkls fjls sdkl jfls sldk fjsl',
          'fjdksl sldkfj fjsldk dkslfjfj slfjdksl fjdksl sldk',
        ],
      },
      {
        id: '1.4', title: 'a, ů', newLetters: ['a','ů'], allLetters: ['f','j','d','k','s','l','a','ů'],
        customTexts: [
          'a ů a ů a ů a ů a ů a ů a ů a ů a ů a ů',
          'aa ůů aa ůů aů ůa aa ůů aů ůa aa ůů aů ůa aa',
          'aůa ůaů aaj ůůs adůk kaůj jůas aůd ůjas aůk',
          'dal sal las kad lak kůl sůl kal jal sal lak dal',
          'sad jal kůl sůl slad kal klas sjal lak dal sad jal',
          'dal slak klas sklad jal sal kal kůl slad lak klas',
          'lak sad dal kůl sůl slad kal slak las klas jal lak',
          'slak sklad klas slad kal jal sjal sůl dalaj lak klas',
        ],
      },
      {
        id: '1.5', title: 'g, h', newLetters: ['g','h'], allLetters: homeRow,
        customTexts: [
          'g h g h g h g h g h g h g h g h g h g h',
          'gg hh gg hh gh hg gg hh gh hg gg hh gh hg gg hh',
          'ghg hgh ggh hhg ghh hgg ghgh hghg ghg hgh ghg hgh',
          'had hlas halas halda hlad hůl had hlas kůl kal slak',
          'hůl hlad halas skalka had hlas slak halda kůl had hlad',
          'had hlas slak halda kůl hlad halas klas hůl had slak',
          'halas halda hlad skalka hlas had slak kal hůl had klas',
          'hlas halda sklad hůl hlad klas halas slak had hůl hlad',
        ],
      },
      {
        id: '1.6', title: 'Závěrečná — střední řada', newLetters: [], allLetters: homeRow,
        numExercises: 10,
        customTexts: [
          'had hlas dal kůl hůl sal las kad hlad slak klas kal',
          'slak halas sklad halda hlad hůl hlas klas had kal slak',
          'had hlas dalaj hlad halda kůl skalka hasl klas had hůl',
          'hůl skalka slak halas klas hlad had hlas kal sůl slak',
          'sklad halda lak sad dal kůl hůl hlad klas had sal las',
          'halas halda hlad klas hlas slak had skalka kůl kal hlad',
          'dal kůl hůl sal las kad slak hlad klas halda had hlas',
          'skalka halda slak sal dalaj hlad had hlas kůl kal klas',
          'had hlas dal sal las kad hůl kůl hlad halas klas skalka',
          'sklad halas halda hlad hlas slak klas skalka had hůl kal',
        ],
      },
    ]),
  },
  {
    id: 2,
    title: 'Horní řada',
    lessons: makeLessons([
      { id: '2.1', title: 'r, u', newLetters: ['r','u'], allLetters: [...homeRow,'r','u'] },
      { id: '2.2', title: 't, z', newLetters: ['t','z'], allLetters: [...homeRow,'r','u','t','z'] },
      { id: '2.3', title: 'e, i', newLetters: ['e','i'], allLetters: [...homeRow,'r','u','t','z','e','i'] },
      { id: '2.4', title: 'w, o, p', newLetters: ['w','o','p'], allLetters: [...homeRow,'r','u','t','z','e','i','w','o','p'] },
      { id: '2.5', title: 'q, ú', newLetters: ['q','ú'], allLetters: topRow },
      {
        id: '2.6', title: 'Závěrečná — horní řada', newLetters: [], allLetters: topRow,
        numExercises: 10,
        customTexts: [
          'auto ruka tuk pilot hotel stůl plus krok spor les',
          'proud prst krok plus puls stůl kluk spor sloup dres',
          'datel pilot poker kotel kolej spor plus krok les tuk',
          'trosk úpal útok úsek spor sport plus les test dres',
          'spor sport trust trest pluk kluk sloup proud prst les',
          'sloup proud prst krok kros plus puls tuk les dres rok',
          'turist turista pilot polka plus spor kluk test dres',
          'soupis dosud utrpet splout klouzt plus les dres test',
          'splout klouzt prolog dialog dres les plus rok test spor',
          'stůl datel auto pilot hotel plus proud prst krok les',
        ],
      },
    ]),
  },
  {
    id: 3,
    title: 'Spodní řada',
    lessons: makeLessons([
      { id: '3.1', title: 'v, m', newLetters: ['v','m'], allLetters: [...topRow,'v','m'] },
      { id: '3.2', title: 'b, n', newLetters: ['b','n'], allLetters: [...topRow,'v','m','b','n'] },
      { id: '3.3', title: 'c, čárka', newLetters: ['c',','], allLetters: [...topRow,'v','m','b','n','c',','] },
      { id: '3.4', title: 'x, tečka', newLetters: ['x','.'], allLetters: [...topRow,'v','m','b','n','c',',','x','.'] },
      { id: '3.5', title: 'y, spojovník', newLetters: ['y','-'], allLetters: allRows },
      {
        id: '3.6', title: 'Závěrečná — všechny řady', newLetters: [], allLetters: allRows,
        numExercises: 12,
        customTexts: [
          'most mrak vlak vlna voda vůle nebe nebo noc bez',
          'nebe nebo noc bez brod cesta cena vlak most vlna',
          'bylo byt bez brod cesta barva banka nebe nebo noc',
          'cesta cena barva banka oblast pomoc volat nebe brod',
          'volat volby bavit barva banka nebe nebo noc oblast',
          'mluvit bavit banka barva datum důvod oblast pomoc',
          'barva bavit banka datum důvod oblast pomoc rodina',
          'datum důvod energie vlak vlna voda oblast pomoc noc',
          'jazyk oblast pohyb pomoc rodina nebe nebo noc cesta',
          'oblast pohyb pomoc reklama rodina cesta cena barva',
          'reklama rodina situace jazyk vlak pohyb pomoc oblast',
          'situace oblast cesta cena barva bavit banka rodina',
        ],
      },
    ]),
  },
  {
    id: 4,
    title: 'Věty s interpunkcí',
    lessons: makeLessons([
      {
        id: '4.1', title: 'Čárky, tečky, spojovník', newLetters: [], allLetters: allRows,
        numExercises: 8,
        customTexts: [
          'a, b, c. d, e, f. g, h, i. j, k, l.',
          'a-b, c-d. e-f, g-h. i-j, k-l. m-n, o-p.',
          't.k.l, s.d.m, p.n.b, v.c.j. r-t, k-l, s-d.',
          'k, l. m, n. o-p, r-s. a.b.c, d.e.f, g.h.',
          'pes bere kost, kocour bere maso. byly doma.',
          'auto-bus, den-noc, ano-ne, vlak-bus, pan-syn.',
          'moje auto jede, tvoje auto stalo u domu.',
          'vlak jede do brna, auto-bus jede do prahy.',
        ],
      },
    ]),
  },
  {
    id: 5,
    title: 'Diakritika',
    lessons: makeLessons([
      {
        id: '5.1', title: 'í, á', newLetters: ['í','á'], allLetters: [...allRows,'í','á'],
        customTexts: [
          undefined,
          'mí pí lí sí dí ví rí ní bí tí zí ký hí jí',
          'má pá lá sá dá vá rá ná bá tá zá ká há já',
          'lík sál dál mák pár pán rád sám bál víla pásl málo ráno láká',
        ],
      },
      {
        id: '5.2', title: 'é, ě', newLetters: ['é','ě'], allLetters: [...allRows,'í','á','é','ě'],
        customTexts: [
          undefined,
          'lé sé dé mé pé vé né té ré bé zé ké hé jé',
          'bě pě vě mě tě dě ně sě zě lě rě fě',
          'lépe děti pět věc měl těs běh není dvě svět věda tělo děl mé',
        ],
      },
      {
        id: '5.3', title: 'ý, š', newLetters: ['ý','š'], allLetters: [...allRows,'í','á','é','ě','ý','š'],
        customTexts: [
          undefined,
          'lý sý dý mý pý vý rý ný tý bý zý ký hý',
          'ša še ši šo šu aš eš iš oš uš šá šé',
          'být mýt sýr nový starý malý dobrý myš naše vaše šel šest koš',
        ],
      },
      {
        id: '5.4', title: 'č, ř', newLetters: ['č','ř'], allLetters: [...allRows,'í','á','é','ě','ý','š','č','ř'],
        customTexts: [
          undefined,
          'ča če či čo ču ač eč ič oč uč čá čí',
          'řa ře ři řo řu ař eř iř oř uř řá ří',
          'čas čaj čte číp peč meč keř moře pře tře dře přes řeka věc',
        ],
      },
      {
        id: '5.5', title: 'ž, ó', newLetters: ['ž','ó'], allLetters: [...allRows,'í','á','é','ě','ý','š','č','ř','ž','ó'],
        customTexts: [
          undefined,
          'ža že ži žo žu až ež iž ož už žá ží',
          'ló só dó mó pó vó tó kó bó nó ró hó',
          'žal žár žít muž nůž lože kůže móda tón gól óda róba bóje',
        ],
      },
      {
        id: '5.6', title: 'ď, ť, ň', newLetters: ['ď','ť','ň'], allLetters: withDiacritics,
        customTexts: [
          undefined,
          'ďa ďe ďi ďo ťa ťe ťi ťo aď eť iď oť',
          'ňa ňe ňi ňo ňu aň eň iň oň uň daň koň',
          'loď zeď leť seď laď daň kůň síň dlaň báseň píseň huť kať',
        ],
      },
      {
        id: '5.7', title: 'Závěrečná — diakritika', newLetters: [], allLetters: withDiacritics,
        numExercises: 10,
        customTexts: [
          'krásný příběh žije dál, čas letí přes celý svět',
          'velký výlet, šťastný žák, čeká přátelé, čte knížku',
          'životopis čeština příroda množství šance žena žít žák',
          'každý týden přijde, věří, že přinese hezký úsměv',
          'krásný čas přátelé příroda výlet sluníčko šance žít',
          'říjen školák žena řekl říká věří dělá přijde včas',
          'začátek přátelství, důvěra, zítra ráno, štěstí, láska',
          'krásný úsměv, milé počasí, dlouhý výlet, šance, žák',
          'rád říká, přijde včas přes přírodu kvůli práci',
          'každý týden dělá rozdíl přes čas, životopis, šance, žít',
        ],
      },
    ]),
  },
  {
    id: 6,
    title: 'Velká písmena',
    lessons: makeLessons([
      {
        id: '6.1', title: 'Pravý Shift', newLetters: ['A','S','D','F','G'], allLetters: [...withDiacritics,'A','S','D','F','G'],
        customTexts: [
          'A S D F G a s d f g Aa Ss Dd Ff Gg AS SD DF FG GA as sd df fg ga',
          'Aleš Slávek Dan Filip Gustav Anna Soňa Dita Flóra Greta Adam Simona Denisa Fanda',
          'Aloe Sova Dáma Fena Gorila Akát Slon Datel Fialka Golem Anděl Silnice Doupě Farma',
          'Ateliér Sklep Dílna Fabrika Garáž Altán Stodola Domek Fara Grunt Areál Stavba Dvorek',
          'Amerika Slovensko Dánsko Finsko Gruzie Asie Sýrie Dubaj Florida Gambie Austrálie Sparta',
          'Alena šla Standa spal Denisa dumala František foukal Gustav gestikuloval Adam dupal a Soňa',
          'Adam dnes fandí Filipovi Gustav sedí David gól dal Franta spal a Standa asistuje',
          'Skvělý Gustav dá Adamovi Filipa Standa fandí Davidovi Aleš gratuluje Fandovi a Denisa jásá',
        ],
      },
      {
        id: '6.2', title: 'Levý Shift', newLetters: ['H','J','K','L','Ů'], allLetters: [...withDiacritics,'A','S','D','F','G','H','J','K','L','Ů'],
        customTexts: [
          'H J K L Ů h j k l ů Hh Jj Kk Ll Ůů HJ JK KL LŮ KŮL DŮM VŮZ STŮL HŮL KŮŇ',
          'Hana Jakub Kamil Ludvík Helena Jitka Klára Lenka Jonáš Kryštof Libor Hedvika Karolína',
          'Hora Jáma Kůň Lev Hlava Jelen Koza Liška Hroch Jezevec Kobra Labuť Havran Ještěr',
          'Hospoda Jídelna Kavárna Lékárna Jeskyně Klášter Hotel Jachta Kůlna Loděnice Halda Jáchta',
          'Holandsko Japonsko Kanada Litva Jamajka Korea Honolulu Jáva Kréta Lisabon Kolín Louny',
          'Honza hraje Jakub jásá Kamil kráčí Ludvík loví Helena hledá Klára klečí a Libor listuje',
          'Jana a Karel jeli k lesu Honza hlídal koně Lukáš házel klacky Klára jásala a Ludvík lenošil',
          'Kůň táhl vůz do dvora Hana hnala kůzle Ludvík ladil hůl na louce a Jakub jen koukal',
        ],
      },
      {
        id: '6.3', title: 'Velká písmena s diakritikou', newLetters: ['Č','Š','Ř','Ž','Á','É','Í','Ó','Ú'], allLetters: withDiacritics,
        numExercises: 8,
        customTexts: [
          'Č Š Ř Ž Á É Í Ó Ú č š ř ž á é í ó ú Čč Šš Řř Žž Áá Éé Íí Óó Úú',
          'PRÁCE KRÁSA LÉTO MLÉKO PÍSEŇ SÍLA GÓL PÓL ÚKOL ÚSMĚV DÁMA VÍLA RÓBA SÓLO ÚNOR',
          'ČESKO ČOKOLÁDA ŠKOLA ŠTĚSTÍ ŘEKA ŘÍZEK ŽÁBA ŽRALOK ČTVRTEK ŠÁLA ŘEMESLO ŽIVOT ŽÁR',
          'Čína Šumava Říp Žatec Ústí Óda Írán Čáslav Šternberk Řevnice Žižkov Úpice Švédsko Řecko',
          'Čeněk Šárka Řehoř Žofie Čenda Štěpán Říha Žáneta Čermák Šimek Řezáč Žáček Čížek Štěpánka',
          'Čáp šplhá Šimon řeže Řehoř žasne Žofie čte Čeněk špásuje Štěpán řídí a Žaneta žehlí',
          'Šárka a Čeněk šli k řece Žofie řídila člun Řehoř česal švestky Štěpán žasl a Čenda čekal',
          'Česká Šumava je krásná Řeka Vltava šumí Žofín září a Ústí čeká na milou návštěvu',
        ],
      },
    ]),
  },
  {
    id: 7,
    title: 'Speciální znaky',
    lessons: makeLessons([
      {
        id: '7.1', title: 'Otazník', newLetters: ['?'], allLetters: [...withDiacritics,'?'],
        customTexts: [
          'co? jak? kde? kdo? kdy? proč?',
          'Jak se máš? Kde jsi? Co děláš?',
          'Jdeš dnes ven? Chceš kávu?',
          'Kdo to je? Jak to víš?',
          'Proč pláčeš? Co se stalo?',
          'Máš čas? Jdeš s námi?',
          'Kde bydlíš? Co studuješ?',
          'Jak se jmenuješ? Kolik je ti let?',
        ],
      },
      {
        id: '7.2', title: 'Vykřičník', newLetters: ['!'], allLetters: withSpecial,
        customTexts: [
          'Ahoj! Čau! Hej! Nazdar! Zdravím!',
          'Pozor! Stop! Pomoc! Stůj!',
          'Výborně! Skvěle! Bravo! Prima!',
          'Pojď sem! Dej mi to! Nech mě!',
          'Hurá! Jdeme! Vyhrál jsem!',
          'Kde jsi? Pojď! Čekám na tebe!',
          'Nevěřím! To je nemožné! Fakt?',
          'Ahoj světe! Jak se máš? Fajn!',
        ],
      },
    ]),
  },
  {
    id: 8,
    title: 'Čísla',
    lessons: makeLessons([
      {
        id: '8.1', title: 'Čísla 1–6', newLetters: ['1','2','3','4','5','6'], allLetters: [...withSpecial,'1','2','3','4','5','6'],
        customTexts: [
          '1 2 3 4 5 6 1 2 3 4 5 6',
          '11 22 33 44 55 66 12 21 34 43',
          '123 456 321 654 135 246',
          '12 34 56 16 25 34 52 61',
          '1. 2. 3. 4. 5. 6. řada',
          'Mám 3 koky a 5 psů.',
          'V roce 2024 je 366 dní.',
          '123456 654321 135246 246135',
        ],
      },
      {
        id: '8.2', title: 'Čísla 7–0', newLetters: ['7','8','9','0'], allLetters: withNumbers,
        customTexts: [
          '7 8 9 0 7 8 9 0 7 8 9 0',
          '77 88 99 00 78 87 90 09',
          '789 890 970 807 790',
          '70 80 90 100 200 300',
          '1234567890 9876543210',
          'Telefon: 777 888 999',
          'Rok 1989 byl důležitý.',
          '0123456789 9807654321',
        ],
      },
    ]),
  },
  {
    id: 9,
    title: 'Závěr kurzu',
    lessons: makeLessons([
      {
        id: '9.1', title: 'Jednou řečí', newLetters: [], allLetters: withNumbers,
        numExercises: 14,
        customTexts: [
          'Česká republika leží ve středu Evropy. Je to krásná země s bohatou historií.',
          'Praha je hlavní město České republiky. Každý rok ji navštíví miliony turistů.',
          'Šumava je největší národní park v Čechách. Rozkládá se na jihozápadě země.',
          'Čeština patří mezi slovanské jazyky. Učí se jí přibližně 10 milionů lidí.',
          'Václav Havel byl první prezident demokratické České republiky po roce 1989.',
          'Brno je druhé největší město v České republice. Leží na jihu Moravy.',
          'Vltava je nejdelší řeka v Čechách. Protéká přes Prahu a vlévá se do Labe.',
          'Karel IV. byl významný český král a římský císař. Vládl ve 14. století.',
          'Česká kuchyně je známá svíčkovou, knedlíky a svými pečenými pokrmy.',
          'Bedřich Smetana a Antonín Dvořák jsou nejslavnější čeští skladatelé.',
          'Příliš žluťoučký kůň úpěl ďábelské ódy. Tuhle větu zná v Čechách úplně každý.',
          'Nechť již hříšné saxofony ďáblů rozezvučí síň úděsnými tóny waltzu, tanga a quickstepu.',
          'Zvlášť zákeřný učeň s ďolíčky běží podél zóny úlů. Loď čeří kýlem tůň v Grónské úžině.',
          'Hleď, toť přízračný kůň v mlze! Šíleně žluťoučký kůň se napil žluté vody z tůně.',
        ],
      },
      {
        id: '9.2', title: 'Zpátky do školy', newLetters: [], allLetters: withNumbers,
        numExercises: 12,
        customTexts: [
          'Rychlé hnědé liška přeskočila přes líného psa. Pak utekla do lesa.',
          'V roce 2024 je svět propojen jako nikdy dříve. Internet změnil vše.',
          'Každý člověk má právo na vzdělání a svobodu. To jsou základní hodnoty.',
          'Technologie se vyvíjí neuvěřitelnou rychlostí. Co bylo nemožné, je dnes běžné.',
          'Příroda je největší poklad, který máme. Musíme ji chránit pro budoucí generace.',
          'Učení se nových věcí je vždy výzva. Ale odměna za snahu stojí za to.',
          'Psaní všemi deseti prsty šetří čas a snižuje únavu při práci u počítače.',
          'Česká literatura má bohatou tradici. Kafka, Hašek a Čapek jsou světoznámí.',
          'Sport je důležitý pro zdraví těla i mysli. Pravidelné cvičení prospívá každému.',
          'Hudba je řeč duše. Překonává hranice a spojuje lidi po celém světě.',
          'Dobrý den! Jak se dnes máte? Skvěle, díky za optání. A vy? Také dobře!',
          'Gratulujeme! Dokončili jste celý kurz psaní všemi deseti prsty. Výborně!',
        ],
      },
    ]),
  },
];

export function getAllLessons(): Lesson[] {
  return sections.flatMap(s => s.lessons);
}

export function getLessonById(id: string): Lesson | undefined {
  return getAllLessons().find(l => l.id === id);
}

export function getNextLessonId(currentId: string): string | null {
  const all = getAllLessons();
  const idx = all.findIndex(l => l.id === currentId);
  return idx >= 0 && idx < all.length - 1 ? all[idx + 1].id : null;
}
