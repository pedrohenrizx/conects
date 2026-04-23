import { storage, ref, uploadBytes, getDownloadURL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const createPostForm = document.getElementById('create-post-form');
    const feedContainer = document.getElementById('feed-container');

    if (createPostForm) {
        createPostForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = document.getElementById('submit-post-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Publicando...';

            const text = document.getElementById('post-text').value;
            const code = document.getElementById('post-code').value;
            const imageFile = document.getElementById('post-image').files[0];

            const currentUser = Parse.User.current();
            if (!currentUser) {
                alert("Você precisa estar logado para publicar.");
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

                await post.save();

                // Clear form
                document.getElementById('post-text').value = '';
                document.getElementById('post-code').value = '';
                document.getElementById('post-image').value = '';
                document.getElementById('file-name').textContent = '';

                // Reload feed
                loadPosts();

            } catch (error) {
                console.error("Erro ao criar post:", error);
                alert("Erro ao criar postagem: " + error.message);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Publicar';
            }
        });
    }

    // Load Posts Function
    const loadPosts = async () => {
        if (!feedContainer) return;

        try {
            const Post = Parse.Object.extend("Post");
            const query = new Parse.Query(Post);
            query.descending("createdAt"); // Newest first
            query.limit(20);

            const posts = await query.find();

            feedContainer.innerHTML = ''; // Clear loading text

            if (posts.length === 0) {
                feedContainer.innerHTML = '<div class="text-center text-gray-500 py-8">Nenhuma postagem ainda. Seja o primeiro!</div>';
                return;
            }

            posts.forEach(post => {
                const authorName = post.get('authorName') || 'Desenvolvedor Anônimo';
                const authorPhoto = post.get('authorPhoto') || 'https://via.placeholder.com/40';
                const text = post.get('text');
                const code = post.get('code');
                const imageUrl = post.get('imageUrl');
                const date = post.createdAt.toLocaleString('pt-BR');

                const postEl = document.createElement('div');
                postEl.className = 'bg-white dark:bg-gray-800 rounded-lg shadow p-4';

                let contentHtml = `
                    <div class="flex items-center mb-4">
                        <img src="${authorPhoto}" alt="${authorName}" class="w-10 h-10 rounded-full mr-3 border border-gray-200 dark:border-gray-700">
                        <div>
                            <h4 class="font-bold text-sm">${authorName}</h4>
                            <span class="text-xs text-gray-500">${date}</span>
                        </div>
                    </div>
                `;

                if (text) {
                    contentHtml += `<p class="mb-4 text-gray-800 dark:text-gray-200 whitespace-pre-wrap">${escapeHTML(text)}</p>`;
                }

                if (code) {
                    contentHtml += `
                        <div class="mb-4 bg-gray-900 rounded-md p-3 overflow-x-auto">
                            <pre><code class="text-green-400 text-sm font-mono">${escapeHTML(code)}</code></pre>
                        </div>
                    `;
                }

                if (imageUrl) {
                    contentHtml += `
                        <div class="mb-4">
                            <img src="${imageUrl}" alt="Imagem do post" class="rounded-lg max-h-96 w-auto mx-auto object-contain">
                        </div>
                    `;
                }

                // Add simple interaction buttons (UI only for now)
                contentHtml += `
                    <div class="border-t border-gray-100 dark:border-gray-700 pt-3 flex items-center justify-between text-gray-500 dark:text-gray-400 text-sm">
                        <button class="flex items-center hover:text-blue-600 transition-colors">
                            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path></svg>
                            Curtir
                        </button>
                        <button class="flex items-center hover:text-blue-600 transition-colors">
                            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                            Comentar
                        </button>
                    </div>
                `;

                postEl.innerHTML = contentHtml;
                feedContainer.appendChild(postEl);
            });

        } catch (error) {
            console.error("Erro ao carregar postagens:", error);
            feedContainer.innerHTML = '<div class="text-center text-red-500 py-8">Erro ao carregar postagens.</div>';
        }
    };

    // Initial load
    if (window.location.pathname.includes('index.php') || window.location.pathname === '/') {
        // Wait a bit for auth to resolve
        setTimeout(() => {
            if(Parse.User.current()) {
                 loadPosts();
            }
        }, 500);
    }
});

// Helper function to prevent XSS
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g,
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag])
    );
}
