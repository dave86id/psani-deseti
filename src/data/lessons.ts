import type { Lesson, Section } from '../types';
import { generateExerciseText } from '../utils/exerciseGenerator';

function makeLessons(
  lessonDefs: Array<{
    id: string;
    title: string;
    newLetters: string[];
    allLetters: string[];
    numExercises?: number;
    customTexts?: string[];
  }>
): Lesson[] {
  return lessonDefs.map(def => {
    const n = def.numExercises ?? 8;
    const exercises = Array.from({ length: n }, (_, i) => ({
      id: i + 1,
      text: def.customTexts?.[i] ?? generateExerciseText(def.newLetters, def.allLetters, i + 1, n),
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
const withDiacritics = [...allRows, 'ř','ě','š','č','á','í','ž','ó','ď','ť','ň'];
const withSpecial = [...withDiacritics, '?', '!'];
const withNumbers = [...withSpecial, '1','2','3','4','5','6','7','8','9','0'];

export const sections: Section[] = [
  {
    id: 1,
    title: 'Střední řada',
    lessons: makeLessons([
      {
        id: '1.1', title: 'F a J', newLetters: ['f','j'], allLetters: ['f','j'],
        customTexts: [
          'f j f j f j f j f j f j f j f j f j f j',
          'ff jj ff jj fj jf ff jj fj jf ff jj',
          'fjf jfj ffj jjf fjj jff ffjj jjff fjfj jfjf',
          'ffjj jjff fjfj jfjf fffj jjjf ffjj jjff',
          'fj ff jj fj jf fjj jff ffj jjf fjfj',
          'fjfjfj jfjfjf fffj jjjf fjfj jfjf',
          'ffj jjf fjf jfj ffjj jjff fjfjf jfjfj',
          'fjfjfjfj jfjfjfjf ffjjffjj jjffjjff',
        ],
      },
      {
        id: '1.2', title: 'D a K', newLetters: ['d','k'], allLetters: ['f','j','d','k'],
        customTexts: [
          'd k d k d k d k d k d k d k d k',
          'dd kk dd kk dk kd dd kk dk kd',
          'dkd kdk ddk kkd dkk kdd ddkk kkdd',
          'fj dk fj dk fjdk dkfj jkdf fdkj',
          'fjdk dkfj jfkd kdjf fdjk jkfd',
          'ff jj dd kk fj dk fjdk jkfd dkfj',
          'fjd jkd fdk jfdk dkfj fjdk kjfd',
          'fjdkfjdk dkfjdkfj jkfdfjdk',
        ],
      },
      {
        id: '1.3', title: 'S a L', newLetters: ['s','l'], allLetters: ['f','j','d','k','s','l'],
        customTexts: [
          's l s l s l s l s l s l s l s l',
          'ss ll ss ll sl ls ss ll sl ls',
          'sls lsl ssl lls slk lsf sljk',
          'fj dk sl fj dk sl fjdksl sldkfj',
          'sldkfj fjdksl fjsl sldk djls kslf',
          'sad lak dal fls slak jdls',
          'fdjk sldk fjsl lsdk dkls fjls',
          'fjdksl sldkfj fjsldk dkslfjfj',
        ],
      },
      {
        id: '1.4', title: 'A a Ů', newLetters: ['a','ů'], allLetters: ['f','j','d','k','s','l','a','ů'],
        customTexts: [
          'a ů a ů a ů a ů a ů a ů a ů a ů',
          'aa ůů aa ůů aů ůa aa ůů',
          'aůa ůaů aaj ůůs adůk',
          'had sal dal lak kůl sůl',
          'sad jal flaš kůl hůl',
          'dal slak halas sklad',
          'lak sad dal kůl hůl slad',
          'halda sklad lasák dalaj',
        ],
      },
      {
        id: '1.5', title: 'G a H', newLetters: ['g','h'], allLetters: homeRow,
        customTexts: [
          'g h g h g h g h g h g h g h g h',
          'gg hh gg hh gh hg gg hh',
          'ghg hgh ggh hhg ghh hgg',
          'had hlas halas halda',
          'hůl sálka dalaj sladký',
          'had hlas slak halda kůl',
          'halas gadžo halda sladký',
          'hlas dalaj sklad halda hůl',
        ],
      },
      {
        id: '1.6', title: 'Závěrečná — střední řada', newLetters: [], allLetters: homeRow,
        numExercises: 10,
        customTexts: [
          'had hlas dal kůl hůl sal las kad',
          'slak halas sklad halda gadžo',
          'had hlas dalaj sladký halda kůl',
          'hůl sálka slak halas gadžo',
          'sklad halda lak sad dal kůl hůl',
          'halas gadžo halda sladký hlas',
          'dal kůl hůl sal las kad slak',
          'sládek halda skála sal dalaj',
          'had hlas dal sal las kad hůl kůl',
          'skladu halas gadžo sladký halda slak',
        ],
      },
    ]),
  },
  {
    id: 2,
    title: 'Horní řada',
    lessons: makeLessons([
      { id: '2.1', title: 'R a U', newLetters: ['r','u'], allLetters: [...homeRow,'r','u'] },
      { id: '2.2', title: 'T a Z', newLetters: ['t','z'], allLetters: [...homeRow,'r','u','t','z'] },
      { id: '2.3', title: 'E a I', newLetters: ['e','i'], allLetters: [...homeRow,'r','u','t','z','e','i'] },
      { id: '2.4', title: 'W, O, P', newLetters: ['w','o','p'], allLetters: [...homeRow,'r','u','t','z','e','i','w','o','p'] },
      { id: '2.5', title: 'Q a Ú', newLetters: ['q','ú'], allLetters: topRow },
      {
        id: '2.6', title: 'Závěrečná — horní řada', newLetters: [], allLetters: topRow,
        numExercises: 10,
        customTexts: [
          'auto ruka tuk tulák pilot hotel',
          'proud prst krok plus puls stůl',
          'datel pilot poker kotel kolej',
          'trosk úpal útok úsek kouř pouť',
          'spor sport trust trest pluk kluk',
          'sloup proud prst krok kros plus',
          'turist turista pilot polka',
          'soupis dosud utrpet utéct',
          'splout klouzt prolog dialog',
          'stůl tulák datel auto pilot hotel',
        ],
      },
    ]),
  },
  {
    id: 3,
    title: 'Spodní řada',
    lessons: makeLessons([
      { id: '3.1', title: 'V a M', newLetters: ['v','m'], allLetters: [...topRow,'v','m'] },
      { id: '3.2', title: 'B a N', newLetters: ['b','n'], allLetters: [...topRow,'v','m','b','n'] },
      { id: '3.3', title: 'C a čárka', newLetters: ['c',','], allLetters: [...topRow,'v','m','b','n','c',','] },
      { id: '3.4', title: 'X a tečka', newLetters: ['x','.'], allLetters: [...topRow,'v','m','b','n','c',',','x','.'] },
      { id: '3.5', title: 'Y a spojovník', newLetters: ['y','-'], allLetters: allRows },
      {
        id: '3.6', title: 'Závěrečná — všechny řady', newLetters: [], allLetters: allRows,
        numExercises: 12,
        customTexts: [
          'most mrak vlak vlna voda vůle',
          'nebe nebo noc národ není',
          'bylo byt být bez brod',
          'cesta celý cíl cizí cena',
          'volný volat volby verš věta',
          'měl město míst mluvit',
          'barva bavit banka cítit',
          'datum dávat důvod energie',
          'hlavní hrát jazyk jediný',
          'nabídka název návrh oblast',
          'papír patnáct peníze pohyb pomoc',
          'reklama rodina setkání situace',
        ],
      },
    ]),
  },
  {
    id: 4,
    title: 'Diakritika',
    lessons: makeLessons([
      { id: '4.1', title: 'Ř, Ě, Š', newLetters: ['ř','ě','š'], allLetters: [...allRows,'ř','ě','š'] },
      { id: '4.2', title: 'Č a Á', newLetters: ['č','á'], allLetters: [...allRows,'ř','ě','š','č','á'] },
      { id: '4.3', title: 'Í', newLetters: ['í'], allLetters: [...allRows,'ř','ě','š','č','á','í'] },
      { id: '4.4', title: 'Ž a Ó', newLetters: ['ž','ó'], allLetters: [...allRows,'ř','ě','š','č','á','í','ž','ó'] },
      { id: '4.5', title: 'Ú', newLetters: ['ú'], allLetters: [...allRows,'ř','ě','š','č','á','í','ž','ó','ú'] },
      { id: '4.6', title: 'Ď, Ť, Ň', newLetters: ['ď','ť','ň'], allLetters: withDiacritics },
      {
        id: '4.7', title: 'Závěrečná — diakritika', newLetters: [], allLetters: withDiacritics,
        numExercises: 10,
        customTexts: [
          'příběh střední říjen školák',
          'většina částečně příležitost',
          'životopis průzkumník společnost',
          'příroda čeština řízení množství',
          'člověk část čas článek',
          'šance šaty šest špatný štěstí',
          'začátek zahrada zákon zámek',
          'žena život žít žák říct říkat',
          'radost řada dělat děti dnes',
          'přát přece přes příčina',
        ],
      },
    ]),
  },
  {
    id: 5,
    title: 'Velká písmena',
    lessons: makeLessons([
      {
        id: '5.1', title: 'Pravý Shift', newLetters: ['A','S','D','F','G'], allLetters: [...withDiacritics,'A','S','D','F','G'],
        customTexts: [
          'A S D F G a s d f g A S D F G',
          'As Sa Dál Fuj Glad',
          'Adolf Sara David Franta Gábina',
          'Ahoj Svět Dnes Fakt Gratulace',
          'Auto Stůl Datel Fotbal Golf',
          'Adamec Svátek Dvořák Fišer Gott',
          'Ahoj Světe jak se máš dnes',
          'Dobrý den Adam Standa David',
        ],
      },
      {
        id: '5.2', title: 'Levý Shift', newLetters: ['H','J','K','L','Ů'], allLetters: [...withDiacritics,'A','S','D','F','G','H','J','K','L','Ů'],
        customTexts: [
          'H J K L Ů h j k l ů',
          'Ho Jak Kal Lak Ůhor',
          'Honza Jana Karel Lukáš',
          'Hello Johan Kurt Lars',
          'Hrad Jelen Kůl Louka Úhor',
          'Honza jde Karel leze',
          'Jana a Karel jsou kamarádi',
          'Honza Karel Jana Lukáš Laura',
        ],
      },
      {
        id: '5.3', title: 'Velká písmena s diakritikou', newLetters: ['Č','Š','Ř','Ž','Á','É','Í','Ó','Ú'], allLetters: withDiacritics,
        numExercises: 8,
        customTexts: [
          'Česká republika Šumava Říčany',
          'Žižkov Ústí Olomouc',
          'Čechy Šváb Řehoř Žák',
          'Praha Brno Ostrava Plzeň',
          'Čech Štefan Říha Žáček',
          'Příbram Šumperk Řevnice',
          'Česká republika je krásná země',
          'Šumava Říčany Žižkov Ústí',
        ],
      },
    ]),
  },
  {
    id: 6,
    title: 'Speciální znaky',
    lessons: makeLessons([
      {
        id: '6.1', title: 'Otazník', newLetters: ['?'], allLetters: [...withDiacritics,'?'],
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
        id: '6.2', title: 'Vykřičník', newLetters: ['!'], allLetters: withSpecial,
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
    id: 7,
    title: 'Čísla',
    lessons: makeLessons([
      {
        id: '7.1', title: 'Čísla 1–6', newLetters: ['1','2','3','4','5','6'], allLetters: [...withSpecial,'1','2','3','4','5','6'],
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
        id: '7.2', title: 'Čísla 7–0', newLetters: ['7','8','9','0'], allLetters: withNumbers,
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
    id: 8,
    title: 'Závěr kurzu',
    lessons: makeLessons([
      {
        id: '8.1', title: 'Jednou řečí', newLetters: [], allLetters: withNumbers,
        numExercises: 10,
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
        ],
      },
      {
        id: '8.2', title: 'Zpátky do školy', newLetters: [], allLetters: withNumbers,
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
