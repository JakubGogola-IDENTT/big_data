import fs from 'fs';

const whitespacesRegEx = /[\s\d]+/g;
const charsRegEx = /[\[\]\.,:;<>()#'"-_`~$?!]/g

const stopwordsFile = fs.readFileSync('./stopwords_en.txt', { encoding: 'utf-8' });
const textFile = fs.readFileSync('./bc_en.txt', { encoding: 'utf-8' });

const text = textFile.split(/Chapter [A-Za-z\-]+:/);

const stopwords = stopwordsFile
        .replace(whitespacesRegEx, ' ')
        .split(' ');

const chapters = text.map(
    chapter => 
        chapter.toLowerCase()
            .replace(charsRegEx, '')
            .replace(whitespacesRegEx, ' ')
            .split(' ')
            .filter(word => !stopwords.includes(word))
);


let chaptersWordsCount = chapters.map(
    chapter =>
        chapter.reduce(
            (acc, word) => {
                if (acc[word]) {
                    acc[word]++;
                } else {
                    acc[word] = 1;
                }

                return acc;
            },
            {}
        )
);

const sortedChaptersWords = chaptersWordsCount.map(
    chapter =>
        Object.entries(chapter)
            .sort(([, count1], [, count2]) => count2 - count1)
);

const filesContent = sortedChaptersWords.map(
    chapter => 
        chapter.slice(0, 200)
        .reduce((acc, [word, count]) => acc.concat(`${count};${word};\n`), '')
);

filesContent.map(
    (file, idx) => 
        fs.writeFileSync(`./results/chapter${idx}.csv`, file)
);

const mostCommonWords = sortedChaptersWords
    .map(chapter => chapter.slice(0, 20))
    .map(
        (chapter, idx) => [
            idx,
            chapter.reduce(
                (acc, [word, count]) => ({ ...acc, [word]: count }),
                {}
            )
        ]
    );

const selectMostMatchingChapters = word =>
    mostCommonWords
        .sort(([, wc1], [, wc2]) =>
            (wc2[word] || 0)  - (wc1[word] || 0)
        )
        .map(([idx]) => idx)

console.log(selectMostMatchingChapters('castle'));


