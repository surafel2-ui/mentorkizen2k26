import fs from 'fs';

function run() {
  const content = fs.readFileSync('fetched_source.js', 'utf8');
  
  // Let's print any line where `PT`, `dc`, `pf`, `jo` is defined as a component or imported.
  // We can search for the definitions:
  const searchTerms = ['PT', 'dc', 'pf', 'jo', 'Tt', 'Hy'];
  for (const term of searchTerms) {
    console.log(`\n=== Deep search for ${term} ===`);
    let pos = 0;
    while (true) {
      const idx = content.indexOf(term, pos);
      if (idx === -1) break;
      // print the preceding 50 characters and following 100 characters
      const start = Math.max(0, idx - 40);
      const end = Math.min(content.length, idx + 100);
      const snippet = content.slice(start, end).replace(/\n/g, ' ');
      console.log(`[At ${idx}]: ${snippet}`);
      pos = idx + term.length;
      if (pos >= content.length) break;
    }
  }
}

run();
