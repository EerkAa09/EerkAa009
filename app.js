// Data storage
let posts = JSON.parse(localStorage.getItem('erkaPosts')) || [];
let selectedImage = null;
let currentText = '';

// DOM elements
const photoUpload = document.getElementById('photoUpload');
const photoInput = document.getElementById('photoInput');
const textUpload = document.getElementById('textUpload');
const storyText = document.getElementById('storyText');
const shareBtn = document.getElementById('shareBtn');
const gallery = document.getElementById('gallery');
const photoPreview = document.getElementById('photoPreview');
const textPreview = document.getElementById('textPreview');

// Drag & drop functionality
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
    photoUpload.addEventListener(event, e => e.preventDefault());
});

photoUpload.addEventListener('dragover', () => photoUpload.classList.add('dragover'));
photoUpload.addEventListener('dragleave', () => photoUpload.classList.remove('dragover'));
photoUpload.addEventListener('drop', handleDrop);
photoInput.addEventListener('change', handleFileSelect);
photoUpload.addEventListener('click', () => photoInput.click());

function handleDrop(e) {
    photoUpload.classList.remove('dragover');
    const files = e.dataTransfer.files;
    handleImageFile(files[0]);
}

function handleFileSelect(e) {
    handleImageFile(e.target.files[0]);
}

function handleImageFile(file) {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = e => {
            selectedImage = e.target.result;
            showPhotoPreview(selectedImage);
        };
        reader.readAsDataURL(file);
    }
}

function showPhotoPreview(imageSrc) {
    photoPreview.innerHTML = `
                <img src="${imageSrc}" alt="Preview">
                <div style="margin-top: 10px; font-size: 0.9rem; color: #667eea;">✅ Photo ready to share</div>
            `;
}

// Text handling
storyText.addEventListener('input', e => {
    currentText = e.target.value;
    if (currentText.trim()) {
        textPreview.innerHTML = `<div style="font-size: 0.9rem; color: #667eea;">✅ ${currentText.length} characters ready</div>`;
    } else {
        textPreview.innerHTML = '';
    }
});

// Share button
shareBtn.addEventListener('click', createPost);

function createPost() {
    const text = currentText.trim();

    if (!selectedImage && !text) {
        alert('Зураг эсвэл бичвэр оруулнуу! ✨');
        return;
    }

    const post = {
        id: Date.now(),
        image: selectedImage,
        text: text || '✨ Just a beautiful moment',
        timestamp: Date.now(),
        date: new Date().toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    };

    posts.unshift(post);
    savePosts();

    // Reset form
    resetForm();
    renderGallery();
}

function resetForm() {
    selectedImage = null;
    currentText = '';
    storyText.value = '';
    photoPreview.innerHTML = '';
    textPreview.innerHTML = '';
    photoInput.value = '';
}

function savePosts() {
    localStorage.setItem('erkaPosts', JSON.stringify(posts));
}

function renderGallery() {
    if (posts.length === 0) {
        gallery.innerHTML = `
            <div class="empty-state">
                <h3>✨ хараахан дурсамж хадгалаагүй байна</h3>
                <p>эхлээд дурсамжаа хадгалнуу!</p>
            </div>
                `;
        return;
    }

    gallery.innerHTML = posts.map((post, index) => `
                <article class="gallery-item" style="animation-delay: ${index * 0.1}s">
                    ${post.image ? `<img src="${post.image}" alt="Erka's moment" loading="lazy">` : ''}
                    <div class="gallery-content">
                        <h3 class="gallery-title">${truncateText(post.text, 40)}</h3>
                        <p class="gallery-text">${post.text}</p>
                        <div class="post-meta">
                            <span>${post.date}</span>
                            <button class="delete-btn" onclick="deletePost(${post.id})">Delete</button>
                        </div>
                    </div>
                </article>
            `).join('');
}

function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function deletePost(id) {
    if (confirm('Устгахдаа итгэлтэй байна уу? 💔')) {
        posts = posts.filter(post => post.id !== id);
        savePosts();
        renderGallery();
    }
}

// Initialize
renderGallery();

// Auto-save text on blur
storyText.addEventListener('blur', () => {
    currentText = storyText.value;
});