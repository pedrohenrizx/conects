<?php require_once __DIR__ . '/../includes/header.php'; ?>
<?php require_once __DIR__ . '/../includes/sidebar.php'; ?>

        <main class="w-full md:w-3/4">

            <!-- Create Post Area -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
                <h2 class="text-lg font-semibold mb-4">Criar Postagem</h2>
                <form id="create-post-form">
                    <textarea id="post-text" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" rows="3" placeholder="No que você está pensando?"></textarea>

                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-1">Trecho de Código (Opcional)</label>
                        <textarea id="post-code" class="w-full p-3 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded bg-gray-900 text-green-400 focus:outline-none focus:ring-2 focus:ring-blue-500" rows="4" placeholder="Cole seu código aqui..."></textarea>
                    </div>

                    <div class="flex items-center justify-between">
                        <div>
                            <label for="post-image" class="cursor-pointer text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                Adicionar Imagem
                            </label>
                            <input type="file" id="post-image" accept="image/*" class="hidden">
                            <span id="file-name" class="text-xs text-gray-500 ml-2"></span>
                        </div>
                        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition-colors duration-200 disabled:opacity-50" id="submit-post-btn">Publicar</button>
                    </div>
                </form>
            </div>

            <!-- Feed Area -->
            <div id="feed-container" class="space-y-6">
                <!-- Posts will be injected here -->
                <div class="text-center text-gray-500 dark:text-gray-400 py-8">Carregando postagens...</div>
            </div>

        </main>

<script>
    document.getElementById('post-image').addEventListener('change', function() {
        document.getElementById('file-name').textContent = this.files[0] ? this.files[0].name : '';
    });
</script>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>