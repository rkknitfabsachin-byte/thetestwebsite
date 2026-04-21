const fs = require('fs');
const path = require('path');
const dir = __dirname;

const emailPrimary = 'rkknitfabldh@gmail.com';
const phoneNumbers = ['9914166611', '9056027427', '7087079969', '7087011671'];

fs.readdir(dir, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
        if (path.extname(file) === '.html' && !file.includes('admin')) {
            const filePath = path.join(dir, file);
            let content = fs.readFileSync(filePath, 'utf8');
            let changed = false;

            // 1. CLEANUP: Remove ANY dangling </div> after <body> left by previous script
            if (content.match(/<body>\s*<\/div>/i)) {
                content = content.replace(/<body>\s*<\/div>/i, '<body>');
                changed = true;
            }
            // Double check for any other announcement-banner leftovers
            if (content.includes('announcement-banner')) {
                const bannerRegex = /<div class="announcement-banner">[\s\S]*?<\/div>\s*<\/div>/i;
                const bannerRegex2 = /<div class="announcement-banner">[\s\S]*?<\/div>/i;
                content = content.replace(bannerRegex, '').replace(bannerRegex2, '');
                changed = true;
            }

            // 2. Remove Nav Email Link if it still exists
            if (content.includes('nav-email-link')) {
                const navEmailRegex = /<li class="nav-email-link">[\s\S]*?<\/li>/gi;
                content = content.replace(navEmailRegex, '');
                changed = true;
            }

            // 3. Update Footer Email
            const emailRegex = /<span>sales@rkknitfab\.com<\/span>|<span>rkknitfabb@gmail.com<\/span>/gi;
            if (emailRegex.test(content)) {
                content = content.replace(emailRegex, `<span>${emailPrimary}</span>`);
                changed = true;
            }

            // 4. Update Footer Phone Numbers (all 4)
            // Look for the phone icon svg and its following span
            const phoneIconPattern = /<svg[^>]*>\s*<path[^>]*d="M3 5a2 2 0 012-2h3.28[^"]*"[^>]*>\s*<\/svg>\s*<span>(.*?)<\/span>/i;
            const newPhoneSpan = `<span>+91 ${phoneNumbers[0]}<br>+91 ${phoneNumbers[1]}<br>+91 ${phoneNumbers[2]}<br>+91 ${phoneNumbers[3]}</span>`;
            
            if (phoneIconPattern.test(content)) {
                content = content.replace(phoneIconPattern, (match) => {
                    return match.replace(/<span>(.*?)<\/span>/i, newPhoneSpan);
                });
                changed = true;
            }

            // 5. Special Case: contact.html Info Boxes
            if (file === 'contact.html') {
               const phoneBoxRegex = /<h4>📞 Phone<\/h4>\s*<p>([\s\S]*?)<\/p>/i;
               const newPhoneBoxHtml = `<h4>📞 Phone</h4>
          <p>
            +91 ${phoneNumbers[0]}<br>
            +91 ${phoneNumbers[1]}<br>
            +91 ${phoneNumbers[2]}<br>
            +91 ${phoneNumbers[3]}
          </p>`;
               content = content.replace(phoneBoxRegex, newPhoneBoxHtml);
               changed = true;
            }

            if (changed) {
                fs.writeFileSync(filePath, content);
                console.log(`Updated ${file}`);
            }
        }
    });
});
