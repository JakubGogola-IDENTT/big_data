import fs from 'fs';
import hll from 'hll';

const data = fs.readFileSync('./data/lbl-pkt-4/lbl-pkt-4.tcp')
    .toString()
    .split('\n');

const srcHll = hll();
const destHll = hll();
const pairHll = hll();
const pairRevHll = hll();

data.forEach(line => {
    const [_, src, dest] = line.split(' ');

    if (!src || !dest) {
        return;
    }

    const srcValue = parseInt(src);
    const destValue = parseInt(dest);

    const pair = srcValue < destValue ? `${src}_${dest}` : `${dest}_${src}`;
    const pairRev = `${src}_${dest}`;

    srcHll.insert(src);
    destHll.insert(dest);
    pairHll.insert(pair);
    pairRevHll.insert(pairRev);
});

console.log(`Src: ${srcHll.estimate()}`);
console.log(`Dest: ${destHll.estimate()}`);
console.log(`Pair: ${pairHll.estimate()}`);
console.log(`Pair rev: ${pairRevHll.estimate()}`);
