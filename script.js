class BookmarkManager {
    constructor() {
        this.bookmarks = this.loadBookmarks();
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderBookmarks();
        this.updateFilterButtons();
    }

    bindEvents() {
        // Modal controls
        document.getElementById('addBookmarkBtn').addEventListener('click', () => this.openModal());
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('modalOverlay').addEventListener('click', () => this.closeModal());

        // Form submission
        document.getElementById('bookmarkForm').addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Search
        document.getElementById('searchInput').addEventListener('input', (e) => this.handleSearch(e));

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                document.getElementById('searchInput').focus();
            }
        });
    }

    loadBookmarks() {
        const stored = localStorage.getItem('bookmarks');
        if (stored) {
            return JSON.parse(stored);
        }
        
        // Dados de exemplo
        return [
            {
                id: 1,
                title: 'Dribbble - Design Inspiration',
                url: 'https://dribbble.com',
                description: 'Plataforma com os melhores designs e inspirações visuais do mundo.',
                category: 'designers',
                tags: ['design', 'inspiração', 'ui/ux'],
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                title: 'Awwwards - Website Awards',
                url: 'https://awwwards.com',
                description: 'Reconhece e promove o talento e esforço dos melhores desenvolvedores, designers e agências web do mundo.',
                category: 'portfolios',
                tags: ['web design', 'awards', 'portfolios'],
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                title: 'Pentagram Design',
                url: 'https://pentagram.com',
                description: 'Um dos estúdios de design mais respeitados do mundo, conhecido por identidades visuais icônicas.',
                category: 'studios',
                tags: ['branding', 'identidade visual', 'design gráfico'],
                createdAt: new Date().toISOString()
            },
            {
                id: 4,
                title: 'A List Apart - Web Design Articles',
                url: 'https://alistapart.com',
                description: 'Artigos aprofundados sobre design web, desenvolvimento e estratégia digital.',
                category: 'materias',
                tags: ['artigos', 'web design', 'desenvolvimento'],
                createdAt: new Date().toISOString()
            }
        ];
    }

    saveBookmarks() {
        localStorage.setItem('bookmarks', JSON.stringify(this.bookmarks));
    }

    openModal() {
        document.getElementById('addModal').classList.add('active');
        document.getElementById('modalOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
        document.getElementById('title').focus();
    }

    closeModal() {
        document.getElementById('addModal').classList.remove('active');
        document.getElementById('modalOverlay').classList.remove('active');
        document.body.style.overflow = '';
        document.getElementById('bookmarkForm').reset();
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const bookmark = {
            id: Date.now(),
            title: formData.get('title') || document.getElementById('title').value,
            url: formData.get('url') || document.getElementById('url').value,
            description: formData.get('description') || document.getElementById('description').value,
            category: formData.get('category') || document.getElementById('category').value,
            tags: (formData.get('tags') || document.getElementById('tags').value)
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0),
            createdAt: new Date().toISOString()
        };

        this.bookmarks.unshift(bookmark);
        this.saveBookmarks();
        this.renderBookmarks();
        this.closeModal();
        
        // Show success feedback
        this.showNotification('Bookmark adicionado com sucesso!', 'success');
    }

    handleSearch(e) {
        this.searchTerm = e.target.value.toLowerCase();
        this.renderBookmarks();
    }

    handleFilter(e) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.category;
        this.renderBookmarks();
    }

    getFilteredBookmarks() {
        let filtered = this.bookmarks;

        // Apply category filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(bookmark => bookmark.category === this.currentFilter);
        }

        // Apply search filter
        if (this.searchTerm) {
            filtered = filtered.filter(bookmark => 
                bookmark.title.toLowerCase().includes(this.searchTerm) ||
                bookmark.description.toLowerCase().includes(this.searchTerm) ||
                bookmark.tags.some(tag => tag.toLowerCase().includes(this.searchTerm)) ||
                bookmark.url.toLowerCase().includes(this.searchTerm)
            );
        }

        return filtered;
    }

    renderBookmarks() {
        const container = document.getElementById('bookmarksGrid');
        const filteredBookmarks = this.getFilteredBookmarks();

        if (filteredBookmarks.length === 0) {
            container.innerHTML = this.getEmptyStateHTML();
            return;
        }

        container.innerHTML = filteredBookmarks.map(bookmark => this.getBookmarkHTML(bookmark)).join('');
        
        // Bind delete and edit events
        this.bindBookmarkEvents();
    }

    getBookmarkHTML(bookmark) {
        const categoryLabels = {
            materias: 'Matérias',
            designers: 'Designers',
            studios: 'Studios',
            portfolios: 'Portfolios'
        };

        const categoryIcons = {
            materias: 'fas fa-newspaper',
            designers: 'fas fa-palette',
            studios: 'fas fa-building',
            portfolios: 'fas fa-briefcase'
        };

        return `
            <div class="bookmark-card category-${bookmark.category}" data-id="${bookmark.id}">
                <div class="bookmark-header">
                    <div>
                        <h3 class="bookmark-title">${this.escapeHtml(bookmark.title)}</h3>
                        <a href="${bookmark.url}" target="_blank" rel="noopener noreferrer" class="bookmark-url">
                            ${this.truncateUrl(bookmark.url)}
                        </a>
                    </div>
                    <div class="bookmark-actions">
                        <button class="action-btn edit-btn" onclick="bookmarkManager.editBookmark(${bookmark.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="bookmarkManager.deleteBookmark(${bookmark.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                ${bookmark.description ? `<p class="bookmark-description">${this.escapeHtml(bookmark.description)}</p>` : ''}
                
                <div class="bookmark-category">
                    <i class="${categoryIcons[bookmark.category]}"></i>
                    ${categoryLabels[bookmark.category]}
                </div>
                
                ${bookmark.tags.length > 0 ? `
                    <div class="bookmark-tags">
                        ${bookmark.tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    getEmptyStateHTML() {
        const messages = {
            all: {
                icon: 'fas fa-bookmark',
                title: 'Nenhum bookmark encontrado',
                message: 'Comece adicionando seus primeiros bookmarks!'
            },
            materias: {
                icon: 'fas fa-newspaper',
                title: 'Nenhuma matéria encontrada',
                message: 'Adicione artigos e matérias interessantes.'
            },
            designers: {
                icon: 'fas fa-palette',
                title: 'Nenhum designer encontrado',
                message: 'Adicione perfis de designers que você admira.'
            },
            studios: {
                icon: 'fas fa-building',
                title: 'Nenhum studio encontrado',
                message: 'Adicione studios de design inspiradores.'
            },
            portfolios: {
                icon: 'fas fa-briefcase',
                title: 'Nenhum portfolio encontrado',
                message: 'Adicione portfolios que servem de referência.'
            }
        };

        const state = messages[this.currentFilter] || messages.all;
        
        return `
            <div class="empty-state">
                <i class="${state.icon}"></i>
                <h3>${state.title}</h3>
                <p>${state.message}</p>
            </div>
        `;
    }

    bindBookmarkEvents() {
        // Events are bound via onclick in HTML for simplicity
    }

    deleteBookmark(id) {
        if (confirm('Tem certeza que deseja excluir este bookmark?')) {
            this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
            this.saveBookmarks();
            this.renderBookmarks();
            this.showNotification('Bookmark excluído com sucesso!', 'success');
        }
    }

    editBookmark(id) {
        const bookmark = this.bookmarks.find(b => b.id === id);
        if (!bookmark) return;

        // Fill form with bookmark data
        document.getElementById('title').value = bookmark.title;
        document.getElementById('url').value = bookmark.url;
        document.getElementById('description').value = bookmark.description || '';
        document.getElementById('category').value = bookmark.category;
        document.getElementById('tags').value = bookmark.tags.join(', ');

        // Change form behavior for editing
        const form = document.getElementById('bookmarkForm');
        form.dataset.editId = id;
        
        // Update form submission handler
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        
        newForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateBookmark(id, newForm);
        });

        this.openModal();
    }

    updateBookmark(id, form) {
        const formData = new FormData(form);
        const bookmarkIndex = this.bookmarks.findIndex(b => b.id === id);
        
        if (bookmarkIndex === -1) return;

        this.bookmarks[bookmarkIndex] = {
            ...this.bookmarks[bookmarkIndex],
            title: formData.get('title') || document.getElementById('title').value,
            url: formData.get('url') || document.getElementById('url').value,
            description: formData.get('description') || document.getElementById('description').value,
            category: formData.get('category') || document.getElementById('category').value,
            tags: (formData.get('tags') || document.getElementById('tags').value)
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0),
            updatedAt: new Date().toISOString()
        };

        this.saveBookmarks();
        this.renderBookmarks();
        this.closeModal();
        this.showNotification('Bookmark atualizado com sucesso!', 'success');
        
        // Reset form
        delete form.dataset.editId;
        this.bindEvents(); // Rebind original events
    }

    updateFilterButtons() {
        const counts = this.bookmarks.reduce((acc, bookmark) => {
            acc[bookmark.category] = (acc[bookmark.category] || 0) + 1;
            return acc;
        }, {});

        document.querySelectorAll('.filter-btn').forEach(btn => {
            const category = btn.dataset.category;
            const count = category === 'all' ? this.bookmarks.length : (counts[category] || 0);
            const text = btn.textContent.split('(')[0].trim();
            btn.innerHTML = btn.innerHTML.split('(')[0] + (count > 0 ? ` (${count})` : '');
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? '#10b981' : '#3b82f6',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            zIndex: '9999',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    truncateUrl(url) {
        if (url.length <= 40) return url;
        return url.substring(0, 37) + '...';
    }

    // Export/Import functionality
    exportBookmarks() {
        const dataStr = JSON.stringify(this.bookmarks, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `bookmarks-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    importBookmarks(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedBookmarks = JSON.parse(e.target.result);
                if (Array.isArray(importedBookmarks)) {
                    this.bookmarks = [...this.bookmarks, ...importedBookmarks];
                    this.saveBookmarks();
                    this.renderBookmarks();
                    this.updateFilterButtons();
                    this.showNotification('Bookmarks importados com sucesso!', 'success');
                }
            } catch (error) {
                this.showNotification('Erro ao importar bookmarks. Verifique o arquivo.', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize the bookmark manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.bookmarkManager = new BookmarkManager();
});

// Add some utility functions for keyboard shortcuts and accessibility
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + N to add new bookmark
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        window.bookmarkManager.openModal();
    }
});

// Add drag and drop support for importing
document.addEventListener('dragover', (e) => {
    e.preventDefault();
});

document.addEventListener('drop', (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/json') {
        window.bookmarkManager.importBookmarks(files[0]);
    }
});
