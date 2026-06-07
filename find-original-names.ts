import fs from 'fs';

async function run() {
  const filesToTry = [
    'package.json',
    'metadata.json',
    'server.ts',
    'src/App.tsx',
    'src/main.tsx',
    'src/index.css',
    'tsconfig.json',
    'vite.config.ts'
  ];

  const baseUrl = 'https://mentor-academy-senior-binder-592268554232.europe-west2.run.app';

  for (const file of filesToTry) {
    try {
      const url = `${baseUrl}/${file}`;
      console.log('Trying to fetch', url);
      const res = await fetch(url);
      if (res.ok) {
        const text = await res.text();
        console.log(`FOUND ${file}: ${text.length} chars`);
        fs.writeFileSync(`remote_${file.replace('/', '_')}`, text);
      } else {
        console.log(`Failed for ${file}: status ${res.status}`);
      }
    } catch (err) {
      console.log(`Error fetching ${file}:`, err);
    }
  }
}

run();
