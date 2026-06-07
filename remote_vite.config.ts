import fs from 'fs';

function run() {
  const content = fs.readFileSync('fetched_source.js', 'utf8');

  // Let's extract the part from $p containing helper components up to the end of g4
  const startKeyword = 'function $p(';
  const startIndex = content.indexOf(startKeyword);
  if (startIndex === -1) {
    console.log('Could not find start keyword!');
    return;
  }

  const appSource = content.slice(startIndex);
  fs.writeFileSync('app_full_extracted_source.js', appSource);
  console.log(`Saved full compiled app components starting from ${startKeyword} (length ${appSource.length})`);
}

run();
