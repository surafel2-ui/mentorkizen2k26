import fs from 'fs';

function run() {
  const content = fs.readFileSync('fetched_source.js', 'utf8');

  // Let's search for "g4" or general components.
  // We saw function definitions like:
  // "function c4"
  // "function f4"
  // "function d4"
  // "function h4"
  // "function g4"
  // Let's regex match and find the lines we want
  const comps = ['c4', 'f4', 'd4', 'h4', 'g4'];

  for (const comp of comps) {
    const pattern = `function ${comp}\\(`;
    const index = content.indexOf(pattern);
    if (index !== -1) {
      console.log(`\n\n==================== Found component: ${comp} ====================`);
      // print 10000 characters from the start of the function
      console.log(content.slice(index, index + 8000));
    }
  }
}

run();
