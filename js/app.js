import { storage, ref, uploadBytes, getDownloadURL } from './config.js';
import { showToast } from './toast.js';
import { timeAgo, escapeHTML } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const createPostForm = document.getElementById('create-post-form');
    const feedContainer = document.getElementById('feed-container');

    // Post form elements
    const postText = document.getElementById('post-text');
    const postCode = document.getElementById('post-code');
    const postImage = document.getElementById('post-image');
    const submitBtn = document.getElementById('submit-post-btn');
    const charCounter = document.getElementById('char-counter');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const removeImageBtn = document.getElementById('remove-image-btn');

    // Form Validation & Interactions
    if (createPostForm) {
        const validateForm = () => {
            const hasText = postText.value.trim().length > 0;
            const hasCode = postCode.value.trim().length > 0;
            const hasImage = postImage.files.length > 0;
            submitBtn.disabled = !(hasText || hasCode || hasImage);
        };

        // Auto-expand textarea & count chars
        postText.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
            charCounter.textContent = `${this.value.length}/500`;
            validateForm();
        });

        postCode.addEventListener('input', validateForm);

        // Image Preview logic
        postImage.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreviewContainer.classList.remove('hidden');
                }
                reader.readAsDataURL(file);
            } else {
                imagePreviewContainer.classList.add('hidden');
                imagePreview.src = '';
            }
            validateForm();
        });

        // Remove image
        removeImageBtn.addEventListener('click', () => {
            postImage.value = '';
            imagePreviewContainer.classList.add('hidden');
            imagePreview.src = '';
            validateForm();
        });

        createPostForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            submitBtn.disabled = true;
            submitBtn.textContent = 'Publicando...';

            const text = postText.value;
            const code = postCode.value;
            const imageFile = postImage.files[0];

            const currentUser = Parse.User.current();
            if (!currentUser) {
                showToast("Você precisa estar logado para publicar.", "error");
                submitBtn.disabled = false;
                submitBtn.textContent = 'Publicar';
                return;
            }

            try {
                let imageUrl = null;

                // 1. Upload Image to Firebase Storage if exists
                if (imageFile) {
                    const storageRef = ref(storage, 'posts/' + Date.now() + '_' + imageFile.name);
                    const snapshot = await uploadBytes(storageRef, imageFile);
                    imageUrl = await getDownloadURL(snapshot.ref);
                }

                // 2. Save Post to Back4App
                const Post = Parse.Object.extend("Post");
                const post = new Post();
                post.set("text", text);
                post.set("code", code);
                if (imageUrl) {
                    post.set("imageUrl", imageUrl);
                }
                post.set("author", currentUser);
                post.set("authorName", currentUser.get("displayName") || currentUser.get("username"));
                post.set("authorPhoto", currentUser.get("photoURL"));
                post.set("likes", []);

                await post.save();

                // Clear form
                postText.value = '';
                postText.style.height = 'auto';
                charCounter.textContent = '0/500';
                postCode.value = '';
                postImage.value = '';
                imagePreviewContainer.classList.add('hidden');
                imagePreview.src = '';
                validateForm();

                showToast("Postagem publicada com sucesso!");

                // Reload feed
                loadPosts();

            } catch (error) {
                console.error("Erro ao criar post:", error);
                showToast("Erro ao criar postagem: " + error.message, "error");
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Publicar';
            }
        });
    }

    // Skeleton loader
    const showSkeletons = () => {
        let html = '';
        for(let i=0; i<3; i++) {
            html += `
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 animate-pulse">
                <div class="flex items-center mb-4">
                    <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-3"></div>
                    <div>
                        <div class="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                        <div class="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                </div>
                <div class="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div class="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div class="h-32 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>`;
        }
        feedContainer.innerHTML = html;
    };

    // Load Posts Function
    const loadPosts = async () => {
        if (!feedContainer) return;
        showSkeletons();

        try {
            const Post = Parse.Object.extend("Post");
            const query = new Parse.Query(Post);
            query.descending("createdAt"); // Newest first
            query.limit(20);

            const posts = await query.find();
            const currentUser = Parse.User.current();

            feedContainer.innerHTML = ''; // Clear loading text

            if (posts.length === 0) {
                feedContainer.innerHTML = `
                <div class="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Nenhuma postagem</h3>
                    <p class="mt-1 text-sm text-gray-500">Seja o primeiro a compartilhar algo!</p>
                </div>`;
                return;
            }

            posts.forEach(post => {
                const authorName = escapeHTML(post.get('authorName') || 'Desenvolvedor Anônimo');
                const authorPhoto = post.get('authorPhoto') || 'https://via.placeholder.com/40';
                const text = post.get('text');
                const code = post.get('code');
                const imageUrl = post.get('imageUrl');
                const date = timeAgo(post.createdAt);
                const likes = post.get('likes') || [];
                const hasLiked = currentUser ? likes.includes(currentUser.id) : false;
                const isAuthor = currentUser && post.get('author') && post.get('author').id === currentUser.id;

                const postEl = document.createElement('div');
                postEl.className = 'bg-white dark:bg-gray-800 rounded-lg shadow p-5 transition-all duration-300 hover:shadow-md';
                postEl.dataset.postId = post.id;

                // Simple check for safe URL
                const safeAvatarUrl = authorPhoto.startsWith('http') || authorPhoto.startsWith('https') ? authorPhoto : 'https://via.placeholder.com/40';

                let contentHtml = `
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center">
                            <img src="${safeAvatarUrl}" alt="${authorName}" class="w-10 h-10 rounded-full mr-3 border border-gray-200 dark:border-gray-700 object-cover">
                            <div>
                                <h4 class="font-bold text-sm text-gray-900 dark:text-gray-100">${authorName}</h4>
                                <span class="text-xs text-gray-500 dark:text-gray-400">${date}</span>
                            </div>
                        </div>
                        ${isAuthor ? `
                        <button class="delete-post-btn text-gray-400 hover:text-red-500 transition-colors" title="Excluir post">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                        ` : ''}
                    </div>
                `;

                if (text) {
                    contentHtml += `<p class="mb-4 text-gray-800 dark:text-gray-200 whitespace-pre-wrap text-sm leading-relaxed">${escapeHTML(text)}</p>`;
                }

                if (code) {
                    contentHtml += `
                        <div class="mb-4 relative group">
                            <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button class="copy-code-btn bg-gray-800 hover:bg-gray-700 text-xs text-gray-300 px-2 py-1 rounded border border-gray-600 flex items-center gap-1">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                    Copiar
                                </button>
                            </div>
                            <pre><code class="rounded-lg text-sm !bg-gray-900 border border-gray-700 shadow-inner">${escapeHTML(code)}</code></pre>
                        </div>
                    `;
                }

                if (imageUrl) {
                    contentHtml += `
                        <div class="mb-4">
                            <img src="${imageUrl}" alt="Imagem do post" class="rounded-lg max-h-96 w-auto object-contain border border-gray-100 dark:border-gray-700">
                        </div>
                    `;
                }

                contentHtml += `
                    <div class="border-t border-gray-100 dark:border-gray-700 pt-3 flex items-center justify-between text-gray-500 dark:text-gray-400 text-sm">
                        <div class="flex gap-4">
                            <button class="like-btn flex items-center transition-colors ${hasLiked ? 'text-blue-600 dark:text-blue-400' : 'hover:text-blue-600 dark:hover:text-blue-400'}">
                                <svg class="w-5 h-5 mr-1 ${hasLiked ? 'fill-current' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path></svg>
                                <span class="like-count font-medium">${likes.length > 0 ? likes.length : 'Curtir'}</span>
                            </button>
                            <button class="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                                Comentar
                            </button>
                        </div>
                    </div>
                `;

                postEl.innerHTML = contentHtml;
                feedContainer.appendChild(postEl);

                // Add interactions
                if (code) {
                    const copyBtn = postEl.querySelector('.copy-code-btn');
                    copyBtn.addEventListener('click', () => {
                        navigator.clipboard.writeText(code).then(() => {
                            const originalText = copyBtn.innerHTML;
                            copyBtn.innerHTML = `<svg class="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Copiado`;
                            setTimeout(() => copyBtn.innerHTML = originalText, 2000);
                        });
                    });
                }

                const likeBtn = postEl.querySelector('.like-btn');
                const likeCountSpan = postEl.querySelector('.like-count');
                likeBtn.addEventListener('click', async () => {
                    if (!currentUser) return showToast("Faça login para curtir", "error");

                    likeBtn.classList.toggle('text-blue-600');
                    likeBtn.classList.toggle('dark:text-blue-400');
                    const svg = likeBtn.querySelector('svg');
                    svg.classList.toggle('fill-current');

                    let currentLikes = post.get('likes') || [];
                    if (currentLikes.includes(currentUser.id)) {
                        currentLikes = currentLikes.filter(id => id !== currentUser.id);
                    } else {
                        currentLikes.push(currentUser.id);
                    }

                    likeCountSpan.textContent = currentLikes.length > 0 ? currentLikes.length : 'Curtir';

                    post.set('likes', currentLikes);
                    try {
                        await post.save();
                    } catch (e) {
                        console.error("Erro ao curtir", e);
                    }
                });

                if (isAuthor) {
                    const deleteBtn = postEl.querySelector('.delete-post-btn');
                    deleteBtn.addEventListener('click', async () => {
                        if (confirm("Tem certeza que deseja excluir esta postagem?")) {
                            try {
                                await post.destroy();
                                postEl.remove();
                                showToast("Postagem excluída.");
                                if(feedContainer.children.length === 0) loadPosts(); // trigger empty state if needed
                            } catch(e) {
                                showToast("Erro ao excluir", "error");
                            }
                        }
                    });
                }
            });

            // Apply syntax highlighting
            if (window.hljs) {
                document.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightElement(block);
                });
            }

        } catch (error) {
            console.error("Erro ao carregar postagens:", error);
            feedContainer.innerHTML = '<div class="text-center text-red-500 py-8">Erro ao carregar postagens.</div>';
        }
    };

    // Initial load
    if (window.location.pathname === '/') {
        // Wait a bit for auth to resolve
        setTimeout(() => {
            if(Parse.User.current()) {
                 loadPosts();
            }
        }, 500);
    }
});
