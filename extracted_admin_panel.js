import fs from 'fs';

function run() {
  const content = fs.readFileSync('fetched_source.js', 'utf8');
  console.log('Total length:', content.length);

  // Let's find some string literals or typical React patterns in this bundle
  // A simple way is to use regex or find interesting keywords
  const keywords = [
    'mentor',
    'academy',
    'senior',
    'binder',
    'student',
    'course',
    'lesson',
    'chapter',
    'class',
    'grade',
    'subject',
    'schedule',
    'overview',
    'dashboard',
    'calendar',
    'task',
    'project',
    'assignment',
    'quiz',
    'exam'
  ];

  console.log('\n--- Keyword Occurrences ---');
  for (const keyword of keywords) {
    const regex = new RegExp(keyword, 'gi');
    const matches = content.match(regex);
    console.log(`${keyword}: ${matches ? matches.length : 0} times`);
  }

  // Let's print some long string literal matches to find headers, labels, descriptions
  const stringRegex = /"([^"\\]|\\.){15,120}"/g;
  const strings: string[] = [];
  let match;
  while ((match = stringRegex.exec(content)) !== null) {
    strings.push(match[0]);
  }

  console.log(`\nFound ${strings.length} long strings. Samples:`);
  const uniqueStrings = Array.from(new Set(strings)).filter(s => {
    // filter out typical standard library/react terms or symbols
    return !s.includes('\\u') && !s.includes('http://') && !s.includes('https://') && !s.includes('px ') && !s.includes('%;') && !s.includes('aria-');
  });

  console.log(`Unique human-like strings: ${uniqueStrings.length}`);
  // Let's save them to a file
  fs.writeFileSync('extracted_strings.txt', uniqueStrings.slice(0, 300).join('\n'));
  console.log('Saved 300 unique strings to extracted_strings.txt');
}

run();
