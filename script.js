// Dados dos bookmarks organizados por categoria
const bookmarksData = {
    materias: [
        { title: 'A List Apart - Web Design Articles', url: 'https://alistapart.com' },
        { title: 'Don\'t Trust the Design Process', url: 'https://jennywen.ca/notes/dont-trust-the-design-process' },
        { title: 'Designers, Designers, Designers', url: 'https://carly.substack.com/p/designers-designers-designers' },
        { title: 'A Screenless Future', url: 'https://collabfund.com/blog/a-screenless-future/' },
        { title: 'NoSpec - Stop Working for Free', url: 'https://www.nospec.com/' },
        { title: 'How to Measure the ROI of AI Coding Assistants', url: 'https://thenewstack.io/how-to-measure-the-roi-of-ai-coding-assistants/' },
        { title: 'Designing AI Agents That Work at Work', url: 'https://www.designexecutivecouncil.com/insights/designing-ai-agents-that-work-at-work' },
        { title: 'Small Bets', url: 'https://mikefisher.substack.com/p/small-bets' },
        { title: 'Dan Hollick - Typefully', url: 'https://typefully.com/DanHollick' }
    ],
    designers: [
        { title: 'App Inspo', url: 'https://appinspo.com' },
        { title: 'Cosmos', url: 'https://cosmos.so/home' },
        { title: 'Best Designs on X', url: 'https://bestdesignsonx.com' },
        { title: 'Browsing Mode', url: 'https://browsingmode.com' },
        { title: 'Maxi Best Of', url: 'https://maxibestof.one' },
        { title: 'Startups Gallery', url: 'https://startups.gallery' },
        { title: 'A Fresh Website', url: 'https://a-fresh.website' },
        { title: 'Site Inspire', url: 'https://siteinspire.com' },
        { title: 'Spotlight', url: 'https://spotlight.partdirector.ch/' },
        { title: 'The Brand Identity', url: 'https://the-brandidentity.com' },
        { title: 'Spotted in Prod', url: 'https://spottedinprod.com' },
        { title: 'Land Book', url: 'https://land-book.com' },
        { title: 'Defining Design', url: 'https://defining.design/' }
    ],
    type: [
        { title: 'Google Fonts', url: 'https://fonts.google.com' },
        { title: 'Adobe Fonts', url: 'https://fonts.adobe.com' },
        { title: 'Font Squirrel', url: 'https://www.fontsquirrel.com' },
        { title: 'Typewolf', url: 'https://www.typewolf.com' },
        { title: 'Fonts In Use', url: 'https://fontsinuse.com' },
        { title: 'Type Scale', url: 'https://typescale.com' },
        { title: 'Fontjoy', url: 'https://fontjoy.com' },
        { title: 'Font Pair', url: 'https://fontpair.co' },
        { title: 'René Bieder', url: 'https://www.renebieder.com/' },
        { title: 'Polytype', url: 'https://polytype.co.uk/' },
        { title: 'Uncut', url: 'https://uncut.wtf/' },
        { title: 'Maxitype', url: 'https://maxitype.com/' },
        { title: 'Fabio Haag Type', url: 'https://fabiohaagtype.com/quem-somos/' },
        { title: 'TypeType Brazil', url: 'https://typetype.org/fonts/brazil/' }
    ],
    studios: [
        { title: 'Pentagram', url: 'https://www.pentagram.com' },
        { title: 'IDEO', url: 'https://www.ideo.com' },
        { title: 'Sagmeister & Walsh', url: 'https://sagmeisterwalsh.com' },
        { title: 'Base Design', url: 'https://basedesign.com' },
        { title: 'Studio Dumbar', url: 'https://studiodumbar.com' },
        { title: 'Mucho', url: 'https://mucho.ws' },
        { title: 'Hey Studio', url: 'https://heystudio.es' },
        { title: 'Spin', url: 'https://spin.studio' }
    ],
    aidesign: [
        { title: '21st Century Design', url: 'https://21st.dev/' },
        { title: 'Runway ML', url: 'https://runwayml.com' },
        { title: 'Midjourney Showcase', url: 'https://www.midjourney.com/showcase' },
        { title: 'Adobe Firefly', url: 'https://firefly.adobe.com' },
        { title: 'Figma AI', url: 'https://www.figma.com/ai' },
        { title: 'Framer AI', url: 'https://www.framer.com/ai' },
        { title: 'Uizard', url: 'https://uizard.io' },
        { title: 'Galileo AI', url: 'https://www.usegalileo.ai' },
        { title: 'Patterncraft', url: 'https://patterncraft.fun/' }
    ]
};

// Função para criar o HTML de uma categoria
function createCategoryHTML(categoryName, categoryData) {
    const categoryLabels = {
        materias: 'Articles',
        designers: 'Reference',
        type: 'Type',
        studios: 'Studios',
        aidesign: 'AI Design'
    };

    const bookmarksList = categoryData.map(bookmark => 
        `<li><a href="${bookmark.url}" target="_blank" rel="noopener noreferrer">${bookmark.title}</a></li>`
    ).join('');

    return `
        <div class="category-section">
            <div class="category-header" onclick="toggleCategory('${categoryName}')">
                <h2>${categoryLabels[categoryName]}</h2>
                <span class="toggle-icon">−</span>
            </div>
            <div class="category-content" id="${categoryName}-content">
                <ul class="bookmarks-list">
                    ${bookmarksList}
                </ul>
            </div>
        </div>
    `;
}

// Função para alternar visibilidade da categoria
function toggleCategory(categoryName) {
    const content = document.getElementById(`${categoryName}-content`);
    const header = content.previousElementSibling;
    const icon = header.querySelector('.toggle-icon');
    
    content.classList.toggle('collapsed');
    
    if (content.classList.contains('collapsed')) {
        icon.textContent = '+';
    } else {
        icon.textContent = '−';
    }
}

// Inicializar a página
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('bookmarksContainer');
    
    // Gerar HTML para todas as categorias
    const categoriesHTML = Object.entries(bookmarksData)
        .map(([categoryName, categoryData]) => createCategoryHTML(categoryName, categoryData))
        .join('');
    
    container.innerHTML = categoriesHTML;
});
