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
const withDiacritics = [...allRows, 'ř','ě','š','č','á','í','ž','ó','ď','ť','ň'];
const withSpecial = [...withDiacritics, '?', '!'];
const withNumbers = [...withSpecial, '1','2','3','4','5','6','7','8','9','0'];

export const sections: Section[] = [
  {
    id: 1,
    title: 'Střední řada',
    lessons: makeLessons([
      {
        id: '1.1', title: 'f a j', newLetters: ['f','j'], allLetters: ['f','j'],
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
        id: '1.2', title: 'd a k', newLetters: ['d','k'], allLetters: ['f','j','d','k'],
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
        id: '1.3', title: 's a l', newLetters: ['s','l'], allLetters: ['f','j','d','k','s','l'],
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
        id: '1.4', title: 'a a ů', newLetters: ['a','ů'], allLetters: ['f','j','d','k','s','l','a','ů'],
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
        id: '1.5', title: 'g a h', newLetters: ['g','h'], allLetters: homeRow,
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
      { id: '2.1', title: 'r a u', newLetters: ['r','u'], allLetters: [...homeRow,'r','u'] },
      { id: '2.2', title: 't a z', newLetters: ['t','z'], allLetters: [...homeRow,'r','u','t','z'] },
      { id: '2.3', title: 'e a i', newLetters: ['e','i'], allLetters: [...homeRow,'r','u','t','z','e','i'] },
      { id: '2.4', title: 'w, o, p', newLetters: ['w','o','p'], allLetters: [...homeRow,'r','u','t','z','e','i','w','o','p'] },
      { id: '2.5', title: 'q a ú', newLetters: ['q','ú'], allLetters: topRow },
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
      { id: '3.1', title: 'v a m', newLetters: ['v','m'], allLetters: [...topRow,'v','m'] },
      { id: '3.2', title: 'b a n', newLetters: ['b','n'], allLetters: [...topRow,'v','m','b','n'] },
      { id: '3.3', title: 'c a čárka', newLetters: ['c',','], allLetters: [...topRow,'v','m','b','n','c',','] },
      { id: '3.4', title: 'x a tečka', newLetters: ['x','.'], allLetters: [...topRow,'v','m','b','n','c',',','x','.'] },
      { id: '3.5', title: 'y a spojovník', newLetters: ['y','-'], allLetters: allRows },
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
    title: 'Diakritika',
    lessons: makeLessons([
      { id: '4.1', title: 'ř, ě, š', newLetters: ['ř','ě','š'], allLetters: [...allRows,'ř','ě','š'] },
      { id: '4.2', title: 'č a á', newLetters: ['č','á'], allLetters: [...allRows,'ř','ě','š','č','á'] },
      { id: '4.3', title: 'í', newLetters: ['í'], allLetters: [...allRows,'ř','ě','š','č','á','í'] },
      { id: '4.4', title: 'ž a ó', newLetters: ['ž','ó'], allLetters: [...allRows,'ř','ě','š','č','á','í','ž','ó'] },
      { id: '4.5', title: 'ú', newLetters: ['ú'], allLetters: [...allRows,'ř','ě','š','č','á','í','ž','ó','ú'] },
      { id: '4.6', title: 'ď, ť, ň', newLetters: ['ď','ť','ň'], allLetters: withDiacritics },
      {
        id: '4.7', title: 'Závěrečná — diakritika', newLetters: [], allLetters: withDiacritics,
        numExercises: 10,
        customTexts: [
          'příběh střední říjen školák příroda část žák dnes',
          'většina částečně příležitost přát přes příčina žák',
          'životopis průzkumník společnost začátek zákon příroda',
          'příroda čeština řízení množství šance žena život žák',
          'člověk část čas článek šaty šest špatný říct žít',
          'šance šaty šest špatný štěstí říct žít žák začátek',
          'začátek zahrada zákon zámek příroda říjen školák část',
          'žena život žít žák říct říkat dělat děti dnes přes',
          'radost řada dělat děti dnes přát přece přes příčina',
          'přát přece přes příčina začátek zákon žena život část',
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
