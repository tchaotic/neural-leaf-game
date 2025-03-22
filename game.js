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

// Modify the growTree function to potentially trigger random events
// Add this to the existing growTree function, right after incrementing growth
// and before updating the tree stage
function modifiedGrowTree(choice) {
    console.log("growTree function called with choice:", choice);
    
    let tree = document.getElementById("tree");
    let description = document.getElementById("description");
    
    // Increment growth
    gameState.growth += 1;
    
    // Increment focus area
    gameState.focusAreas[choice] += 1;
    
    // *** ADD THIS SECTION TO CHECK FOR RANDOM EVENTS ***
    // Check if a random event should occur
    const randomEvent = checkForRandomEvent();
    if (randomEvent) {
        setTimeout(() => {
            showEventModal(randomEvent);
        }, 500); // Short delay for better user experience
    }
    // *** END OF NEW SECTION ***
    
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

// Replace your existing growTree function with modifiedGrowTree
// (Or alternatively, add the random event section to your existing function)
window.growTree = modifiedGrowTree;

// Replace your existing initializeGame with enhancedInitializeGame call
window.addEventListener("load", function () {
    console.log("Enhanced Neural Leaf Game Script Loaded!");
    enhancedInitializeGame();
});
