import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist');
const output=path.resolve(process.argv[2] || path.join(root,'../Invitation-Music-Preview.html'));
const mime={'.woff2':'font/woff2','.woff':'font/woff','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.wav':'audio/wav'};
const uri=p=>'data:'+(mime[path.extname(p)]||'application/octet-stream')+';base64,'+fs.readFileSync(p).toString('base64');
const embed=text=>text.replace(/\/(assets|audio)\/([A-Za-z0-9_.-]+)/g,(_,dir,name)=>uri(path.join(dist,dir,name)));
let html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
html=html.replace(/<script[^>]+src="([^"]+)"[^>]*><\/script>/g,(_,src)=>'<script type="module">'+embed(fs.readFileSync(path.join(dist,src.replace(/^\//,'')),'utf8')).replaceAll('</script','<\\/script')+'</script>');
html=html.replace(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/g,(_,src)=>'<style>'+embed(fs.readFileSync(path.join(dist,src.replace(/^\//,'')),'utf8'))+'</style>');
html=html.replace('href="/favicon.svg"','href="'+uri(path.join(dist,'favicon.svg'))+'"');
if(/<script[^>]+src=|\/(assets|audio)\//.test(html))throw new Error('Offline export retains an external resource');
if(!html.includes('data:audio/wav;base64,'))throw new Error('Offline music missing');
fs.writeFileSync(output,html);
console.log(`Offline invitation with embedded music: ${output} (${Buffer.byteLength(html)} bytes)`);
