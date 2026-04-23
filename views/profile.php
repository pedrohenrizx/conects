<?php require_once __DIR__ . '/../includes/header.php'; ?>
<?php require_once __DIR__ . '/../includes/sidebar.php'; ?>

<main class="w-full md:w-3/4">
    <!-- Profile Header / Edit Form -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div class="flex items-start gap-4 mb-6 border-b border-gray-100 dark:border-gray-700 pb-6">
            <img id="profile-avatar" src="https://via.placeholder.com/100" alt="Avatar" class="w-24 h-24 rounded-full border-4 border-blue-50 dark:border-gray-700 object-cover">
            <div class="flex-1">
                <h2 id="profile-name" class="text-2xl font-bold text-gray-900 dark:text-white">Carregando...</h2>
                <p id="profile-email" class="text-gray-500 text-sm mb-2"></p>
                <div class="flex gap-4 mt-2">
                    <div class="text-center bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded">
                        <span id="profile-post-count" class="block font-bold text-blue-600 dark:text-blue-400">0</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400">Posts</span>
                    </div>
                </div>
            </div>
        </div>

        <form id="profile-form" class="space-y-4">
            <div>
                <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Bio (Sobre você)</label>
                <textarea id="profile-bio" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" rows="3" placeholder="Desenvolvedor Fullstack apaixonado por código limpo..."></textarea>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">URL do GitHub</label>
                    <input type="url" id="profile-github" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" placeholder="https://github.com/seunome">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">URL do LinkedIn</label>
                    <input type="url" id="profile-linkedin" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" placeholder="https://linkedin.com/in/seunome">
                </div>
            </div>
            <div class="flex justify-end pt-2">
                <button type="submit" id="profile-save-btn" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition-colors duration-200 shadow-sm disabled:opacity-50">
                    Salvar Alterações
                </button>
            </div>
        </form>
    </div>

    <!-- Personal Feed -->
    <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">Minhas Postagens</h3>
    <div id="personal-feed-container" class="space-y-6">
        <div class="text-center text-gray-500 dark:text-gray-400 py-8">Carregando suas postagens...</div>
    </div>
</main>

<script type="module" src="/js/profile.js"></script>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>