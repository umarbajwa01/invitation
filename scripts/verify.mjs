import ts from 'typescript';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const output = path.resolve('.checks');
fs.mkdirSync(output,{recursive:true});
fs.writeFileSync(path.join(output,'package.json'),'{"type":"commonjs"}');
const program = ts.createProgram(['src/config.ts','src/components/Scenes.tsx'],{
  target:ts.ScriptTarget.ES2022, module:ts.ModuleKind.CommonJS,
  moduleResolution:ts.ModuleResolutionKind.Node10, jsx:ts.JsxEmit.ReactJSX,
  esModuleInterop:true, resolveJsonModule:true, skipLibCheck:true, strict:true,
  rootDir:path.resolve('src'), outDir:output
});
const result=program.emit();
const diagnostics=[...ts.getPreEmitDiagnostics(program),...result.diagnostics];
if(diagnostics.length) throw new Error(ts.formatDiagnosticsWithColorAndContext(diagnostics,{
  getCurrentDirectory:()=>process.cwd(),getCanonicalFileName:f=>f,getNewLine:()=> '\n'
}));
const require = createRequire(path.join(output,'config.js'));
const {invitationConfig,defaultInvitation,defaultThankYou,messageParagraphs,eventDisplay}=require('./config.js');
const views=require('./components/Scenes.js');
let passed=0;
function check(name,fn){fn();passed++;console.log(`PASS ${name}`);}
check('Blank and whitespace message overrides preserve approved wording',()=>{
  assert.equal(messageParagraphs('',defaultInvitation).length,3);
  assert.equal(messageParagraphs('   ',defaultThankYou).length,2);
  assert.deepEqual(messageParagraphs('Custom first paragraph.\n\nCustom second paragraph.',defaultInvitation),['Custom first paragraph.','Custom second paragraph.']);
});
check('No invented event date or time',()=>{
  const d=eventDisplay({...invitationConfig.event,date:'',time:'',timeLabel:''});assert.equal(d.day,'[DAY]');assert.equal(d.time,'[EVENT TIME]');
});
check('Calendar dates do not shift at extreme timezone offsets',()=>{
  for(const timezone of ['Pacific/Kiritimati','America/Los_Angeles','Asia/Karachi']) {
    const d=eventDisplay({...invitationConfig.event,date:'2028-02-29',time:'18:30',timezone});
    assert.equal(d.day,'29');assert.equal(d.weekday,'Tuesday');assert.equal(d.time,'6:30 PM');
  }
});
check('Invalid dates, times and timezone have readable fallbacks',()=>{
  const d=eventDisplay({...invitationConfig.event,date:'2027-02-29',time:'25:40',timeLabel:'',timezone:'Invalid/Zone'});
  assert.equal(d.day,'[DAY]');assert.equal(d.time,'[EVENT TIME]');assert.equal(d.zone,'Time zone to be confirmed');
});
check('Actual Saturday event details show confirmed 5:00 PM',()=>{
  const d=eventDisplay();assert.equal(d.day,'24');assert.equal(d.month,'October');assert.equal(d.year,'2026');assert.equal(d.weekday,'Saturday');assert.equal(d.time,'5:00 PM');assert.equal(invitationConfig.event.location,'At home');
});
const noop=()=>{};
const elements=[React.createElement(views.InvitationMessage,{goTo:noop}),React.createElement(views.CoupleNames),React.createElement(views.EngagementDate),React.createElement(views.ThankYouScene,{goTo:noop})];
const rendered=elements.map(el=>renderToStaticMarkup(el));
check('Exactly four scenes, required order, correct first and final headings',()=>{
  assert.deepEqual(views.scenes.map(s=>s.id),['invitation','couple','date','thanks']);
  assert.equal(rendered.join('').match(/<section /g).length,4);
  assert.ok(rendered[0].includes('Cordially Invited'));
  assert.ok(rendered[3].includes('for Coming'));
  assert.ok(!rendered.join('').includes('id="venue"'));
  assert.ok(rendered[2].includes('At home'));
});
check('No unsupported RSVP, forms, maps, audio or countdown elements',()=>{
  const html=rendered.join('');
  assert.ok(!/<form|<audio|<input|Get Directions|RSVP|Will You Join Us|countdown/i.test(html));
});
check('Names are consistently escaped as text in names and closing scenes',()=>{
  const old=invitationConfig.person1.name;
  invitationConfig.person1.name='<script>unsafe</script>';
  try {
    const names=renderToStaticMarkup(React.createElement(views.CoupleNames));
    const thanks=renderToStaticMarkup(React.createElement(views.ThankYouScene,{goTo:noop}));
    assert.ok(names.includes('&lt;script&gt;'));assert.ok(thanks.includes('&lt;script&gt;'));
  } finally {invitationConfig.person1.name=old;}
});
check('CSS has no photograph or wallpaper background declarations',()=>{
  const css=fs.readFileSync('src/styles.css','utf8');
  assert.ok(!/background(?:-image)?\s*:[^;]*url\(/.test(css));
  assert.ok(css.includes('prefers-reduced-motion'));
});
check('Readable text colors exceed 4.5:1 on both paper surfaces',()=>{
  const lum=hex=>{const c=hex.match(/\w\w/g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2];};
  for(const fg of ['422b25','63463b','72503f','6c2433'])for(const bg of ['f3ded3','f6e4da']){const ratio=(lum(bg)+.05)/(lum(fg)+.05);assert.ok(ratio>=4.5,`${fg} on ${bg}: ${ratio}`);}
});
console.log(`${passed} checks passed. Browser layout and interactions are not covered by these checks.`);
