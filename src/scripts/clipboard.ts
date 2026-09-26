// Copies text and says whether it worked. `container` hosts the fallback
// field: inside a modal <dialog> it has to be the dialog itself, because
// everything outside it is inert and can't be selected
export async function copyText(text: string, container: HTMLElement = document.body) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        // Fallback for browsers or contexts that block the Clipboard API
        const field = document.createElement("textarea");
        field.value = text;
        field.setAttribute("readonly", "");
        field.style.cssText = "position:fixed;opacity:0";
        container.append(field);
        field.select();
        const copied = document.execCommand("copy");
        field.remove();
        return copied;
    }
}
