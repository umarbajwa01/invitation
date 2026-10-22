import fs from 'node:fs';
import { loadEnv } from 'vite';
const config = JSON.parse(fs.readFileSync('src/invitation.config.json', 'utf8'));
const env = loadEnv('production', process.cwd(), 'VITE_');
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const names = `${config.person1.name} & ${config.person2.name}`;
const title = names.includes('[') ? 'A Beautiful Beginning | Engagement Invitation' : `${names} | Engagement Invitation`;
const origin = (process.env.VITE_SITE_URL || env.VITE_SITE_URL || config.sharing.siteUrl || '').replace(/\/$/,'');
const description = config.sharing.description;
let html = fs.readFileSync('dist/index.html','utf8')
  .replace(/<title>.*?<\/title>/, `<title>${escape(title)}</title>`)
  .replace(/(<meta property="og:title" content=")[^"]*/, `$1${escape(title)}`)
  .replace(/(<meta (?:name="description"|property="og:description") content=")[^"]*/g, `$1${escape(description)}`)
  .replace(/(<meta property="og:url" content=")[^"]*/, `$1${escape(origin)}`);
if (origin) {
  html = html.replace('</head>', `  <link rel="canonical" href="${escape(origin)}/" />\n</head>`);
  if(fs.existsSync('dist/social-preview.png')) html=html.replace('</head>',`  <meta property="og:image" content="${escape(origin)}/social-preview.png" />\n  <meta property="og:image:alt" content="Burgundy floral engagement invitation on blush paper" />\n</head>`);
}
fs.writeFileSync('dist/index.html',html);
const monogram = escape(`${config.person1.initial}·${config.person2.initial}`);
fs.writeFileSync('dist/favicon.svg',`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="32" fill="#6c2433"/><ellipse cx="32" cy="32" rx="25" ry="28" fill="none" stroke="#c5a184"/><text x="32" y="40" font-family="Georgia,serif" font-size="23" text-anchor="middle" fill="#fff6ed">${monogram}</text></svg>`);
console.log('Metadata and monogram favicon built from the invitation configuration.');
