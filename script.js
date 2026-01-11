// Initialize Particles.js
document.addEventListener('DOMContentLoaded', function() {
    // Particles Background
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 50, density: { enable: true, value_area: 800 } },
                color: { value: "#00D4FF" },
                shape: { type: "circle" },
                opacity: { value: 0.3, random: true },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#00D4FF",
                    opacity: 0.1,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" }
                }
            },
            retina_detect: true
        });
    }

    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            if (navMenu.classList.contains('active')) {
                navMenu.style.display = 'flex';
            } else {
                navMenu.style.display = 'none';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.nav-container') && window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                navMenu.style.display = 'none';
            }
        });
        
        // Close menu on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navMenu.classList.remove('active');
                navMenu.style.display = 'flex';
            } else {
                navMenu.classList.remove('active');
                navMenu.style.display = 'none';
            }
        });
        
        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navMenu.classList.remove('active');
                    navMenu.style.display = 'none';
                }
            });
        });
    }

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update Active Navigation Link on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveNav() {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    
    // Initialize
    updateActiveNav();

    // Meme Generator Logic
    const generateBtn = document.getElementById('generateBtn');
    const memePreview = document.getElementById('memePreview');
    const memeActions = document.getElementById('memeActions');
    const totalGenerated = document.getElementById('totalGenerated');
    const userGenerated = document.getElementById('userGenerated');
    
    // State
    let generatedCount = 1234;
    let userCount = 0;
    let currentMeme = null;
    
    // Meme templates (LATE character always appears)
    const memeTemplates = {
        fomo: [
            "WHEN YOU'RE LATE TO THE PARTY",
            "BUT $LATE IS STILL EARLY",
            "FOMO ACTIVATED"
        ],
        moon: [
            "TO THE MOON",
            "$LATE COMMUNITY TAKEOVER",
            "NEXT STOP: ANDROMEDA"
        ],
        diamond: [
            "DIAMOND HANDS ONLY",
            "HODLING THROUGH THE CTO",
            "COMMUNITY STRONG"
        ],
        community: [
            "WE ARE THE TEAM NOW",
            "100% COMMUNITY OWNED",
            "DEVS LEFT, WE STAYED"
        ]
    };
    
    // Background colors for different themes
    const backgroundThemes = {
        dark: ['#0A0A0F', '#1A1A2E'],
        gradient: ['#0A0A0F', '#00D4FF'],
        space: ['#000033', '#000066'],
        neon: ['#000000', '#003333']
    };
    
    // Initialize meme style options
    const styleOptions = document.querySelectorAll('.style-option');
    const themeOptions = document.querySelectorAll('.theme-option');
    
    styleOptions.forEach(option => {
        option.addEventListener('click', function() {
            styleOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            themeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Random caption generator
    const captionInput = document.getElementById('captionInput');
    const randomCaptionBtn = document.getElementById('randomCaption');
    const captionSuggestions = document.querySelectorAll('.suggestion');
    
    randomCaptionBtn.addEventListener('click', function() {
        const selectedStyle = document.querySelector('.style-option.active').dataset.style;
        const captions = memeTemplates[selectedStyle];
        const randomCaption = captions[Math.floor(Math.random() * captions.length)];
        captionInput.value = randomCaption;
    });
    
    captionSuggestions.forEach(suggestion => {
        suggestion.addEventListener('click', function() {
            captionInput.value = this.dataset.text;
        });
    });
    
    // Generate Meme Function
    generateBtn.addEventListener('click', function() {
        // Show loading state
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        generateBtn.disabled = true;
        
        setTimeout(() => {
            const selectedStyle = document.querySelector('.style-option.active').dataset.style;
            const selectedTheme = document.querySelector('.theme-option.active').dataset.theme;
            const caption = captionInput.value || memeTemplates[selectedStyle][0];
            
            // Create canvas for meme generation
            const canvas = document.createElement('canvas');
            // Adjust size for mobile
            const isMobile = window.innerWidth < 768;
            canvas.width = isMobile ? 400 : 600;
            canvas.height = isMobile ? 300 : 400;
            const ctx = canvas.getContext('2d');
            
            // Draw background
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, backgroundThemes[selectedTheme][0]);
            gradient.addColorStop(1, backgroundThemes[selectedTheme][1]);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw crypto pattern in background
            if (selectedTheme === 'space') {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                for (let i = 0; i < 30; i++) {
                    ctx.beginPath();
                    ctx.arc(
                        Math.random() * canvas.width,
                        Math.random() * canvas.height,
                        Math.random() * 2,
                        0, Math.PI * 2
                    );
                    ctx.fill();
                }
            }
            
            // Draw LATE Character (Always appears)
            drawLateCharacter(ctx, canvas.width, canvas.height);
            
            // Draw caption
            ctx.fillStyle = '#FFFFFF';
            const fontSize = isMobile ? 24 : 32;
            ctx.font = `bold ${fontSize}px "Space Grotesk", sans-serif`;
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 10;
            
            // Split caption into lines if needed
            const words = caption.split(' ');
            let lines = [];
            let currentLine = words[0];
            
            for (let i = 1; i < words.length; i++) {
                const width = ctx.measureText(currentLine + ' ' + words[i]).width;
                if (width < canvas.width - 40) {
                    currentLine += ' ' + words[i];
                } else {
                    lines.push(currentLine);
                    currentLine = words[i];
                }
            }
            lines.push(currentLine);
            
            // Draw each line
            const lineHeight = isMobile ? 30 : 40;
            lines.forEach((line, index) => {
                const y = 40 + (index * lineHeight);
                ctx.fillText(line, canvas.width / 2, y);
            });
            
            // Draw $LATE logo at bottom
            const logoFontSize = isMobile ? 32 : 48;
            ctx.font = `bold ${logoFontSize}px "Space Grotesk", sans-serif`;
            ctx.fillStyle = '#00D4FF';
            ctx.shadowColor = 'rgba(0, 212, 255, 0.5)';
            ctx.shadowBlur = 20;
            ctx.fillText('$LATE', canvas.width / 2, canvas.height - (isMobile ? 30 : 50));
            
            // Reset shadow
            ctx.shadowBlur = 0;
            
            // Add CTO badge
            ctx.fillStyle = '#00FF88';
            const badgeFontSize = isMobile ? 16 : 20;
            ctx.font = `bold ${badgeFontSize}px "Space Grotesk", sans-serif`;
            ctx.fillText('COMMUNITY TAKEOVER', canvas.width / 2, canvas.height - (isMobile ? 10 : 20));
            
            // Convert to data URL
            currentMeme = canvas.toDataURL('image/png');
            
            // Display meme
            displayMeme(currentMeme);
            
            // Update counters
            generatedCount++;
            userCount++;
            totalGenerated.textContent = generatedCount.toLocaleString();
            userGenerated.textContent = userCount;
            
            // Save to community gallery
            saveToCommunityGallery(currentMeme);
            
            // Reset button
            generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate $LATE Meme';
            generateBtn.disabled = false;
            
            // Show meme actions
            memeActions.style.display = 'flex';
            
        }, 1000); // Simulate generation delay
    });
    
    // Draw LATE Character Function
    function drawLateCharacter(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const isMobile = width < 500;
        const scale = isMobile ? 0.8 : 1;
        
        // Draw character body (simplified)
        ctx.fillStyle = '#00D4FF';
        ctx.shadowColor = 'rgba(0, 212, 255, 0.5)';
        ctx.shadowBlur = 20 * scale;
        
        // Head
        ctx.beginPath();
        ctx.arc(centerX, centerY - (60 * scale), 40 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // Body
        ctx.fillRect(centerX - (30 * scale), centerY - (20 * scale), 60 * scale, 80 * scale);
        
        // Arms
        ctx.fillRect(centerX - (70 * scale), centerY, 40 * scale, 15 * scale);
        ctx.fillRect(centerX + (30 * scale), centerY, 40 * scale, 15 * scale);
        
        // Legs
        ctx.fillRect(centerX - (25 * scale), centerY + (60 * scale), 20 * scale, 40 * scale);
        ctx.fillRect(centerX + (5 * scale), centerY + (60 * scale), 20 * scale, 40 * scale);
        
        // Eyes
        ctx.fillStyle = '#0A0A0F';
        ctx.beginPath();
        ctx.arc(centerX - (15 * scale), centerY - (70 * scale), 8 * scale, 0, Math.PI * 2);
        ctx.arc(centerX + (15 * scale), centerY - (70 * scale), 8 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // Smile
        ctx.beginPath();
        ctx.arc(centerX, centerY - (50 * scale), 15 * scale, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.lineWidth = 3 * scale;
        ctx.strokeStyle = '#0A0A0F';
        ctx.stroke();
        
        // Reset shadow
        ctx.shadowBlur = 0;
    }
    
    // Display Meme Function
    function displayMeme(dataUrl) {
        memePreview.innerHTML = '';
        const img = document.createElement('img');
        img.src = dataUrl;
        img.alt = 'Generated $LATE Meme';
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.borderRadius = '10px';
        memePreview.appendChild(img);
    }
    
    // Save to Community Gallery
    function saveToCommunityGallery(dataUrl) {
        const gallery = document.getElementById('communityGallery');
        const galleryItems = gallery.querySelectorAll('.gallery-item');
        
        // Keep only 8 items on mobile
        const maxItems = window.innerWidth < 768 ? 8 : 12;
        if (galleryItems.length >= maxItems) {
            gallery.removeChild(galleryItems[galleryItems.length - 1]);
        }
        
        // Add new item at beginning
        const newItem = document.createElement('div');
        newItem.className = 'gallery-item';
        newItem.innerHTML = `<img src="${dataUrl}" alt="Community Meme" loading="lazy">`;
        gallery.insertBefore(newItem, gallery.firstChild);
    }
    
    // Share Meme
    document.getElementById('shareBtn').addEventListener('click', function() {
        if (!currentMeme) return;
        
        if (navigator.share) {
            navigator.share({
                title: 'Check out my $LATE meme!',
                text: 'Generated with $LATE AI Meme Generator - Community Take Over! #LATECTO',
                url: window.location.href
            });
        } else {
            // Fallback: Copy image to clipboard or show download
            const tempLink = document.createElement('a');
            tempLink.href = currentMeme;
            tempLink.download = 'LATE-meme.png';
            tempLink.click();
            alert('Meme downloaded! Share it on social media with #LATECTO');
        }
    });
    
    // Download Meme
    document.getElementById('downloadBtn').addEventListener('click', function() {
        if (!currentMeme) return;
        
        const link = document.createElement('a');
        link.href = currentMeme;
        link.download = `LATE-meme-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
    
    // Regenerate Meme
    document.getElementById('regenerateBtn').addEventListener('click', function() {
        if (generateBtn) {
            generateBtn.click();
        }
    });
    
    // Copy Contract Address
    const copyContractBtn = document.getElementById('copyContract');
    const contractAddress = document.getElementById('contractAddress');
    
    copyContractBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(contractAddress.textContent)
            .then(() => {
                const originalHTML = copyContractBtn.innerHTML;
                copyContractBtn.innerHTML = '<i class="fas fa-check"></i>';
                copyContractBtn.style.background = 'linear-gradient(135deg, #00FF88, #00D4FF)';
                
                setTimeout(() => {
                    copyContractBtn.innerHTML = originalHTML;
                    copyContractBtn.style.background = '';
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                alert('Failed to copy address. Please copy manually.');
            });
    });
    
    // Add to Wallet Button
    const addToWalletBtn = document.getElementById('addToWallet');
    
    addToWalletBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (typeof window.ethereum !== 'undefined') {
            // MetaMask is installed
            window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: contractAddress.textContent,
                        symbol: 'LATE',
                        decimals: 9,
                        image: 'https://latememe.fun/late-logo.png'
                    }
                }
            });
        } else {
            alert('Please install MetaMask or another Web3 wallet to add $LATE');
        }
    });
    
    // Live Data Simulation dengan data dari DexScreener
    function updateLiveData() {
        const priceElement = document.getElementById('priceValue');
        const priceChangeElement = document.getElementById('priceChange');
        const marketCapElement = document.getElementById('marketCap');
        const volumeElement = document.getElementById('volume24h');
        const holdersElement = document.getElementById('holdersCount');
        const transactionsElement = document.getElementById('transactions');
        const buyOrdersElement = document.getElementById('buyOrders');
        const sellOrdersElement = document.getElementById('sellOrders');
        const buyVolumeElement = document.getElementById('buyVolume');
        const sellVolumeElement = document.getElementById('sellVolume');
        
        // Data dari DexScreener
        const baseData = {
            price: 0.041016,
            marketCap: 10000,
            volume: 8500,
            transactions: 275,
            makers: 89,
            buyers: 77,
            sellers: 57,
            buyOrders: 162,
            sellOrders: 113,
            buyVol: 4400,
            sellVol: 4000
        };
        
        // Simulasi perubahan harga kecil
        const randomFactor = 1 + (Math.random() - 0.5) * 0.02; // ±1%
        const currentPrice = baseData.price * randomFactor;
        const priceChange = ((currentPrice - baseData.price) / baseData.price * 100).toFixed(2);
        
        // Update elements dengan data aktual
        priceElement.textContent = `$${currentPrice.toFixed(6)}`;
        marketCapElement.textContent = `$${Math.floor(baseData.marketCap * randomFactor).toLocaleString()}`;
        volumeElement.textContent = `$${Math.floor(baseData.volume * (0.9 + Math.random() * 0.2)).toLocaleString()}`;
        transactionsElement.textContent = baseData.transactions + Math.floor(Math.random() * 5);
        holdersElement.textContent = baseData.makers;
        buyOrdersElement.textContent = baseData.buyOrders + Math.floor(Math.random() * 3);
        sellOrdersElement.textContent = baseData.sellOrders + Math.floor(Math.random() * 2);
        buyVolumeElement.textContent = `$${Math.floor(baseData.buyVol * (0.9 + Math.random() * 0.2)).toLocaleString()}`;
        sellVolumeElement.textContent = `$${Math.floor(baseData.sellVol * (0.9 + Math.random() * 0.2)).toLocaleString()}`;
        
        // Update price change dengan color
        if (priceChange >= 0) {
            priceChangeElement.textContent = `+${priceChange}%`;
            priceChangeElement.className = 'metric-change positive';
        } else {
            priceChangeElement.textContent = `${priceChange}%`;
            priceChangeElement.className = 'metric-change negative';
        }
        
        // Update setiap 30 detik
        setTimeout(updateLiveData, 30000);
    }
    
    // Initialize live data
    updateLiveData();
    
    // Initialize community gallery
    function initializeCommunityGallery() {
        const gallery = document.getElementById('communityGallery');
        
        // Create placeholder community memes
        const numItems = window.innerWidth < 768 ? 4 : 6;
        for (let i = 0; i < numItems; i++) {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            
            // Create simple placeholder image
            const canvas = document.createElement('canvas');
            const isMobile = window.innerWidth < 768;
            canvas.width = isMobile ? 150 : 150;
            canvas.height = isMobile ? 120 : 150;
            const ctx = canvas.getContext('2d');
            
            // Simple gradient background
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#0A0A0F');
            gradient.addColorStop(1, '#00D4FF');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add $LATE text
            ctx.fillStyle = '#FFFFFF';
            const fontSize = isMobile ? 16 : 20;
            ctx.font = `bold ${fontSize}px "Space Grotesk"`;
            ctx.textAlign = 'center';
            ctx.fillText('$LATE', canvas.width / 2, canvas.height / 2);
            
            ctx.font = `bold ${fontSize - 6}px "Space Grotesk"`;
            ctx.fillText('COMMUNITY', canvas.width / 2, canvas.height / 2 + 20);
            
            const img = document.createElement('img');
            img.src = canvas.toDataURL();
            img.alt = 'Community Meme';
            img.loading = 'lazy';
            
            item.appendChild(img);
            gallery.appendChild(item);
        }
    }
    
    // Load community gallery
    initializeCommunityGallery();
    
    // Copy Website Link
    const copyLinkBtn = document.getElementById('copyLink');
    
    copyLinkBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                const originalHTML = copyLinkBtn.innerHTML;
                copyLinkBtn.innerHTML = '<i class="fas fa-check"></i>';
                
                setTimeout(() => {
                    copyLinkBtn.innerHTML = originalHTML;
                }, 2000);
            });
    });
    
    // Whitepaper Button
    const whitepaperBtn = document.getElementById('whitepaper');
    
    whitepaperBtn.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Community Whitepaper coming soon! Vote on proposals to shape the future of $LATE.');
    });
    
    // Newsletter Form
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input').value;
            
            if (email) {
                alert('Thank you for subscribing to $LATE updates!');
                this.querySelector('input').value = '';
            }
        });
    }
    
    // Handle window resize for responsive adjustments
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Reinitialize gallery on resize
            const gallery = document.getElementById('communityGallery');
            if (gallery) {
                gallery.innerHTML = '';
                initializeCommunityGallery();
            }
        }, 250);
    });
});