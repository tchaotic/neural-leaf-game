// Initialize game state
let gameState = {
    growth: 0,
    badges: {
        knowledge: false,
        ethics: false,
        data: false,
        innovation: false,
        collaboration: false
    },
    stage: "seedling"
};

// Tree evolution stages
const treeStages = {
    seedling: "🌱",
    sprout: "🌿",
    sapling: "🪴",
    mature: "🌳",
    flowering: "🌲"
};

// Execute when DOM is fully loaded
window.addEventListener("load", function () {
    console.log("Neural Leaf Game Script Loaded!");
    initializeGame();
});

// Initialize the game
function initializeGame() {
    // Set initial badge tracker display state
    const badgeTracker = document.getElementById("badgeTracker");
    if (badgeTracker) {
        badgeTracker.style.display = "none";
        updateBadgeTracker();
    }
    
    // Make sure all functions are available globally
    window.growTree = growTree;
    window.resetGame = resetGame;
    window.finishGame = finishGame;
    window.toggleBadgeTracker = toggleBadgeTracker;
}

// Handle tree growth based on choice
function growTree(choice) {
    console.log("growTree function called with choice:", choice);
    
    let tree = document.getElementById("tree");
    let description = document.getElementById("description");
    
    // Increment growth
    gameState.growth += 1;
    
    // Award badge if not already earned
    if (!gameState.badges[choice]) {
        gameState.badges[choice] = true;
        updateBadgeTracker();
    }
    
    // Update tree appearance based on growth level
    updateTreeStage();
    
    // Update description based on choice
    if (tree && description) {
        const messages = {
            knowledge: "Your AI tree absorbs knowledge and grows wiser!",
            ethics: "Your AI tree develops a strong ethical framework!",
            data: "Your AI tree processes the data and learns patterns!",
            innovation: "Your AI tree evolves with innovative capabilities!",
            collaboration: "Your AI tree grows stronger through collaboration!"
        };
        
        description.textContent = messages[choice] || "Your AI tree is growing!";
    }
}

// Update tree visual stage based on growth
function updateTreeStage() {
    const tree = document.getElementById("tree");
    if (tree) {
        if (gameState.growth >= 12) {
            gameState.stage = "flowering";
            tree.textContent = treeStages.flowering;
        } else if (gameState.growth >= 8) {
            gameState.stage = "mature";
            tree.textContent = treeStages.mature;
        } else if (gameState.growth >= 5) {
            gameState.stage = "sapling";
            tree.textContent = treeStages.sapling;
        } else if (gameState.growth >= 1) {
            gameState.stage = "sprout";
            tree.textContent = treeStages.sprout;
        } else {
            gameState.stage = "seedling";
            tree.textContent = treeStages.seedling;
        }
        
        // Add a small animation effect when tree grows
        tree.style.transform = "scale(1.1)";
        setTimeout(() => {
            tree.style.transform = "scale(1)";
        }, 300);
    }
}

// Update the badge tracker display
function updateBadgeTracker() {
    const tracker = document.getElementById("badgeTracker");
    if (tracker) {
        // Clear current content
        tracker.innerHTML = "";
        
        // Add header
        const header = document.createElement("h3");
        header.textContent = "AI Development Badges";
        tracker.appendChild(header);
        
        // Create badges
        const badges = [
            { id: "knowledge", name: "Knowledge Master", description: "Feed your AI with quality knowledge" },
            { id: "ethics", name: "Ethics Guardian", description: "Guide your AI with strong ethical principles" },
            { id: "data", name: "Data Scientist", description: "Train your AI with diverse datasets" },
            { id: "innovation", name: "Innovation Pioneer", description: "Enhance your AI with cutting-edge techniques" },
            { id: "collaboration", name: "Collaboration Expert", description: "Improve your AI through teamwork" }
        ];
        
        badges.forEach(badge => {
            const badgeDiv = document.createElement("div");
            badgeDiv.className = "badge";
            badgeDiv.innerHTML = `
                <strong>${badge.name}</strong>: ${badge.description}
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${gameState.badges[badge.id] ? '100%' : '0%'}; 
                         background-color: ${gameState.badges[badge.id] ? '#4caf50' : '#ccc'}"></div>
                </div>
            `;
            tracker.appendChild(badgeDiv);
        });
    }
}

// Finish the game and show summary
function finishGame() {
    const earnedBadges = Object.values(gameState.badges).filter(value => value).length;
    const summary = document.getElementById("summary");
    
    let message = "";
    if (earnedBadges === 5) {
        message = "🌟 Spectacular! You've mastered all aspects of AI development!";
    } else if (earnedBadges >= 3) {
        message = "🌟 Great job! Your AI has developed well with balanced growth!";
    } else if (earnedBadges >= 1) {
        message = "🌟 Good start! Your AI has begun its journey but has room to grow.";
    } else {
        message = "🌟 Your AI tree needs more nurturing to reach its potential.";
    }
    
    summary.textContent = message;
    document.getElementById("resetBtn").style.display = "inline-block";
    document.getElementById("finishBtn").style.display = "none";
}

// Reset the game to initial state
function resetGame() {
    // Reset game state
    gameState = {
        growth: 0,
        badges: {
            knowledge: false,
            ethics: false,
            data: false,
            innovation: false,
            collaboration: false
        },
        stage: "seedling"
    };
    
    // Reset UI
    const tree = document.getElementById("tree");
    const description = document.getElementById("description");
    
    if (tree && description) {
        tree.textContent = treeStages.seedling;
        description.textContent = "Your AI tree is evolving based on your choices.";
        document.getElementById("summary").textContent = "";
        document.getElementById("resetBtn").style.display = "none";
        document.getElementById("finishBtn").style.display = "inline-block";
        updateBadgeTracker();
    }
}

// Toggle badge tracker visibility
function toggleBadgeTracker() {
    const tracker = document.getElementById("badgeTracker");
    if (tracker) {
        // Check current computed style since inline style might not be set
        const currentDisplay = window.getComputedStyle(tracker).display;
        tracker.style.display = currentDisplay === "none" ? "block" : "none";
    }
}
