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

const tfidfs = chaptersWordsCount.map(
    chapter => {
        const wordsCount = Object.values(chapter)
            .reduce((acc, count) => acc + count, 0);

        const numberOfChapters = chapters.length;

        return Object.entries(chapter)
            .reduce(
                (acc, [word, count]) => {
                    const tf = count / wordsCount;

                    const wordOccurences = 
                        chaptersWordsCount.reduce(
                            (acc, chapter) => acc + (chapter[word] || 0),
                            0
                        );

                    const idf = Math.log(numberOfChapters / wordOccurences) / Math.log(2);

                    return { ...acc, [word]: tf * idf }
                },
                {}
            );
    }
);

const sortedChapterTfidfs = tfidfs.map(
    chapter =>
        Object.entries(chapter)
            .sort(([, tfidf1], [, tfidf2]) => tfidf2 - tfidf1)
);

const [,, word] = process.argv;

if (word) {
    const mostCommonWords = sortedChapterTfidfs
        .map(chapter => chapter.slice(0, 20))
        .map(
            (chapter, idx) => [
                idx,
                chapter.reduce(
                    (acc, [word, tfidf]) => ({ ...acc, [word]: tfidf }),
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

    console.log(selectMostMatchingChapters(word));

    process.exit(1);
}

const prepareFileContent = data => 
    data.slice(0, 200)
        .reduce(
            (acc, [word, tfidf]) => {
                const value = parseInt(tfidf * 10000)

                return acc.concat(`${value > 0 ? value : 0};${word}\n`)
            },
            ''
        );

const filesContent = sortedChapterTfidfs.map(prepareFileContent);

const mergedTfidfs = 
    tfidfs.reduce(
        (acc, chapter) => {
            Object.entries(chapter)
                .forEach(([word, tfidf]) => {
                    if (acc[word]) {
                        acc[word] += tfidf
                    } else {
                        acc[word] = tfidf
                    }
                });
            return acc;
        },
        {}
    );

const sortedMergedTfidfs = 
    Object.entries(mergedTfidfs)
        .sort(([, tfidf1], [, tfidf2]) => tfidf2 - tfidf1);

const mergedFileContent = prepareFileContent(sortedMergedTfidfs);


filesContent.map(
    (file, idx) => 
        fs.writeFileSync(`./results/chapter${idx}.csv`, file)
);
fs.writeFileSync('./results/merged.csv', mergedFileContent);

