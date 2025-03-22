window.addEventListener("load", function () {
    setTimeout(() => {
        console.log("Neural Leaf Game Script Loaded!");

        window.growTree = function(choice) {
            console.log("growTree function called with choice:", choice);
            let tree = document.getElementById("tree");
            let description = document.getElementById("description");
            if (tree && description) {
                tree.textContent = "🌿";
                description.textContent = "Your AI tree is growing!";
            }
        };

        window.finishGame = function() {
            document.getElementById("summary").textContent = "🌟 Final Summary: You’ve grown your AI tree!";
            document.getElementById("resetBtn").style.display = "inline-block";
        };

        window.resetGame = function() {
            let tree = document.getElementById("tree");
            let description = document.getElementById("description");
            if (tree && description) {
                tree.textContent = "🌱";
                description.textContent = "Your AI tree is evolving based on your choices.";
                document.getElementById("summary").textContent = "";
                document.getElementById("resetBtn").style.display = "none";
            }
        };

        window.toggleBadgeTracker = function() {
            let tracker = document.getElementById("badgeTracker");
            if (tracker) {
                tracker.style.display = tracker.style.display === "none" ? "block" : "none";
            }
        };
    }, 300);
});