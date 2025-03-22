// Initialize the game
function initializeGame() {
    console.log("Game initialization started");
    
    // Set initial badge tracker display state
    const badgeTracker = document.getElementById("badgeTracker");
    if (badgeTracker) {
        badgeTracker.style.display = "none";
        updateBadgeTracker();
    }
    
    // Add the random event system styles
    addRandomEventStyles();
    
    // Add lastEventGrowth property to gameState if it doesn't exist
    if (!gameState.hasOwnProperty('lastEventGrowth')) {
        gameState.lastEventGrowth = 0;
    }
    
    // Make sure all functions are available globally
    window.growTree = growTree;
    window.resetGame = resetGame;
    window.finishGame = finishGame;
    window.toggleBadgeTracker = toggleBadgeTracker;
    
    console.log("Game initialization completed");
}
// Call your original initialization
    initializeGame();

// Replace your existing load event listener with this one
window.addEventListener("load", function() {
    console.log("Window loaded");
    initializeGame();
});

// Tree evolution stages - general path
const treeStages = {
    seedling: "🌱",
    sprout: "🌿",
    sapling: "🪴",
    mature: "🌳",
    flowering: "🌲"
};

// Specialized tree paths based on focus area
const specializationPaths = {
    knowledge: ["🌱", "📚🌿", "📖🪴", "📚🌳", "🧠🌲"],
    ethics: ["🌱", "⚖️🌿", "🔍🪴", "⚖️🌳", "✨🌲"],
    data: ["🌱", "💾🌿", "💻🪴", "💾🌳", "🔢🌲"],
    innovation: ["🌱", "💡🌿", "🔬🪴", "💡🌳", "🚀🌲"],
    collaboration: ["🌱", "🤝🌿", "👥🪴", "🤝🌳", "🌐🌲"]
};

// Description themes for each path
const pathDescriptions = {
    knowledge: {
        sprout: "Your AI absorbs information, developing a foundation of knowledge.",
        sapling: "Your AI begins connecting concepts and recognizing patterns in its knowledge base.",
        mature: "Your AI demonstrates deep understanding and can apply knowledge to new situations.",
        flowering: "Your AI has achieved wisdom, exhibiting remarkable contextual understanding and reasoning."
    },
    ethics: {
        sprout: "Your AI is developing basic ethical principles and guidelines.",
        sapling: "Your AI can navigate simple ethical dilemmas with consistent reasoning.",
        mature: "Your AI applies sophisticated ethical frameworks across diverse scenarios.",
        flowering: "Your AI has developed a nuanced moral compass, balancing complex ethical considerations."
    },
    data: {
        sprout: "Your AI processes simple datasets, learning basic patterns.",
        sapling: "Your AI can handle complex data structures and identify correlations.",
        mature: "Your AI excels at predictive modeling and finding insights in massive datasets.",
        flowering: "Your AI has mastered data science, extracting profound meaning from the most complex datasets."
    },
    innovation: {
        sprout: "Your AI is exploring creative approaches to problem-solving.",
        sapling: "Your AI combines techniques in novel ways, showing promising innovation.",
        mature: "Your AI develops original solutions to complex problems.",
        flowering: "Your AI has become truly inventive, pioneering revolutionary approaches."
    },
    collaboration: {
        sprout: "Your AI learns to communicate and share resources effectively.",
        sapling: "Your AI coordinates well with other systems and human feedback.",
        mature: "Your AI enhances team effectiveness through adaptive collaboration.",
        flowering: "Your AI has become a collaborative intelligence multiplier, elevating entire networks."
    }
};

// Random Events System - Add this to your existing game.js file

// Define random events that can occur during gameplay
const randomEvents = [
    {
        id: "dataBreakthrough",
        title: "Data Breakthrough!",
        description: "Your AI has made an unexpected breakthrough in data processing!",
        effect: function() {
            gameState.focusAreas.data += 1;
            return "Data focus increased by 1!";
        },
        probability: 0.15,
        minGrowth: 3
    },
    {
        id: "ethicalDilemma",
        title: "Ethical Dilemma",
        description: "Your AI faces a complex ethical challenge...",
        effect: function() {
            // 50% chance of positive or negative outcome
            if (Math.random() > 0.5) {
                gameState.focusAreas.ethics += 1;
                return "Your AI resolves the dilemma! Ethics focus increased by 1!";
            } else {
                // Small setback
                gameState.growth = Math.max(0, gameState.growth - 1);
                return "Your AI struggles with the dilemma. Overall growth reduced slightly.";
            }
        },
        probability: 0.2,
        minGrowth: 2
    },
    {
        id: "knowledgeConnection",
        title: "Knowledge Connection",
        description: "Your AI has unexpectedly connected two distant concepts!",
        effect: function() {
            gameState.focusAreas.knowledge += 1;
            return "Knowledge focus increased by 1!";
        },
        probability: 0.15,
        minGrowth: 1
    },
    {
        id: "collaborationOpportunity",
        title: "Collaboration Opportunity",
        description: "Another system wants to collaborate with your AI!",
        effect: function() {
            gameState.focusAreas.collaboration += 1;
            return "Collaboration focus increased by 1!";
        },
        probability: 0.15,
        minGrowth: 4
    },
    {
        id: "innovationSpark",
        title: "Innovation Spark",
        description: "Your AI has generated a novel approach to an existing problem!",
        effect: function() {
            gameState.focusAreas.innovation += 1;
            return "Innovation focus increased by 1!";
        },
        probability: 0.15,
        minGrowth: 2
    },
    {
        id: "systemGlitch",
        title: "System Glitch",
        description: "Your AI has encountered an unexpected error in its processing...",
        effect: function() {
            // Random focus area takes a hit
            const areas = Object.keys(gameState.focusAreas);
            const randomArea = areas[Math.floor(Math.random() * areas.length)];
            gameState.focusAreas[randomArea] = Math.max(0, gameState.focusAreas[randomArea] - 1);
            return `${randomArea} focus decreased by 1 due to the glitch.`;
        },
        probability: 0.1,
        minGrowth: 3
    },
    {
        id: "trainingBoost",
        title: "Training Boost",
        description: "Your AI's training cycle has yielded exceptional results!",
        effect: function() {
            gameState.growth += 1;
            return "Overall growth increased by 1!";
        },
        probability: 0.2,
        minGrowth: 1
    },
    {
        id: "expertCollaboration",
        title: "Expert Collaboration",
        description: "An expert in the field has contributed to your AI's development!",
        effect: function() {
            // Boost the dominant path, or a random path if no dominant path
            if (gameState.dominantPath) {
                gameState.focusAreas[gameState.dominantPath] += 1;
                return `${gameState.dominantPath} focus increased by 1!`;
            } else {
                const areas = Object.keys(gameState.focusAreas);
                const randomArea = areas[Math.floor(Math.random() * areas.length)];
                gameState.focusAreas[randomArea] += 1;
                return `${randomArea} focus increased by 1!`;
            }
        },
        probability: 0.1,
        minGrowth: 5
    }
];

// Function to check if a random event should occur
function checkForRandomEvent() {
    // Don't trigger events too frequently
    if (gameState.lastEventGrowth && 
        (gameState.growth - gameState.lastEventGrowth < 2)) {
        return null;
    }
    
    // Filter eligible events based on current growth level
    const eligibleEvents = randomEvents.filter(event => 
        event.minGrowth <= gameState.growth);
        
    if (eligibleEvents.length === 0) return null;
    
    // Determine if any event should trigger based on probability
    for (const event of eligibleEvents) {
        if (Math.random() <= event.probability) {
            // Mark when this event occurred
            gameState.lastEventGrowth = gameState.growth;
            return event;
        }
    }
    
    return null;
}

// Function to display the event modal
function showEventModal(event) {
    // Create modal container if it doesn't exist
    let modal = document.getElementById("eventModal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "eventModal";
        modal.style.position = "fixed";
        modal.style.left = "0";
        modal.style.top = "0";
        modal.style.width = "100%";
        modal.style.height = "100%";
        modal.style.backgroundColor = "rgba(0,0,0,0.5)";
        modal.style.display = "flex";
        modal.style.justifyContent = "center";
        modal.style.alignItems = "center";
        modal.style.zIndex = "1000";
        document.body.appendChild(modal);
    } else {
        modal.innerHTML = "";
        modal.style.display = "flex";
    }
    
    // Create modal content
    const modalContent = document.createElement("div");
    modalContent.style.backgroundColor = "white";
    modalContent.style.padding = "20px";
    modalContent.style.borderRadius = "10px";
    modalContent.style.maxWidth = "400px";
    modalContent.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    modalContent.style.textAlign = "center";
    modalContent.style.position = "relative";
    
    // Add event icon based on ID (could be enhanced with custom icons)
    let eventIcon = "🔄";  // Default icon
    if (event.id.includes("data")) eventIcon = "💾";
    else if (event.id.includes("ethics")) eventIcon = "⚖️";
    else if (event.id.includes("knowledge")) eventIcon = "📚";
    else if (event.id.includes("collaboration")) eventIcon = "🤝";
    else if (event.id.includes("innovation")) eventIcon = "💡";
    else if (event.id.includes("glitch")) eventIcon = "⚠️";
    else if (event.id.includes("training")) eventIcon = "📈";
    else if (event.id.includes("expert")) eventIcon = "👩‍🔬";
    
    // Create header with icon
    const header = document.createElement("h2");
    header.innerHTML = `${eventIcon} ${event.title}`;
    header.style.color = "#4caf50";
    modalContent.appendChild(header);
    
    // Create description
    const description = document.createElement("p");
    description.textContent = event.description;
    modalContent.appendChild(description);
    
    // Execute the event effect and show the result
    const resultText = event.effect();
    const result = document.createElement("p");
    result.textContent = resultText;
    result.style.fontWeight = "bold";
    result.style.color = "#673ab7";
    modalContent.appendChild(result);
    
    // Add close button
    const closeButton = document.createElement("button");
    closeButton.textContent = "Continue";
    closeButton.style.padding = "10px 20px";
    closeButton.style.marginTop = "15px";
    closeButton.style.background = "#4caf50";
    closeButton.style.color = "white";
    closeButton.style.border = "none";
    closeButton.style.borderRadius = "5px";
    closeButton.style.cursor = "pointer";
    closeButton.onclick = function() {
        modal.style.display = "none";
        // Update game state after event
        updateTreeStage();
        updateBadgeTracker();
        updateDominantPath();
        updatePathLabel();
    };
    modalContent.appendChild(closeButton);
    
    // Add to modal
    modal.appendChild(modalContent);
    
    // Add a subtle entrance animation
    modalContent.style.transform = "scale(0.8)";
    modalContent.style.opacity = "0";
    modalContent.style.transition = "all 0.3s ease-out";
    
    // Trigger animation after a tiny delay
    setTimeout(() => {
        modalContent.style.transform = "scale(1)";
        modalContent.style.opacity = "1";
    }, 10);
}

    // Determine dominant path (highest focus area)
    updateDominantPath();
    
    // Award badge if not already earned
    if (!gameState.badges[choice]) {
        gameState.badges[choice] = true;
        updateBadgeTracker();
    }
    
    // Update tree appearance based on growth level and dominant path
    updateTreeStage();
    
   // Rest of your existing function...
// Add CSS for the modal
function addRandomEventStyles() {
    const style = document.createElement('style');
    style.textContent = `
        #eventModal {
            transition: background-color 0.3s;
        }
        #eventModal button:hover {
            background-color: #45a049 !important;
        }
    `;
    document.head.appendChild(style);
}

// Handle tree growth based on choice
function growTree(choice) {
    console.log("growTree function called with choice:", choice);
    
    let tree = document.getElementById("tree");
    let description = document.getElementById("description");
    
    // Increment growth
    gameState.growth += 1;
    
    // Increment focus area
    gameState.focusAreas[choice] += 1;

    // Check if a random event should occur
const randomEvent = checkForRandomEvent();
if (randomEvent) {
    setTimeout(() => {
        showEventModal(randomEvent);
    }, 500); // Short delay for better user experience
}}
    
    // Determine dominant path (highest focus area)
    updateDominantPath();
    
    // Award badge if not already earned
    if (!gameState.badges[choice]) {
        gameState.badges[choice] = true;
        updateBadgeTracker();
    }
    
    // Update tree appearance based on growth level and dominant path
    updateTreeStage();
    
    // Update description based on choice and current stage
    if (tree && description) {
        const messages = {
            knowledge: "Your AI tree absorbs knowledge and grows wiser!",
            ethics: "Your AI tree develops a strong ethical framework!",
            data: "Your AI tree processes the data and learns patterns!",
            innovation: "Your AI tree evolves with innovative capabilities!",
            collaboration: "Your AI tree grows stronger through collaboration!"
        };
        
        // If we have a stage-specific description for the dominant path, use it
        if (gameState.dominantPath && gameState.stage !== "seedling") {
            const stageDescriptions = pathDescriptions[gameState.dominantPath];
            if (stageDescriptions && stageDescriptions[gameState.stage]) {
                description.textContent = stageDescriptions[gameState.stage];
            } else {
                description.textContent = messages[choice] || "Your AI tree is growing!";
            }
        } else {
            description.textContent = messages[choice] || "Your AI tree is growing!";
        }
    }
}

// Determine which path has the highest focus
function updateDominantPath() {
    let maxFocus = 0;
    let dominantPath = null;
    
    // Find the area with highest focus
    for (const [area, value] of Object.entries(gameState.focusAreas)) {
        if (value > maxFocus) {
            maxFocus = value;
            dominantPath = area;
        }
    }
    
    // Only set a dominant path if at least 2 points are in that area
    if (maxFocus >= 2) {
        gameState.dominantPath = dominantPath;
    }
}

// Update tree visual stage based on growth and dominant path
function updateTreeStage() {
    const tree = document.getElementById("tree");
    if (tree) {
        // Determine stage based on growth level
        let stage;
        if (gameState.growth >= 12) {
            stage = "flowering";
        } else if (gameState.growth >= 8) {
            stage = "mature";
        } else if (gameState.growth >= 5) {
            stage = "sapling";
        } else if (gameState.growth >= 1) {
            stage = "sprout";
        } else {
            stage = "seedling";
        }
        
        gameState.stage = stage;
        
        // Select tree appearance based on dominant path and stage
        let treeEmoji;
        const stageIndex = ["seedling", "sprout", "sapling", "mature", "flowering"].indexOf(stage);
        
        if (gameState.dominantPath && stageIndex >= 0) {
            // Use specialized path
            treeEmoji = specializationPaths[gameState.dominantPath][stageIndex];
        } else {
            // Use general path
            treeEmoji = treeStages[stage];
        }
        
        tree.textContent = treeEmoji;
        
        // Update path label if we have a dominant path
        updatePathLabel();
        
        // Add a small animation effect when tree grows
        tree.style.transform = "scale(1.1)";
        setTimeout(() => {
            tree.style.transform = "scale(1)";
        }, 300);
    }
}

// Update or create the path label to show specialization
function updatePathLabel() {
    // Find or create the path label element
    let pathLabel = document.getElementById("pathLabel");
    if (!pathLabel) {
        pathLabel = document.createElement("div");
        pathLabel.id = "pathLabel";
        pathLabel.style.fontWeight = "bold";
        pathLabel.style.marginTop = "10px";
        pathLabel.style.color = "#3a7d44";
        
        // Insert after description
        const description = document.getElementById("description");
        if (description && description.parentNode) {
            description.parentNode.insertBefore(pathLabel, description.nextSibling);
        }
    }
    
    // Set the content based on dominant path
    if (gameState.dominantPath && gameState.stage !== "seedling") {
        const pathNames = {
            knowledge: "Knowledge Path: Analytical Intelligence",
            ethics: "Ethics Path: Moral Intelligence",
            data: "Data Path: Computational Intelligence",
            innovation: "Innovation Path: Creative Intelligence",
            collaboration: "Collaboration Path: Social Intelligence"
        };
        
        pathLabel.textContent = pathNames[gameState.dominantPath] || "";
        pathLabel.style.display = "block";
    } else {
        pathLabel.style.display = "none";
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
                <div>Focus Level: ${gameState.focusAreas[badge.id]}</div>
            `;
            tracker.appendChild(badgeDiv);
        });

        // Show current specialization path
        if (gameState.dominantPath) {
            const pathInfo = document.createElement("div");
            pathInfo.style.marginTop = "20px";
            pathInfo.style.padding = "10px";
            pathInfo.style.backgroundColor = "#e8f5e9";
            pathInfo.style.borderRadius = "5px";
            
            const pathNames = {
                knowledge: "Knowledge Path: Analytical Intelligence",
                ethics: "Ethics Path: Moral Intelligence",
                data: "Data Path: Computational Intelligence",
                innovation: "Innovation Path: Creative Intelligence",
                collaboration: "Collaboration Path: Social Intelligence"
            };
            
            pathInfo.innerHTML = `
                <strong>Current Specialization:</strong> ${pathNames[gameState.dominantPath]}
                <div>Your AI is developing a specialty based on your focus choices.</div>
            `;
            
            tracker.appendChild(pathInfo);
        }
    }
}

// Finish the game and show summary
function finishGame() {
    const earnedBadges = Object.values(gameState.badges).filter(value => value).length;
    const summary = document.getElementById("summary");
    
    // Generate message based on badges and dominant path
    let message = "";
    
    if (gameState.dominantPath) {
        const pathMessages = {
            knowledge: "Your AI has specialized in knowledge processing and analytical intelligence. It excels at learning, reasoning, and problem-solving with deep understanding.",
            ethics: "Your AI has specialized in ethical reasoning and moral intelligence. It excels at making principled decisions that balance complex human values.",
            data: "Your AI has specialized in data processing and computational intelligence. It excels at finding patterns and extracting insights from vast datasets.",
            innovation: "Your AI has specialized in innovative thinking and creative intelligence. It excels at developing original solutions and adapting to new challenges.",
            collaboration: "Your AI has specialized in collaborative systems and social intelligence. It excels at working with humans and other systems in harmonious ways."
        };
        
        message = `🌟 ${pathMessages[gameState.dominantPath]}\n\n`;
    }
    
    if (earnedBadges === 5) {
        message += "You've mastered all aspects of AI development! Your balanced approach has created a well-rounded system.";
    } else if (earnedBadges >= 3) {
        message += "Great job! Your AI has developed well with good coverage across multiple domains.";
    } else if (earnedBadges >= 1) {
        message += "Good start! Your AI has begun its journey but has room to grow in other areas.";
    } else {
        message += "Your AI tree needs more nurturing to reach its potential.";
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
        stage: "seedling",
        focusAreas: {
            knowledge: 0,
            ethics: 0,
            data: 0,
            innovation: 0,
            collaboration: 0
        },
        dominantPath: null
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
        
        // Hide path label
        const pathLabel = document.getElementById("pathLabel");
        if (pathLabel) {
            pathLabel.style.display = "none";
        }
        
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
