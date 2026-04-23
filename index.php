<!DOCTYPE html>
<html lang="en" class="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Feed - DevConnect</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
        }
    </script>
    <script type="text/javascript" src="https://unpkg.com/parse/dist/parse.min.js"></script>
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-200">

    <nav class="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">DevConnect</span>
                </div>
                <div class="flex items-center space-x-4">
                    <button id="theme-toggle" class="p-2 bg-gray-200 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <svg class="w-5 h-5 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                        </svg>
                    </button>
                    <button id="logout-btn" class="text-sm bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors duration-200">Sair</button>
                </div>
            </div>
        </div>
    </nav>

    <div class="max-w-4xl mx-auto mt-8 px-4 flex flex-col md:flex-row gap-6">

        <!-- Sidebar (Optional, maybe for groups/nav later) -->
        <aside class="w-full md:w-1/4 hidden md:block">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sticky top-24">
                <h3 class="font-semibold text-lg mb-4 text-gray-700 dark:text-gray-300">Navegação</h3>
                <ul class="space-y-2">
                    <li><a href="#" class="text-blue-600 dark:text-blue-400 font-medium">Feed</a></li>
                    <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-600">Grupos</a></li>
                    <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-600">Mensagens</a></li>
                    <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-600">Perfil</a></li>
                </ul>
            </div>
        </aside>

        <!-- Main Content -->
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
    </div>

    <script src="js/theme.js"></script>
    <script type="module" src="js/config.js"></script>
    <script type="module" src="js/auth.js"></script>
    <script type="module" src="js/app.js"></script>
    <script>
        document.getElementById('post-image').addEventListener('change', function() {
            document.getElementById('file-name').textContent = this.files[0] ? this.files[0].name : '';
        });
    </script>
</body>
</html>
