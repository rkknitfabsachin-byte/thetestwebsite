const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const templatePath = path.join(rootDir, 'DOT KNIT.html');
const productsPath = path.join(rootDir, 'products.html');
const dataPath = path.join(rootDir, 'data', 'fabrics.json');

// Read fabrics data
let fabrics = [];
try {
    const data = fs.readFileSync(dataPath, 'utf8');
    fabrics = JSON.parse(data);
} catch (error) {
    console.error("Error reading fabrics.json:", error.message);
    process.exit(1);
}

// Categories definitions based on existing architecture for filters
const categoryDefs = [
    { id: 'Sportswear', name: 'Sportswear', filterName: 'Sportswear' },
    { id: 'Uniform', name: 'Uniform Fabrics', filterName: 'Uniform' },
    { id: 'fleece', name: 'Winter Wear Fabrics', filterName: 'Winter Wear' },
    { id: 'Casual', name: 'Casual Wear Fabrics', filterName: 'Casual Wear' }
];

const templateContent = fs.readFileSync(templatePath, 'utf8');

let productsGridHTML = '';

fabrics.forEach(fabric => {
    // 1. Create Product Page for each fabric
    let pageContent = templateContent;

    const prodName = fabric.name;
    const catName = fabric.categoryName;
    const imgSrc = fabric.image || 'https://placehold.co/600x400?text=' + encodeURIComponent(prodName);

    // Replace Title
    // Using regex to handle slight variations but mostly targeting the main title
    // Since template relies on 'DOT KNIT' original strings, we assume template still has DOT KNIT or similar placeholder.
    // Actually template might have been overwritten if they ran this before. 
    // Wait, the previous script generates files but uses 'DOT KNIT.html' as template. If DOT KNIT was also generated from DOT KNIT.html...
    // The previous script used: 
    // pageContent = pageContent.replace(/<h2>DOT KNIT<\/h2>/g, `<h2>${prodName}</h2>`);
    // pageContent = pageContent.replace(/<title>Mars Knit<\/title>/g, `<title>${prodName} | RK Knit Fab</title>`);
    pageContent = pageContent.replace(/<h2>.*?<\/h2>/, `<h2>${prodName}</h2>`);
    pageContent = pageContent.replace(/<title>.*?<\/title>/, `<title>${prodName} | RK Knit Fab</title>`);

    // Replace Breadcrumb
    pageContent = pageContent.replace(/<div class="subtitle">.*?<\/div>/, `<div class="subtitle">${catName} · Factory Manufactured</div>`);

    // Replace Image (only if it's not the exact template product to avoid breaking the original completely, or just replace it always)
    const newSlides = `<img src="${imgSrc}" alt="${prodName}">`;
    pageContent = pageContent.replace(/<div class="slides" id="slides">[\s\S]*?<\/div>/, `<div class="slides" id="slides">\n${newSlides}\n</div>`);

    // Replace Specs Table
    const specs = fabric.specs || {};
    const newSpecsTable = `
        <table class="spec-table">
          <tr>
            <td>GSM</td>
            <td>${specs.gsm || 'N/A'}</td>
          </tr>
          <tr>
            <td>Width</td>
            <td>${specs.width || 'N/A'}</td>
          </tr>
          <tr>
            <td>Composition</td>
            <td>${specs.composition || 'N/A'}</td>
          </tr>
          <tr>
            <td>Finish</td>
            <td>${specs.finish || 'N/A'}</td>
          </tr>
          <tr>
            <td>MOQ</td>
            <td>${specs.moq || 'N/A'}</td>
          </tr>
        </table>
    `;
    pageContent = pageContent.replace(/<table class="spec-table">[\s\S]*?<\/table>/, newSpecsTable.trim());

    const fileName = `${prodName}.html`;
    fs.writeFileSync(path.join(rootDir, fileName), pageContent);
    console.log(`Created ${fileName}`);

    // 2. Add to Products Grid List
    productsGridHTML += `
      <a href="${fileName}" class="product-card" data-category="${fabric.categoryId}">
        <div class="card-image-wrapper">
          <span class="tag">${fabric.categoryName}</span>
          <img src="${imgSrc}" loading="lazy" alt="${prodName}"
          onerror="this.src='https://placehold.co/600x400?text=${encodeURIComponent(prodName)}'">
        </div>
        <div class="product-content">
          <h4>${prodName}</h4>
          <p>${fabric.description}</p>
          <span class="view-btn">View Details</span>
        </div>
      </a>\n`;
});

// 3. Update products.html
let productsContent = fs.readFileSync(productsPath, 'utf8');

// Update Filter Buttons
const newFilters = `
      <button class="filter-btn active" data-filter="all">All Fabrics</button>
      ${categoryDefs.map(c => `<button class="filter-btn" data-filter="${c.id}">${c.filterName}</button>`).join('\n      ')}
`;

productsContent = productsContent.replace(
    /<div class="filter-bar">[\s\S]*?<\/div>/,
    `<div class="filter-bar">\n${newFilters}\n    </div>`
);

// Update Grid
productsContent = productsContent.replace(
    /<div class="catalogue-grid">[\s\S]*?<\/div>/,
    `<div class="catalogue-grid">\n${productsGridHTML}\n    </div>`
);

fs.writeFileSync(productsPath, productsContent);
console.log('Updated products.html based on fabrics.json!');
