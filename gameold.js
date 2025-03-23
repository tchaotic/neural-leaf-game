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

        // Attach all button listeners safely
        document.getElementById("btnKnowledge").addEventListener("click", () => growTree("knowledge"));
        document.getElementById("btnEthics").addEventListener("click", () => growTree("ethics"));
        document.getElementById("btnData").addEventListener("click", () => growTree("data"));
        document.getElementById("btnInnovation").addEventListener("click", () => growTree("innovation"));
        document.getElementById("btnCollab").addEventListener("click", () => growTree("collaboration"));
        document.getElementById("resetBtn").addEventListener("click", resetGame);
        document.getElementById("finishBtn").addEventListener("click", finishGame);

        window.growTree = function(choice) {
            console.log("growTree called with:", choice);
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
