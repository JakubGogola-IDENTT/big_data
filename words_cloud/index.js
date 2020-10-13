import fs from 'fs';

const whitespacesRegEx = /[\s\d]+/g;
const charsRegEx = /[\[\]\.,:;<>()#'"-_`~$?!]/g

const stopwordsFile = fs.readFileSync('./stopwords_en.txt', { encoding: 'utf-8' });
const textFile = fs.readFileSync('./bc_en.txt', { encoding: 'utf-8' });

const stopwords = stopwordsFile
        .replace(whitespacesRegEx, ' ')
        .split(' ');

const text = textFile
        .toLowerCase()
        .replace(charsRegEx, '')
        .replace(whitespacesRegEx, ' ')
        .split(' ')
        .filter(word => !stopwords.includes(word));

const wordsCount = text.reduce((acc, word) => {
    if (acc[word]) {
        acc[word]++;
    } else {
        acc[word] = 1;
    }

    return acc;
}, {});

const sortedWords = Object.entries(wordsCount)
        .sort(([, count1], [, count2]) => count2 - count1);

const fileContent = sortedWords
        .slice(0, 200)
        .reduce((acc, [word, count]) => acc.concat(`${count};${word};\n`), '');

fs.writeFileSync('result.csv', fileContent);
