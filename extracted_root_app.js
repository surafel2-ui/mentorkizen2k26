import fs from 'fs';

function run() {
  const content = fs.readFileSync('app_full_extracted_source.js', 'utf8');

  // Let's search and write portions of the code to separate files so we can read them easily.
  // We can write:
  // - page_decorations.js (first 10000 chars)
  // - photocard.js (search function u4)
  // - bindex_layout.js (search function c4)
  // - admin_panel.js (search function f4)
  // - guestbook.js (search function d4)
  // - lightbox.js (search function h4)
  // - root_app.js (search function g4)

  const segments: Record<string, string> = {
    decorations: content.slice(0, content.indexOf('function u4')),
    photocard: content.slice(content.indexOf('function u4'), content.indexOf('function c4')),
    binder_layout: content.slice(content.indexOf('function c4'), content.indexOf('function f4')),
    admin_panel: content.slice(content.indexOf('function f4'), content.indexOf('function d4')),
    guestbook: content.slice(content.indexOf('function d4'), content.indexOf('function h4')),
    lightbox: content.slice(content.indexOf('function h4'), content.indexOf('function g4')),
    root_app: content.slice(content.indexOf('function g4'))
  };

  for (const [name, text] of Object.entries(segments)) {
    fs.writeFileSync(`extracted_${name}.js`, text);
    console.log(`Saved extracted_${name}.js with ${text.length} chars`);
  }
}

run();
