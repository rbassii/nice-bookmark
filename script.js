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
        { title: 'Land Book', url: 'https://land-book.com' }
    ]
};

// Função para criar o HTML de uma categoria
function createCategoryHTML(categoryName, categoryData) {
    const categoryLabels = {
        materias: 'Matérias',
        designers: 'Designers'
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
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        icon.textContent = '−';
    } else {
        content.style.display = 'none';
        icon.textContent = '+';
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
