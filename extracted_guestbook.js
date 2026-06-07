import fs from 'fs';

function run() {
  const content = fs.readFileSync('app_segment.js', 'utf8');
  console.log('app_segment.js length:', content.length);

  const parts = content.split('function ');
  console.log('Number of parts:', parts.length);

  parts.forEach((part, idx) => {
    console.log(`\n--- PART ${idx} (length ${part.length}) ---`);
    console.log(part.slice(0, 150) + '...');
  });
}

run();
