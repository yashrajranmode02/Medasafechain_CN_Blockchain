import fs from 'fs';
try {
    const content = fs.readFileSync('server.js', 'utf8');
    console.log('---START---');
    console.log(content);
    console.log('---END---');
} catch (err) {
    console.error(err);
}
