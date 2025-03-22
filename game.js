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
            console.log("Game finished");
            document.getElementById("summary").textContent = "🌟 Final Summary: You’ve grown your AI tree!";
            document.getElementById("resetBtn").style.display = "inline-block";
        };

        window.resetGame = function() {
            console.log("Game reset");
            let tree = document.getElementById("tree");
            let description = document.getElementById("description");
            if (tree && description) {
                tree.textContent = "🌱";
                description.textContent = "Your AI tree is evolving.";
                document.getElementById("summary").textContent = "";
                document.getElementById("resetBtn").style.display = "none";
            }
        };

        window.toggleBadgeTracker = function() {
            console.log("Toggling Badge Tracker");
            let tracker = document.getElementById("badgeTracker");
            if (tracker) {
                tracker.style.display = tracker.style.display === "none" ? "block" : "none";
            }
        };
    }, 300);
});