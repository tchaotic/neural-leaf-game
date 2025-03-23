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
    stage: "seedling",
    focusAreas: {
        knowledge: 0,
        ethics: 0,
        data: 0,
        innovation: 0,
        collaboration: 0
    },
    dominantPath: null,
    lastEventGrowth: 0
};

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

// Initialize the game
function initializeGame() {
    // Set initial badge tracker display state
    const badgeTracker = document.getElementById("badgeTracker");
    if (badgeTracker) {
        badgeTracker.style.display = "none";
        updateBadgeTracker();
    }
    
    // Make sure all functions are available globally
    // No need to reassign growTree since it's already defined as a function
    window.resetGame = resetGame;
    window.finishGame = finishGame;
    window.toggleBadgeTracker = toggleBadgeTracker;
}

// Update initializeGame function to add these modifications
function enhancedInitializeGame() {
    // Add the random event system styles
    addRandomEventStyles();
    
    // Add lastEventGrowth property to gameState if it doesn't exist
    if (!gameState.hasOwnProperty('lastEventGrowth')) {
        gameState.lastEventGrowth = 0;
    }
    
    // Call your original initialization
    initializeGame();
}

// Replace your existing load event listener with this one
window.addEventListener("load", function () {
    console.log("Enhanced Neural Leaf Game Script Loaded!");
    enhancedInitializeGame();
});

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
        dominantPath: null,
        lastEventGrowth: 0
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
    // Achievement System - Add to game.js

// Achievement definitions
const achievements = [
    {
        id: "first_growth",
        name: "First Step",
        description: "Grow your AI tree for the first time",
        icon: "🌱",
        condition: () => gameState.growth >= 1,
        reward: () => { gameState.growth += 1; return "Growth +1"; },
        earned: false
    },
    {
        id: "balanced_growth",
        name: "Balanced Mind",
        description: "Achieve at least 1 point in each focus area",
        icon: "⚖️",
        condition: () => Object.values(gameState.focusAreas).every(val => val >= 1),
        reward: () => { 
            Object.keys(gameState.focusAreas).forEach(area => gameState.focusAreas[area] += 1); 
            return "All focus areas +1"; 
        },
        earned: false
    },
    {
        id: "master_specialization",
        name: "Master Specialist",
        description: "Reach 5 points in any single focus area",
        icon: "🏆",
        condition: () => Object.values(gameState.focusAreas).some(val => val >= 5),
        reward: () => {
            const dominantPath = gameState.dominantPath;
            if (dominantPath) {
                gameState.focusAreas[dominantPath] += 2;
                return `${dominantPath} focus +2`;
            }
            return "No reward applied";
        },
        earned: false
    },
    {
        id: "random_master",
        name: "Chaos Navigator",
        description: "Experience 3 random events",
        icon: "🎲",
        condition: () => gameState.randomEventsExperienced >= 3,
        reward: () => { gameState.growth += 2; return "Growth +2"; },
        earned: false
    },
    {
        id: "flowering",
        name: "Fully Bloomed",
        description: "Reach the flowering stage of development",
        icon: "🌲",
        condition: () => gameState.stage === "flowering",
        reward: () => { 
            // Add a special visual effect or property
            gameState.specialEffects = gameState.specialEffects || {};
            gameState.specialEffects.glowing = true;
            return "Special visual effect: Glowing Tree";
        },
        earned: false
    },
    {
        id: "badge_collector",
        name: "Badge Collector",
        description: "Earn all 5 focus area badges",
        icon: "🏅",
        condition: () => Object.values(gameState.badges).every(badge => badge === true),
        reward: () => { 
            gameState.growth += 3; 
            return "Growth +3 and special status"; 
        },
        earned: false
    },
    {
        id: "persistent_trainer",
        name: "Persistent Trainer",
        description: "Make 15 total growth choices",
        icon: "🔄",
        condition: () => gameState.growth >= 15,
        reward: () => { 
            // Unlock a special button or feature
            gameState.unlockedFeatures = gameState.unlockedFeatures || {};
            gameState.unlockedFeatures.rapidGrowth = true;
            return "Unlocked: Rapid Growth feature";
        },
        earned: false
    }
];

// Track achievements in game state
function initializeAchievements() {
    // Add achievements tracking to game state
    gameState.achievements = gameState.achievements || {};
    achievements.forEach(achievement => {
        gameState.achievements[achievement.id] = gameState.achievements[achievement.id] || false;
    });
    
    // Add random events counter if not present
    gameState.randomEventsExperienced = gameState.randomEventsExperienced || 0;
    
    // Create achievements panel
    createAchievementsPanel();
}

// Create achievements UI panel
function createAchievementsPanel() {
    // Check if panel already exists
    if (document.getElementById("achievementsPanel")) return;
    
    // Create panel container
    const panel = document.createElement("div");
    panel.id = "achievementsPanel";
    panel.style.display = "none";
    panel.style.padding = "15px";
    panel.style.backgroundColor = "#f5f5f5";
    panel.style.border = "1px solid #ddd";
    panel.style.borderRadius = "8px";
    panel.style.marginTop = "20px";
    panel.style.maxWidth = "600px";
    panel.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
    
    // Add header
    const header = document.createElement("h3");
    header.textContent = "Achievements";
    header.style.borderBottom = "2px solid #4caf50";
    header.style.paddingBottom = "10px";
    header.style.marginBottom = "15px";
    panel.appendChild(header);
    
    // Add achievements grid container
    const grid = document.createElement("div");
    grid.id = "achievementsGrid";
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(250px, 1fr))";
    grid.style.gap = "15px";
    panel.appendChild(grid);
    
    // Add panel to the game container
    const container = document.querySelector(".container") || document.body;
    container.appendChild(panel);
    
    // Add button to toggle achievements panel
    const toggleButton = document.createElement("button");
    toggleButton.textContent = "🏆 Achievements";
    toggleButton.style.marginLeft = "10px";
    toggleButton.style.padding = "8px 15px";
    toggleButton.style.backgroundColor = "#9c27b0";
    toggleButton.style.color = "white";
    toggleButton.style.border = "none";
    toggleButton.style.borderRadius = "4px";
    toggleButton.style.cursor = "pointer";
    toggleButton.onclick = toggleAchievements;
    
    // Add button next to the badge tracker button
    const buttonContainer = document.querySelector("button").parentNode;
    buttonContainer.appendChild(toggleButton);
    
    // Update the achievements display
    updateAchievementsDisplay();
}

// Toggle achievements panel visibility
function toggleAchievements() {
    const panel = document.getElementById("achievementsPanel");
    if (panel) {
        const currentDisplay = window.getComputedStyle(panel).display;
        panel.style.display = currentDisplay === "none" ? "block" : "none";
    }
}

// Update achievements display
function updateAchievementsDisplay() {
    const grid = document.getElementById("achievementsGrid");
    if (!grid) return;
    
    // Clear existing achievements
    grid.innerHTML = "";
    
    // Add each achievement
    achievements.forEach(achievement => {
        const earned = gameState.achievements[achievement.id];
        
        const card = document.createElement("div");
        card.className = "achievement-card";
        card.style.padding = "10px";
        card.style.border = "1px solid #ddd";
        card.style.borderRadius = "5px";
        card.style.backgroundColor = earned ? "#e8f5e9" : "#f5f5f5";
        card.style.opacity = earned ? "1" : "0.7";
        card.style.position = "relative";
        
        // Badge with icon
        const badge = document.createElement("div");
        badge.style.position = "absolute";
        badge.style.right = "10px";
        badge.style.top = "10px";
        badge.style.fontSize = "24px";
        badge.textContent = achievement.icon;
        card.appendChild(badge);
        
        // Title
        const title = document.createElement("h4");
        title.textContent = achievement.name;
        title.style.margin = "5px 0";
        title.style.paddingRight = "30px"; // Make room for badge
        card.appendChild(title);
        
        // Description
        const desc = document.createElement("p");
        desc.textContent = achievement.description;
        desc.style.fontSize = "14px";
        desc.style.margin = "5px 0 10px 0";
        card.appendChild(desc);
        
        // Status
        const status = document.createElement("div");
        status.style.fontSize = "12px";
        status.style.fontWeight = "bold";
        status.style.color = earned ? "#4caf50" : "#999";
        status.textContent = earned ? "ACHIEVED ✓" : "LOCKED";
        card.appendChild(status);
        
        // Reward if earned
        if (earned) {
            const reward = document.createElement("div");
            reward.style.fontSize = "12px";
            reward.style.marginTop = "5px";
            reward.style.color = "#9c27b0";
            reward.textContent = `Reward: ${achievement.reward().toString()}`;
            card.appendChild(reward);
        }
        
        grid.appendChild(card);
    });
}

// Check achievements after each growth action
function checkAchievements() {
    let newlyEarned = false;
    
    achievements.forEach(achievement => {
        const id = achievement.id;
        // Skip if already earned
        if (gameState.achievements[id]) return;
        
        // Check if achievement condition is met
        if (achievement.condition()) {
            // Mark as earned
            gameState.achievements[id] = true;
            achievement.earned = true;
            
            // Apply reward
            const rewardResult = achievement.reward();
            
            // Show notification
            showAchievementNotification(achievement, rewardResult);
            newlyEarned = true;
        }
    });
    
    // Update display if any achievements were earned
    if (newlyEarned) {
        updateAchievementsDisplay();
    }
}

// Show achievement notification
function showAchievementNotification(achievement, rewardText) {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = "achievement-notification";
    notification.style.position = "fixed";
    notification.style.top = "20px";
    notification.style.right = "20px";
    notification.style.backgroundColor = "#4caf50";
    notification.style.color = "white";
    notification.style.padding = "15px";
    notification.style.borderRadius = "5px";
    notification.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    notification.style.zIndex = "1000";
    notification.style.display = "flex";
    notification.style.alignItems = "center";
    notification.style.maxWidth = "400px";
    notification.style.transform = "translateX(120%)";
    notification.style.transition = "transform 0.5s ease-out";
    
    // Icon
    const icon = document.createElement("div");
    icon.style.fontSize = "30px";
    icon.style.marginRight = "15px";
    icon.textContent = achievement.icon;
    notification.appendChild(icon);
    
    // Text content
    const content = document.createElement("div");
    
    const title = document.createElement("div");
    title.style.fontWeight = "bold";
    title.style.fontSize = "16px";
    title.textContent = `Achievement Unlocked: ${achievement.name}`;
    content.appendChild(title);
    
    const desc = document.createElement("div");
    desc.style.fontSize = "14px";
    desc.style.marginTop = "5px";
    desc.textContent = achievement.description;
    content.appendChild(desc);
    
    const reward = document.createElement("div");
    reward.style.fontSize = "14px";
    reward.style.marginTop = "5px";
    reward.style.fontWeight = "bold";
    reward.textContent = `Reward: ${rewardText}`;
    content.appendChild(reward);
    
    notification.appendChild(content);
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = "translateX(0)";
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = "translateX(120%)";
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 5000);
}

// Update random event handling to track events experienced
function enhanceRandomEventHandling() {
    // Store the original showEventModal function
    const originalShowEventModal = showEventModal;
    
    // Override the showEventModal function to count events
    window.showEventModal = function(event) {
        // Increment event counter
        gameState.randomEventsExperienced = (gameState.randomEventsExperienced || 0) + 1;
        
        // Call the original function
        originalShowEventModal(event);
        
        // Check achievements after event
        checkAchievements();
    };
}

// Add special visual effects if unlocked
function applySpecialEffects() {
    if (!gameState.specialEffects) return;
    
    const tree = document.getElementById("tree");
    if (!tree) return;
    
    // Apply glowing effect
    if (gameState.specialEffects.glowing) {
        tree.style.textShadow = "0 0 10px #ffeb3b, 0 0 15px #ffc107";
    } else {
        tree.style.textShadow = "";
    }
}

// Add rapid growth feature if unlocked
function addRapidGrowthFeature() {
    if (!gameState.unlockedFeatures?.rapidGrowth) return;
    
    // Check if button already exists
    if (document.getElementById("rapidGrowthBtn")) return;
    
    // Create rapid growth button
    const rapidGrowthBtn = document.createElement("button");
    rapidGrowthBtn.id = "rapidGrowthBtn";
    rapidGrowthBtn.textContent = "🚀 Rapid Growth";
    rapidGrowthBtn.style.marginTop = "15px";
    rapidGrowthBtn.style.padding = "10px 20px";
    rapidGrowthBtn.style.backgroundColor = "#ff9800";
    rapidGrowthBtn.style.color = "white";
    rapidGrowthBtn.style.border = "none";
    rapidGrowthBtn.style.borderRadius = "5px";
    rapidGrowthBtn.style.cursor = "pointer";
    
    // Add rapid growth functionality
    rapidGrowthBtn.onclick = function() {
        // Disable button temporarily (once per 30 seconds)
        this.disabled = true;
        this.style.opacity = "0.5";
        setTimeout(() => {
            this.disabled = false;
            this.style.opacity = "1";
        }, 30000);
        
        // Apply rapid growth (3 growth points)
        for (let i = 0; i < 3; i++) {
            // Find highest focus area
            let highestArea = Object.keys(gameState.focusAreas)[0];
            for (const area in gameState.focusAreas) {
                if (gameState.focusAreas[area] > gameState.focusAreas[highestArea]) {
                    highestArea = area;
                }
            }
            
            // Grow in that direction
            growTree(highestArea);
        }
        
        // Show feedback
        const feedback = document.createElement("div");
        feedback.textContent = "Rapid growth applied!";
        feedback.style.color = "#ff9800";
        feedback.style.fontWeight = "bold";
        feedback.style.marginTop = "10px";
        
        this.parentNode.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 3000);
    };
    
    // Add to the game container
    const buttonContainer = document.querySelector("button").parentNode;
    buttonContainer.appendChild(rapidGrowthBtn);
}

// Extend the growTree function to check achievements
const originalGrowTree = growTree;
window.growTree = function(choice) {
    // Call original function
    originalGrowTree(choice);
    
    // Check achievements
    checkAchievements();
    
    // Apply special effects if any
    applySpecialEffects();
    
    // Check if rapid growth feature should be added
    addRapidGrowthFeature();
};

// Extend the resetGame function to reset achievements
const originalResetGame = resetGame;
window.resetGame = function() {
    // Call original function
    originalResetGame();
    
    // Reset achievements
    achievements.forEach(achievement => {
        gameState.achievements[achievement.id] = false;
        achievement.earned = false;
    });
    
    // Reset random events counter
    gameState.randomEventsExperienced = 0;
    
    // Reset special effects
    gameState.specialEffects = {};
    
    // Reset unlocked features
    gameState.unlockedFeatures = {};
    
    // Update achievements display
    updateAchievementsDisplay();
};

// Update the enhanced initialization function
const originalEnhancedInitializeGame = enhancedInitializeGame;
window.enhancedInitializeGame = function() {
    // Call original function
    originalEnhancedInitializeGame();
    
    // Initialize achievements system
    initializeAchievements();
    
    // Enhance random event handling
    enhanceRandomEventHandling();
    
    console.log("Achievement system initialized!");
};

// CSS for achievements
function addAchievementStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .achievement-card {
            transition: all 0.3s ease;
        }
        .achievement-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        #achievementsPanel {
            transition: all 0.3s ease;
        }
        #rapidGrowthBtn:hover {
            background-color: #f57c00 !important;
        }
        .achievement-notification {
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(76, 175, 80, 0); }
            100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
        }
    `;
    document.head.appendChild(style);
}

// Call this function when loading the page
window.addEventListener("load", function() {
    console.log("Achievement System Loaded!");
    addAchievementStyles();
});
};}, 1000);
}
