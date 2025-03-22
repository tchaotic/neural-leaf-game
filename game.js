window.addEventListener("load", function () {
    setTimeout(() => {
        console.log("Neural Leaf Game Script Loaded!");

        let stage = 0;
        const stages = ["🌱", "🌿", "🌾", "🌲", "🌳", "🌳✨", "🌳🤖", "🌳🌟"];
        const messages = [
            "Your AI tree is evolving based on your choices.",
            "Sprouting with fresh knowledge!",
            "Early AI Integration is underway.",
            "Expanding AI Knowledge!",
            "Building with ethical guidance.",
            "Innovation drives new growth!",
            "Human-AI collaboration at its best!",
            "You've reached Advanced Neural Growth!"
        ];

        window.growTree = function(choice) {
            console.log("growTree called with choice:", choice);

            if (stage < stages.length - 1) {
                stage++;
                document.getElementById("tree").textContent = stages[stage];
                document.getElementById("description").textContent = messages[stage];
            }
        };

        window.finishGame = function() {
            document.getElementById("summary").textContent = 
              "🌟 Final Summary: You’ve grown your AI tree!";
            document.getElementById("resetBtn").style.display = "inline-block";
        };

        window.resetGame = function() {
            stage = 0;
            document.getElementById("tree").textContent = stages[stage];
            document.getElementById("description").textContent = messages[stage];
            document.getElementById("summary").textContent = "";
            document.getElementById("resetBtn").style.display = "none";
        };

        window.toggleBadgeTracker = function() {
            const tracker = document.getElementById("badgeTracker");
            if (tracker) {
                tracker.style.display = tracker.style.display === "none" ? "block" : "none";
            }
        };
    }, 300);
});
