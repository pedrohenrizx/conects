<!DOCTYPE html>
<html lang="en" class="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DevConnect</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
        }
    </script>
    <script type="text/javascript" src="https://unpkg.com/parse/dist/parse.min.js"></script>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body class="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-200">

    <nav class="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <a href="/" class="text-2xl font-bold text-blue-600 dark:text-blue-400">DevConnect</a>
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
