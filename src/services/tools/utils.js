export function reloadPage() {
    setTimeout(() => {
        window.history.back();
        setTimeout(() => {
            window.location.reload();
        }, 100);
    }, 100);
}