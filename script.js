document.addEventListener('DOMContentLoaded', () => {
    // Fetch external data configuration
    fetch('./data.json')
        .then(response => response.json())
        .then(data => {
            populateDOM(data);
            initApp();
        })
        .catch(error => console.error('Error loading data:', error));
});

function populateDOM(data) {
    // Populate Journey List
    const journeyList = document.getElementById('journey-list');
    data.journey.forEach(item => {
        journeyList.innerHTML += `
            <li class="journey-item reveal fade-left" data-img="${item.image}">
                <div class="journey-year">${item.year}</div>
                <div class="journey-details">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            </li>
        `;
    });

    // Populate Projects
    const projectGrid = document.getElementById('project-grid');
    data.projects.forEach(project => {
        projectGrid.innerHTML += `
            <div class="project-card reveal">
                <span style="color:var(--accent-red)">${project.number}</span>
                <h3 class="scramble-text" data-value="${project.id}" style="margin: 1rem 0; font-size: 2.5rem;">${project.name}</h3>
                <p style="color:var(--text-muted)">${project.description}</p>
            </div>
        `;
    });

    // Populate Endorsements Marquee
    const marqueeWrapper = document.getElementById('marquee-wrapper');
    const generateReviewCards = () => {
        return data.endorsements.map(e => `
            <div class="review-card">
                <p class="review-text">${e.text}</p>
                <p class="review-author">— ${e.author}</p>
            </div>
        `).join('');
    };
    // Render twice for continuous loop effect
    marqueeWrapper.innerHTML = generateReviewCards() + generateReviewCards();

    // Populate Testimonials
    const testimonialWrapper = document.getElementById('testimonial-wrapper');
    data.testimonials.forEach(test => {
        testimonialWrapper.innerHTML += `
            <div class="testimonial-block ${test.reverse ? 'reverse' : ''} reveal">
                <div class="testimonial-quote-wrap">
                    <p class="testimonial-quote">${test.quote}</p>
                    <p class="testimonial-name">${test.name}</p>
                    <p class="testimonial-title" style="color: #666; font-size: 0.8rem;">${test.title}</p>
                </div>
                <div class="testimonial-visual-wrap">
                    <img src="${test.image}" class="parallax-img" alt="${test.name}">
                </div>
            </div>
        `;
    });

    // Populate FAQs
    const faqList = document.getElementById('faq-list');
    data.faqs.forEach(faq => {
        faqList.innerHTML += `
            <div class="faq-card scroll-anim">
                <h3 class="faq-q">${faq.question}</h3>
                <p class="faq-a">${faq.answer}</p>
            </div>
        `;
    });
}

function initApp() {
    // --- PREPARE TYPE-HEADER HTML ---
    document.querySelectorAll('.type-header').forEach(header => {
        const html = header.innerHTML;
        let newHtml = '';
        let inTag = false;
        for(let i=0; i<html.length; i++) {
            if(html[i] === '<') { inTag = true; newHtml += html[i]; } 
            else if(html[i] === '>') { inTag = false; newHtml += html[i]; } 
            else if(inTag) { newHtml += html[i]; } 
            else if(html[i] === ' ') { newHtml += ' '; } 
            else { newHtml += `<span class="type-char">${html[i]}</span>`; }
        }
        header.innerHTML = newHtml;
    });

    // --- 1. THREE.JS 3D SPIDER WEB ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('three-canvas'), alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const points = [];
    for (let i = 0; i < 120; i++) {
        points.push(new THREE.Vector3((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 20));
    }

    const lineGeo = new THREE.BufferGeometry();
    const positions = [];
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            if (points[i].distanceTo(points[j]) < 6) { 
                positions.push(points[i].x, points[i].y, points[i].z);
                positions.push(points[j].x, points[j].y, points[j].z);
            }
        }
    }
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const lineMat = new THREE.LineBasicMaterial({ color: 0xff3c3c, transparent: true, opacity: 0.25 });
    const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineMesh);
    camera.position.z = 15;

    // --- 2. GLOBAL SCROLL & MOUSE TRACKING ---
    let currentScroll = 0, targetScroll = 0;
    let mx = 0, my = 0, tx = 0, ty = 0;
    let normMouseX = 0, normMouseY = 0;
    const revealImg = document.getElementById('hover-reveal-img');
    const revealImgSrc = document.getElementById('reveal-img-src');

    window.addEventListener('scroll', () => { targetScroll = window.scrollY; });
    window.addEventListener('mousemove', e => { 
        mx = e.clientX; 
        my = e.clientY; 
        normMouseX = (e.clientX / window.innerWidth) * 2 - 1;
        normMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        
        if(revealImg && revealImg.classList.contains('active')){
            revealImg.style.left = `${mx}px`;
            revealImg.style.top = `${my}px`;
        }
    });

    // Image Change functionality for newly generated journey cards
    document.querySelectorAll('.journey-item').forEach(item => {
        item.addEventListener('mouseenter', (e) => {
            const target = e.target.closest('.journey-item'); // robust hit targeting
            if (revealImgSrc && target) {
                revealImgSrc.src = target.getAttribute('data-img');
                revealImg.classList.add('active');
            }
        });
        item.addEventListener('mouseleave', () => { 
            if(revealImg) revealImg.classList.remove('active'); 
        });
    });

    // File input name change setup
    const fileUpload = document.getElementById('file-upload');
    if (fileUpload) {
        fileUpload.addEventListener('change', function(e) {
            const fileName = e.target.files[0] ? e.target.files[0].name : "Upload Concept Image (Optional)";
            document.getElementById('file-name').innerText = fileName;
        });
    }

    // --- 3. MASTER ANIMATION LOOP ---
    function renderLoop() {
        currentScroll += (targetScroll - currentScroll) * 0.08;

        // Cursor Update
        const dot = document.querySelector('.cursor-dot');
        const trail = document.querySelector('.cursor-trail');
        if (dot && trail) {
            dot.style.left = `${mx}px`; dot.style.top = `${my}px`;
            tx += (mx - tx) * 0.15; ty += (my - ty) * 0.15;
            trail.style.left = `${tx}px`; trail.style.top = `${ty}px`;
        }

        // 3D Scene Update
        lineMesh.rotation.y = currentScroll * 0.0005;
        lineMesh.rotation.x = currentScroll * 0.0002;
        camera.position.x += (normMouseX * 3 - camera.position.x) * 0.05;
        camera.position.y += (normMouseY * 3 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);

        // Hero Fade
        const heroContent = document.getElementById('hero-content-wrapper');
        if(heroContent) {
            heroContent.style.transform = `translateY(${currentScroll * 0.4}px)`;
            heroContent.style.opacity = 1 - (currentScroll / 600);
        }

        // Image Parallax Update
        document.querySelectorAll('.parallax-img').forEach(img => {
            const rect = img.parentElement.getBoundingClientRect();
            const centerOffset = (window.innerHeight / 2) - (rect.top + rect.height / 2);
            img.style.transform = `translateY(${centerOffset * 0.15}px)`;
        });

        // Kinetic FAQ Scroll Logic
        document.querySelectorAll('.scroll-anim').forEach(card => {
            const rect = card.getBoundingClientRect();
            const viewHeight = window.innerHeight;
            let progress = (viewHeight - rect.top) / (viewHeight / 1.5);
            progress = Math.max(0, Math.min(1, progress));

            card.style.opacity = progress;
            card.style.transform = `translateY(${80 - progress * 80}px) scale(${0.85 + progress * 0.15})`;
            card.style.boxShadow = `0 ${progress * 20}px ${progress * 40}px rgba(255, 60, 60, ${progress * 0.05})`;
            card.style.borderColor = `rgba(255, 255, 255, ${0.05 + progress * 0.1})`;
        });

        // Footer Laser Scroll Scrubbing
        const contactCard = document.getElementById('contact-card');
        if(contactCard) {
            const rect = contactCard.getBoundingClientRect();
            let startY = window.innerHeight * 0.9;
            let endY = window.innerHeight * 0.3;
            let progress = (startY - rect.top) / (startY - endY);
            progress = Math.max(0, Math.min(1, progress));
            
            const laserLine = document.getElementById('laser-line');
            const laserImg = document.getElementById('laser-img');
            let percent = progress * 100;
            
            laserLine.style.left = `${percent}%`;
            laserImg.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
            laserLine.style.opacity = (percent > 1 && percent < 99) ? 1 : 0;
        }

        requestAnimationFrame(renderLoop);
    }
    renderLoop();

    // --- 4. REVEAL & TYPEWRITER OBSERVER (Reverses on Scroll Up) ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                const chars = entry.target.querySelectorAll('.char');
                chars.forEach((c, i) => c.style.transitionDelay = `${i * 0.05}s`);

                if(entry.target.classList.contains('type-header') && !entry.target.isTyping) {
                    entry.target.isTyping = true;
                    const typeChars = entry.target.querySelectorAll('.type-char');
                    let i = 0;
                    entry.target.typingInterval = setInterval(() => {
                        if(i < typeChars.length) {
                            typeChars[i].classList.add('typed');
                            i++;
                        } else {
                            clearInterval(entry.target.typingInterval);
                        }
                    }, 50); 
                }
            } else if(entry.boundingClientRect.top > 0) {
                entry.target.classList.remove('active');
                
                if(entry.target.classList.contains('type-header')) {
                    entry.target.isTyping = false;
                    clearInterval(entry.target.typingInterval);
                    entry.target.querySelectorAll('.type-char').forEach(c => c.classList.remove('typed'));
                }
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // --- 5. HACKER SCRAMBLE ---
    const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    document.querySelectorAll('.scramble-text').forEach(el => {
        el.onmouseover = event => {  
            let iteration = 0;
            let interval = setInterval(() => {
                event.target.innerText = event.target.innerText.split("")
                    .map((letter, index) => {
                        if(index < iteration) return event.target.dataset.value[index];
                        return alpha[Math.floor(Math.random() * 26)];
                    }).join("");
                if(iteration >= event.target.dataset.value.length) clearInterval(interval);
                iteration += 1 / 3;
            }, 30);
        }
    });

    document.querySelectorAll('a, button, .journey-item').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hover-active'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hover-active'));
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// --- GLOBAL EXPOSED FUNCTIONS (For HTML inline handlers) ---
window.openModal = function() {
    document.getElementById('callModal').classList.add('active');
}

window.closeModal = function(e, force = false) {
    if(force || e.target.id === 'callModal') { 
        document.getElementById('callModal').classList.remove('active'); 
    }
}

window.copyEmail = function(btn) {
    navigator.clipboard.writeText("hello@ignisit.com");
    const originalText = btn.innerText;
    btn.innerText = "COPIED!";
    btn.style.borderColor = "var(--accent-red)";
    setTimeout(() => { btn.innerText = originalText; btn.style.borderColor = ""; }, 2000);
}