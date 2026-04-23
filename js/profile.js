import { showToast } from './toast.js';
import { timeAgo, escapeHTML } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Only run on profile page
    if (window.location.pathname !== '/profile') return;

    const bioInput = document.getElementById('profile-bio');
    const githubInput = document.getElementById('profile-github');
    const linkedinInput = document.getElementById('profile-linkedin');
    const form = document.getElementById('profile-form');
    const saveBtn = document.getElementById('profile-save-btn');

    let currentUser = null;

    // Load User Data
    const loadUserData = async () => {
        currentUser = Parse.User.current();
        if (!currentUser) return;

        // Fetch latest data to ensure we have the custom fields
        try {
            await currentUser.fetch();
        } catch (error) {
            console.error("Error fetching user data:", error);
        }

        document.getElementById('profile-name').textContent = currentUser.get('displayName') || currentUser.get('username');
        document.getElementById('profile-email').textContent = currentUser.get('email') || '';
        document.getElementById('profile-avatar').src = currentUser.get('photoURL') || 'https://via.placeholder.com/100';

        bioInput.value = currentUser.get('bio') || '';
        githubInput.value = currentUser.get('githubUrl') || '';
        linkedinInput.value = currentUser.get('linkedinUrl') || '';

        loadUserStatsAndPosts();
    };

    // Wait slightly for Parse to be ready
    setTimeout(loadUserData, 500);

    // Save User Data
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!currentUser) return;

            saveBtn.disabled = true;
            saveBtn.textContent = 'Salvando...';

            currentUser.set('bio', bioInput.value.trim());
            currentUser.set('githubUrl', githubInput.value.trim());
            currentUser.set('linkedinUrl', linkedinInput.value.trim());

            try {
                await currentUser.save();
                showToast('Perfil atualizado com sucesso!');
            } catch (error) {
                console.error("Erro ao salvar perfil:", error);
                showToast('Erro ao atualizar perfil.', 'error');
            } finally {
                saveBtn.disabled = false;
                saveBtn.textContent = 'Salvar Alterações';
            }
        });
    }

    // Load Personal Feed and Stats
    const loadUserStatsAndPosts = async () => {
        const feedContainer = document.getElementById('personal-feed-container');
        const countSpan = document.getElementById('profile-post-count');
        if (!feedContainer || !currentUser) return;

        try {
            const Post = Parse.Object.extend("Post");
            const query = new Parse.Query(Post);
            query.equalTo("author", currentUser);
            query.descending("createdAt");

            const posts = await query.find();

            // Update stats
            countSpan.textContent = posts.length;

            feedContainer.innerHTML = '';

            if (posts.length === 0) {
                feedContainer.innerHTML = `
                <div class="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <p class="text-gray-500">Você ainda não fez nenhuma postagem.</p>
                </div>`;
                return;
            }

            posts.forEach(post => {
                const text = post.get('text');
                const code = post.get('code');
                const imageUrl = post.get('imageUrl');
                const date = timeAgo(post.createdAt);
                const likes = post.get('likes') || [];

                const postEl = document.createElement('div');
                postEl.className = 'bg-white dark:bg-gray-800 rounded-lg shadow p-5';

                let contentHtml = `
                    <div class="flex items-center justify-between mb-4">
                        <span class="text-xs text-gray-500 dark:text-gray-400">Publicado ${date}</span>
                    </div>
                `;

                if (text) contentHtml += `<p class="mb-4 text-gray-800 dark:text-gray-200 text-sm">${escapeHTML(text)}</p>`;

                if (code) {
                    contentHtml += `
                        <div class="mb-4">
                            <pre><code class="rounded-lg text-sm !bg-gray-900 border border-gray-700">${escapeHTML(code)}</code></pre>
                        </div>
                    `;
                }

                if (imageUrl) {
                    contentHtml += `
                        <div class="mb-4">
                            <img src="${imageUrl}" class="rounded-lg max-h-48 w-auto object-contain border border-gray-100 dark:border-gray-700">
                        </div>
                    `;
                }

                contentHtml += `
                    <div class="border-t border-gray-100 dark:border-gray-700 pt-2 flex items-center text-gray-500 text-sm">
                        <span class="flex items-center">
                            <svg class="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path></svg>
                            ${likes.length} Curtidas
                        </span>
                    </div>
                `;

                postEl.innerHTML = contentHtml;
                feedContainer.appendChild(postEl);
            });

            if (window.hljs) {
                document.querySelectorAll('pre code').forEach((block) => hljs.highlightElement(block));
            }

        } catch (error) {
            console.error("Erro ao carregar postagens pessoais:", error);
            feedContainer.innerHTML = '<div class="text-center text-red-500 py-4">Erro ao carregar postagens.</div>';
        }
    };
});