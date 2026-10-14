const fs = require('fs');
const zlib = require('zlib');
const crypto = require('crypto');
const readline = require('readline');

const INPUT = process.argv[2] || 'D:\\Projects\\gpu-solver\\brain_cuda\\blockchair_btc_addresses.tsv.gz';
const BLOOM_OUT = 'D:\\Projects\\bloom_filter.bin';
const HASH160_OUT = 'D:\\Projects\\funded_hash160.bin';

const N = 22_000_000;
const FPR = 0.001;
const M_BITS = Math.ceil(-N * Math.log(FPR) / (Math.log(2) ** 2));
const K = Math.round((M_BITS / N) * Math.log(2));
const M_BYTES = Math.ceil(M_BITS / 8);

console.log(`Bloom filter: ${N} entries, ${FPR} FPR`);
console.log(`  ${M_BYTES} bytes (${(M_BYTES / 1024 / 1024).toFixed(1)} MB), ${K} hash functions`);

const bloom = Buffer.alloc(M_BYTES);
const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function base58Decode(addr) {
  let num = 0n;
  for (const c of addr) num = num * 58n + BigInt(BASE58.indexOf(c));
  let hex = num.toString(16);
  if (hex.length % 2) hex = '0' + hex;
  const bytes = [];
  for (let i = 0; i < hex.length; i += 2) bytes.push(parseInt(hex.slice(i, i + 2), 16));
  let leadingZeros = 0;
  for (const c of addr) { if (c === '1') leadingZeros++; else break; }
  const full = Buffer.alloc(leadingZeros + bytes.length);
  Buffer.from(bytes).copy(full, leadingZeros);
  return full.slice(1, 21);
}

function bloomAdd(hash160) {
  const h1 = crypto.createHash('sha256').update(hash160).digest();
  const h2 = crypto.createHash('sha256').update(Buffer.concat([hash160, Buffer.from([1])])).digest();
  for (let i = 0; i < K; i++) {
    const pos = Number((h1.readBigUInt64LE(0) + BigInt(i) * h2.readBigUInt64LE(0)) % BigInt(M_BITS));
    bloom[pos >> 3] |= (1 << (pos & 7));
  }
}

async function main() {
  const gunzip = zlib.createGunzip();
  const stream = fs.createReadStream(INPUT).pipe(gunzip);
  const rl = readline.createInterface({ input: stream });

  // Stream hash160s directly to disk — no accumulation in memory
  const h160Stream = fs.createWriteStream(HASH160_OUT);
  let count = 0;
  let p2pkh = 0;

  for await (const line of rl) {
    if (count === 0) { count++; continue; }
    const tab = line.indexOf('\t');
    const addr = tab > 0 ? line.slice(0, tab) : line;
    count++;

    if (!addr.startsWith('1')) continue;

    try {
      const h160 = base58Decode(addr);
      if (h160.length !== 20) continue;
      bloomAdd(h160);
      h160Stream.write(h160);
      p2pkh++;
    } catch {}

    if (p2pkh % 1_000_000 === 0) {
      process.stdout.write(`\r  ${p2pkh.toLocaleString()} P2PKH addresses processed...`);
      if (global.gc) global.gc();
    }
  }

  await new Promise(r => h160Stream.end(r));

  console.log(`\n  Total: ${count.toLocaleString()} lines, ${p2pkh.toLocaleString()} P2PKH addresses`);

  const header = Buffer.alloc(16);
  header.writeUInt32LE(M_BITS, 0);
  header.writeUInt32LE(K, 4);
  header.writeUInt32LE(p2pkh, 8);
  header.writeUInt32LE(0, 12);
  fs.writeFileSync(BLOOM_OUT, Buffer.concat([header, bloom]));
  console.log(`  Bloom filter: ${BLOOM_OUT} (${(fs.statSync(BLOOM_OUT).size / 1024 / 1024).toFixed(1)} MB)`);
  console.log(`  Hash160 set: ${HASH160_OUT} (${(fs.statSync(HASH160_OUT).size / 1024 / 1024).toFixed(1)} MB)`);
}

main().catch(e => { console.error(e); process.exit(1); });
