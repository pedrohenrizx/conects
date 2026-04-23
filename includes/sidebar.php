        <aside class="w-full md:w-1/4 hidden md:block">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sticky top-24">
                <h3 class="font-semibold text-lg mb-4 text-gray-700 dark:text-gray-300">Navegação</h3>
                <ul class="space-y-2">
                    <li><a href="/" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 font-medium <?= $_SERVER['REQUEST_URI'] == '/' ? 'text-blue-600 dark:text-blue-400' : '' ?>">Feed</a></li>
                    <li><a href="/groups" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 <?= strpos($_SERVER['REQUEST_URI'], '/groups') !== false ? 'text-blue-600 dark:text-blue-400' : '' ?>">Grupos</a></li>
                    <li><a href="/messages" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 <?= strpos($_SERVER['REQUEST_URI'], '/messages') !== false ? 'text-blue-600 dark:text-blue-400' : '' ?>">Mensagens</a></li>
                    <li><a href="/profile" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 <?= strpos($_SERVER['REQUEST_URI'], '/profile') !== false ? 'text-blue-600 dark:text-blue-400' : '' ?>">Perfil</a></li>
                </ul>
            </div>
        </aside>
