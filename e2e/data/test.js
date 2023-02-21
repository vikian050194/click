document.addEventListener("DOMContentLoaded", async () => {
    const $message = document.getElementById("message");
    const $action = document.getElementById("action");

    $action.addEventListener("click", () => {
        $message.innerText = "after";
    });
});
