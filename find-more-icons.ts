import fs from 'fs';

function run() {
  const content = fs.readFileSync('fetched_source.js', 'utf8');
  // Get segment from -75000 to -47000 to cover card component
  const cardSegment = content.slice(-75000, -47000);
  fs.writeFileSync('card_segment.js', cardSegment);
  console.log('Saved card segment (30,000 chars) to card_segment.js');

  const parts = cardSegment.split('function ');
  console.log('Number of parts in card segment:', parts.length);
  parts.forEach((part, idx) => {
    console.log(`Part ${idx}: ${part.slice(0, 150)}...`);
  });
}

run();
