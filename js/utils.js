export const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return `Há ${Math.floor(interval)} ano${Math.floor(interval) !== 1 ? 's' : ''}`;

    interval = seconds / 2592000;
    if (interval > 1) return `Há ${Math.floor(interval)} mês${Math.floor(interval) !== 1 ? 'es' : ''}`;

    interval = seconds / 86400;
    if (interval > 1) return `Há ${Math.floor(interval)} dia${Math.floor(interval) !== 1 ? 's' : ''}`;

    interval = seconds / 3600;
    if (interval > 1) return `Há ${Math.floor(interval)} hora${Math.floor(interval) !== 1 ? 's' : ''}`;

    interval = seconds / 60;
    if (interval > 1) return `Há ${Math.floor(interval)} min`;

    return "Agora mesmo";
};

export const escapeHTML = (str) => {
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
};
