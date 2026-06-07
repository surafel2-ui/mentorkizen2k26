import fs from 'fs';
import path from 'path';

const filesToFetch = [
  'package.json',
  'tsconfig.json',
  'vite.config.ts',
  'index.html',
  'tailwind.config.js',
  'server.ts',
  'src/types.ts',
  'src/main.tsx',
  'src/index.css',
  'src/App.tsx',
  'src/components/CrestLogo.tsx',
  'src/components/CornerOrnament.tsx',
  'src/components/StepsIllustration.tsx',
  'src/components/PhotoCard.tsx',
  'src/components/LightboxModal.tsx',
  'src/components/GuestbookLedger.tsx',
  'src/components/AdminPanel.tsx'
];

async function tryFetch(branch: string, filePath: string) {
  const url = `https://raw.githubusercontent.com/surafel2-ui/kizenmentor2k26/${branch}/${filePath}`;
  const response = await fetch(url);
  if (response.ok) {
    return await response.text();
  }
  return null;
}

async function run() {
  console.log('Initiating retrieval from surafel2-ui/kizenmentor2k26...');
  
  for (const file of filesToFetch) {
    try {
      // Try main first, then master
      let content = await tryFetch('main', file);
      if (content === null) {
        content = await tryFetch('master', file);
      }

      if (content !== null) {
        console.log(`FOUND ${file} on GitHub!`);
        const localPath = path.join(process.cwd(), file);
        const dir = path.dirname(localPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(localPath, content);
      } else {
        console.log(`Could not find ${file} on main/master branch.`);
      }
    } catch (err) {
      console.error(`Error checking ${file}:`, err);
    }
  }
}

run();
