import remove from "confusables";
import { suggestionsForWord } from "cspell-lib";

(async () => {
  const words = "ｃⅼαᵢᛖ ｙоｕｒ gₒbbₗᵢₙₛ ｎОｗ :";
  const fixedWords = remove(words);
  const allWords = await Promise.all(
    fixedWords.split(" ").map(async (word) => {
      const suggest = await suggestionsForWord(word);
      if (suggest.suggestions.length) {
        return suggest.suggestions[0].word;
      } else {
        return word;
      }
    })
  );
  console.log(allWords.join(' '));
})();
