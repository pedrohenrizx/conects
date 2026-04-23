<?php require_once __DIR__ . '/../includes/header.php'; ?>
<?php require_once __DIR__ . '/../includes/sidebar.php'; ?>

        <main class="w-full md:w-3/4">

            <!-- Create Post Area -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6 transition-all duration-300 hover:shadow-md">
                <h2 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Criar Postagem</h2>
                <form id="create-post-form">
                    <div class="relative mb-4">
                        <textarea id="post-text" class="w-full p-3 pb-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden transition-all duration-200" rows="2" placeholder="No que você está pensando?" maxlength="500"></textarea>
                        <span id="char-counter" class="absolute bottom-2 right-3 text-xs text-gray-400">0/500</span>
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Trecho de Código (Opcional)</label>
                        <textarea id="post-code" class="w-full p-3 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-900 text-green-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y" rows="3" placeholder="Cole seu código aqui..."></textarea>
                    </div>

                    <!-- Image Preview Area -->
                    <div id="image-preview-container" class="mb-4 relative hidden inline-block">
                        <img id="image-preview" src="" class="rounded-lg max-h-48 border border-gray-200 dark:border-gray-700 object-contain">
                        <button type="button" id="remove-image-btn" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <div class="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-3 mt-2">
                        <div>
                            <label for="post-image" class="cursor-pointer text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center transition-colors px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-gray-700">
                                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                Adicionar Imagem
                            </label>
                            <input type="file" id="post-image" accept="image/*" class="hidden">
                        </div>
                        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm" id="submit-post-btn" disabled>Publicar</button>
                    </div>
                </form>
            </div>

            <!-- Feed Area -->
            <div id="feed-container" class="space-y-6">
                <!-- Posts will be injected here -->
                <div class="text-center text-gray-500 dark:text-gray-400 py-8">Carregando postagens...</div>
            </div>

        </main>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>