

        // DOM Elements
        const searchInput = document.getElementById('searchInput');
        const resultsContainer = document.getElementById('resultsContainer');
        const resultsScroller = document.getElementById('resultsScroller');
        const pdfModal = document.getElementById('pdfModal');
        const pdfPreview = document.getElementById('pdfPreview');
        const modalTitle = document.getElementById('modalTitle');
        const closeModal = document.getElementById('closeModal');
        const loader = document.getElementById('loader');
        const downloadBtn = document.getElementById('downloadBtn');
        const printBtn = document.getElementById('printBtn');

        // Current PDF reference
        let currentPdfUrl = '';

        // Search functionality
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.trim().toLowerCase();
            
            // Clear previous results
            resultsScroller.innerHTML = '';
            
            if (searchTerm === '') {
                resultsContainer.style.display = 'none';
                loader.style.display = 'none';
                return;
            }
            
            // Show loading animation
            loader.style.display = 'block';
            resultsContainer.style.display = 'none';
            
            // Simulate loading delay (remove in production)
            setTimeout(() => {
                // Filter matching results
                const matchingResults = pdfDatabase.filter(item => {
                    const nameMatch = item.name.toLowerCase().includes(searchTerm);
                    const descMatch = item.description.toLowerCase().includes(searchTerm);
                    return nameMatch || descMatch;
                });
                
                // Display results
                if (matchingResults.length > 0) {
                    resultsContainer.style.display = 'block';
                    loader.style.display = 'none';
                    
                    matchingResults.forEach((item, index) => {
                        const card = document.createElement('div');
                        card.className = 'result-card';
                        card.style.animationDelay = `${index * 0.1}s`;
                        card.innerHTML = `
                            <div class="card-content">
                                <h3>${item.name}</h3>
                                <p class="author">${item.author}</p>
                                <p class="description">${item.description}</p>
                            </div>
                            <div class="card-actions">
                                <button class="open-btn" data-url="${item.url}" data-title="${item.name}">
                                    <span>Ouvrir</span>
                                </button>
                            </div>
                        `;
                        resultsScroller.appendChild(card);
                    });
                    
                    // Add event listeners to all open buttons
                    document.querySelectorAll('.open-btn').forEach(btn => {
                        btn.addEventListener('click', function() {
                            const pdfUrl = this.getAttribute('data-url');
                            const pdfTitle = this.getAttribute('data-title');
                            openPdfModal(pdfUrl, pdfTitle);
                        });
                    });
                } else {
                    resultsContainer.style.display = 'block';
                    loader.style.display = 'none';
                    resultsScroller.innerHTML = '<div class="no-results">Aucun document trouvé pour "' + searchTerm + '"</div>';
                }
            }, 600); // Simulated loading delay
        });
        
        // PDF Modal functions
        function openPdfModal(url, title) {
            currentPdfUrl = url;
            modalTitle.textContent = title;
            pdfPreview.src = url;
            
            // Show modal with animation
            pdfModal.style.display = 'flex';
            setTimeout(() => {
                pdfModal.classList.add('show');
            }, 10);
            
            document.body.style.overflow = 'hidden';
        }
        
        function closePdfModal() {
            pdfModal.classList.remove('show');
            setTimeout(() => {
                pdfModal.style.display = 'none';
                pdfPreview.src = '';
            }, 200);
            document.body.style.overflow = 'auto';
        }
        
        // Download PDF function
        downloadBtn.addEventListener('click', function() {
            if (currentPdfUrl) {
                const link = document.createElement('a');
                link.href = currentPdfUrl;
                link.download = modalTitle.textContent + '.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        });
        
        // Print PDF function
        printBtn.addEventListener('click', function() {
            if (pdfPreview.contentWindow) {
                pdfPreview.contentWindow.print();
            }
        });
        
        // Close modal when clicking X or outside
        closeModal.addEventListener('click', closePdfModal);
        pdfModal.addEventListener('click', function(e) {
            if (e.target === pdfModal) {
                closePdfModal();
            }
        });
        
        // Close modal with ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closePdfModal();
            }
        });
        
        // Focus search input on page load
        setTimeout(() => {
            searchInput.focus();
        }, 300);