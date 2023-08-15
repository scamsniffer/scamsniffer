// import remove from "confusables";
import {
  suggestionsForWords,
  suggestionsForWord,
  spellCheckDocument,
} from "cspell-lib";
import { characters } from "./characters";
/* eslint-disable max-len, no-misleading-character-class, no-control-regex */

/** @copyright Mathias Bynens <https://mathiasbynens.be/>. MIT license. */
export const regexSymbolWithCombiningMarks =
  /([\0-\u02FF\u0370-\u1AAF\u1B00-\u1DBF\u1E00-\u20CF\u2100-\uD7FF\uE000-\uFE1F\uFE30-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])([\u0300-\u036F\u1AB0-\u1AFF\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]+)/g;
/** @copyright Mathias Bynens <https://mathiasbynens.be/>. MIT license. */
export const regexLineBreakCombiningMarks =
  /[\0-\x08\x0E-\x1F\x7F-\x84\x86-\x9F\u0300-\u034E\u0350-\u035B\u0363-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u061C\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D4-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C00-\u0C03\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D01-\u0D03\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u180B-\u180D\u1885\u1886\u18A9\u1920-\u192B\u1930-\u193B\u1A17-\u1A1B\u1A7F\u1AB0-\u1ABE\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1CF8\u1CF9\u1DC0-\u1DF5\u1DFB-\u1DFF\u200C\u200E\u200F\u202A-\u202E\u2066-\u206F\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3035\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C5\uA8E0-\uA8F1\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFFF9-\uFFFB]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD804[\uDC00-\uDC02\uDC38-\uDC46\uDC7F-\uDC82\uDCB0-\uDCBA\uDD00-\uDD02\uDD27-\uDD34\uDD73\uDD80-\uDD82\uDDB3-\uDDC0\uDDCA-\uDDCC\uDE2C-\uDE37\uDE3E\uDEDF-\uDEEA\uDF00-\uDF03\uDF3C\uDF3E-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF57\uDF62\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC35-\uDC46\uDCB0-\uDCC3\uDDAF-\uDDB5\uDDB8-\uDDC0\uDDDC\uDDDD\uDE30-\uDE40\uDEAB-\uDEB7]|\uD807[\uDC2F-\uDC36\uDC38-\uDC3F\uDC92-\uDCA7\uDCA9-\uDCB6]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF51-\uDF7E\uDF8F-\uDF92]|\uD82F[\uDC9D\uDC9E\uDCA0-\uDCA3]|\uD834[\uDD65-\uDD69\uDD6D-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDCD0-\uDCD6\uDD44-\uDD4A]|\uDB40[\uDC01\uDC20-\uDC7F\uDD00-\uDDEF]/g;
/* eslint-enable max-len, no-misleading-character-class, no-control-regex */

/** Skippable characters that are not confusables */
export const checkLNPRegex =
  /^(?:[~`!@#%^&*(){}[\];:"'<,.>?/\\|_+=-]|[a-zA-Z0-9\s])+$/;

export function checkLNP(str: string) {
  return checkLNPRegex.test(str);
}

/**
 * Utility function to call 2 other functions which remove Combining Marks/Invisible characters
 * @param str The text to clean.
 */
export function clean(str: string) {
  return str
    .replace(regexLineBreakCombiningMarks, "")
    .replace(regexSymbolWithCombiningMarks, "$1")
    .replace(/[\u200B-\u200D\uFEFF\u2063]/g, "");
}

export function compareTwoStringsV1(first: string, second: string) {
  first = first.replace(/\s+/g, "");
  second = second.replace(/\s+/g, "");

  if (first === second) return 1; // identical or empty
  if (first.length < 2 || second.length < 2) return 0; // if either is a 0-letter or 1-letter string

  let firstBigrams = new Map();
  for (let i = 0; i < first.length - 1; i++) {
    const bigram = first.substring(i, i + 2);
    const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) + 1 : 1;

    firstBigrams.set(bigram, count);
  }

  let intersectionSize = 0;
  for (let i = 0; i < second.length - 1; i++) {
    const bigram = second.substring(i, i + 2);
    const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) : 0;

    if (count > 0) {
      firstBigrams.set(bigram, count - 1);
      intersectionSize++;
    }
  }

  return (2.0 * intersectionSize) / (first.length + second.length - 2);
}

export function compareTwoStrings(fst: string, snd: string) {
  var i, j, k, map, match, ref, ref1, sub;
  if (fst.length < 2 || snd.length < 2) {
    return 0;
  }
  map = new Map();
  for (
    i = j = 0, ref = fst.length - 2;
    0 <= ref ? j <= ref : j >= ref;
    i = 0 <= ref ? ++j : --j
  ) {
    sub = fst.substr(i, 2);
    if (map.has(sub)) {
      map.set(sub, map.get(sub) + 1);
    } else {
      map.set(sub, 1);
    }
  }
  match = 0;
  for (
    i = k = 0, ref1 = snd.length - 2;
    0 <= ref1 ? k <= ref1 : k >= ref1;
    i = 0 <= ref1 ? ++k : --k
  ) {
    sub = snd.substr(i, 2);
    if (map.get(sub) > 0) {
      match++;
      map.set(sub, map.get(sub) - 1);
    }
  }
  return (2.0 * match) / (fst.length + snd.length - 2);
};


/** The current cache of all the supported alphabet characters  */
export const alphabetMap = new Map<string, string[]>();

/** The current cache of all the supported confusable characters */
export const confusablesMap = new Map<string, string>();

for (const [base, alts] of characters.entries()) {
  alphabetMap.set(base, [...alts]);

  for (const char of alts) {
    confusablesMap.set(char, base);
  }
}

/**
 * Removes confusable unicode characters from a string.
 * @param str The text to remove confusables from.
 */
export function remove(str: string) {
  let founded = new Set();
  if (checkLNP(str)) return {
    replaced: founded.size,
    newContent: str,
  };;

  let newStr = "";
  for (const char of clean(str)) {
    let hitWord = confusablesMap.get(char);
    if (hitWord) {
      founded.add(hitWord);
      // console.log("char", {
      //   char,
      //   hitWord,
      // });
      // founded++;
    }
    newStr += hitWord || char;
  }

  return {
    replaced: founded.size,
    newContent: newStr,
  };
}

/**
 * Randomly mixes up a string with random confusable characters.
 * @param str The text to obfuscate.
 */
export function obfuscate(str: string) {
  let newStr = "";

  for (const char of str) {
    const charMap = alphabetMap.get(char);
    newStr += charMap
      ? charMap[Math.floor(Math.random() * charMap.length)]
      : char;
  }

  return newStr;
}

export async function fixWordsIfHasUnicode(
  content: string,
  callToActionsKeywords: string[]
) {
  const { newContent: fixedWords, replaced } = remove(content.toLowerCase());
  const confusable = fixedWords !== content && replaced > 5;
  let newText = content;
  if (confusable) {
    try {
      const totalWords = fixedWords.split("\n").map((_) => _.split(" "));
      // const { issues } = await spellCheckDocument(
      //   {
      //     uri: "",
      //     text: fixedWords.toLowerCase(),
      //   },
      //   {},
      //   {}
      // );
      // console.log(issues);
      const toFixWords = [];
      const allWords: string[] = [];
      for (let index = 0; index < totalWords.length; index++) {
        const linewords = totalWords[index];
        for (let c = 0; c < linewords.length; c++) {
          const totalWord = linewords[c].toLowerCase();
           const matchSimWord = callToActionsKeywords.find((cWord) => {
            //  const sim = compareTwoStrings(totalWord, cWord);
            //  console.log({
            //    sim,
            //    totalWord,
            //    cWord,
            //  });
             return (
               totalWord.length === cWord.length &&
               compareTwoStrings(totalWord, cWord)
             ) > 0.41;
           });

          // const hasIssue =
          //   issues.find((issue) => totalWord.includes(issue.text)) &&
          //   matchSimWord;
          if (matchSimWord) {
            // toFixWords.push(totalWord);
            allWords.push(matchSimWord);
          } else {
            allWords.push(totalWord.toLowerCase());
          }
        }
        allWords.push("\n");
      }
      newText = allWords.join(" ");
      // console.log(toFixWords);
      // const all = await suggestionsForWords(toFixWords, {
      //   numSuggestions: 1,
      // });
      // let index = 0;
      // for await (const res of all) {
      //   if (res.suggestions.length) {
      //     newText = newText.replace(
      //       `${index}_placeholder`,
      //       res.suggestions[0].word
      //     );
      //     index++;
      //   }
      // }
      // console.log(newText);
    } catch (error) {
      console.log("error");
    }
  }
  return {
    confusable,
    content: newText,
  };
}

async function test() {
  const words =
    `let's break it down ↓
how to throw an event in any ᴏɴᴄʏʙᴇʀ space`;
  //   const fixedWords = remove(words);
  //   const allWords = await Promise.all(
  //     fixedWords.split(" ").map(async (word) => {
  //       const suggest = await suggestionsForWord(word);
  //       if (suggest.suggestions.length) {
  //         return suggest.suggestions[0].word;
  //       } else {
  //         return word;
  //       }
  //     })
  //   );
  //   console.log(allWords.join(' '));
  const start = Date.now();
  console.log(
    await fixWordsIfHasUnicode(words, [
      "Airdrop",
      "Mint",
      "minting",
      "Supply",
      "GIVEAWAY",
      "claim",
    ]),
    Date.now() - start
  );
}

// test();
