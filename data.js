// Data for Muğla's 13 districts with their coordinates
const districts = {
    "Bodrum": { lat: 37.035, lng: 27.430, id: "Bodrum" },
    "Dalaman": { lat: 36.766, lng: 28.799, id: "Dalaman" },
    "Datça": { lat: 36.738, lng: 27.687, id: "Datça" },
    "Fethiye": { lat: 36.662, lng: 29.127, id: "Fethiye" },
    "Kavaklıdere": { lat: 37.442, lng: 28.391, id: "Kavaklıdere" },
    "Köyceğiz": { lat: 36.970, lng: 28.686, id: "Köyceğiz" },
    "Marmaris": { lat: 36.855, lng: 28.275, id: "Marmaris" },
    "Menteşe": { lat: 37.215, lng: 28.363, id: "Menteşe" },  // Center of Muğla
    "Milas": { lat: 37.316, lng: 27.780, id: "Milas" },
    "Ortaca": { lat: 36.838, lng: 28.767, id: "Ortaca" },
    "Seydikemer": { lat: 36.648, lng: 29.360, id: "Seydikemer" },
    "Ula": { lat: 37.107, lng: 28.417, id: "Ula" },
    "Yatağan": { lat: 37.339, lng: 28.136, id: "Yatağan" }
};

// Graph representing road connections between districts with more realistic connections
// Making sure to include intermediate districts for proper routing
const graph = {
    "Bodrum": [
        { node: "Milas", weight: 52 } // Must pass through Milas to go anywhere from Bodrum
    ],
    "Dalaman": [
        { node: "Ortaca", weight: 15 } // Must pass through Ortaca when going east
    ],
    "Datça": [
        { node: "Marmaris", weight: 70 } // Must pass through Marmaris to leave Datça peninsula
    ],
    "Fethiye": [
        { node: "Seydikemer", weight: 25 }, // South connection
        { node: "Ortaca", weight: 50 }  // Must pass through Ortaca when going west
    ],
    "Kavaklıdere": [
        { node: "Menteşe", weight: 27 },  // Direct connection to Menteşe
        { node: "Yatağan", weight: 13 }   // Connection to Yatağan
    ],
    "Köyceğiz": [
        { node: "Ortaca", weight: 20 } // Must pass through Ortaca when going south
    ],
    "Marmaris": [
        { node: "Datça", weight: 70 }, // To Datça peninsula
        { node: "Ula", weight: 45 }    // Must pass through Ula when going north
    ],
    "Menteşe": [
        { node: "Ula", weight: 17 },      // South connection (to Marmaris)
        { node: "Yatağan", weight: 25 },  // Northwest connection
        { node: "Kavaklıdere", weight: 27 } // Direct connection to Kavaklıdere
    ],
    "Milas": [
        { node: "Bodrum", weight: 52 },  // To Bodrum peninsula
        { node: "Yatağan", weight: 43 }  // Must pass through Yatağan to Menteşe and other districts
    ],
    "Ortaca": [
        { node: "Dalaman", weight: 15 },  // West connection
        { node: "Köyceğiz", weight: 20 }, // North connection
        { node: "Fethiye", weight: 50 }   // East connection
    ],
    "Seydikemer": [
        { node: "Fethiye", weight: 25 } // Must pass through Fethiye to connect to other districts
    ],
    "Ula": [
        { node: "Menteşe", weight: 17 },  // North to Muğla center
        { node: "Marmaris", weight: 45 }, // South to Marmaris
        { node: "Köyceğiz", weight: 45 }  // East connection creates a realistic alternate route
    ],
    "Yatağan": [
        { node: "Menteşe", weight: 25 },    // South to Muğla center
        { node: "Kavaklıdere", weight: 13 }, // East connection
        { node: "Milas", weight: 43 }       // West to Milas and Bodrum
    ]
};

// Create a bidirectional graph for Dijkstra's algorithm
function createBidirectionalGraph(graph) {
    const bidirectional = {};
    
    // Initialize all districts
    Object.keys(districts).forEach(district => {
        bidirectional[district] = [];
    });
    
    // Add connections in both directions
    Object.keys(graph).forEach(from => {
        graph[from].forEach(edge => {
            // Add forward direction
            bidirectional[from].push({ node: edge.node, weight: edge.weight });
            
            // Add reverse direction if it doesn't exist
            const reverseExists = bidirectional[edge.node].some(e => e.node === from);
            if (!reverseExists) {
                bidirectional[edge.node].push({ node: from, weight: edge.weight });
            }
        });
    });
    
    // Verify all districts have at least one connection
    Object.keys(bidirectional).forEach(district => {
        if (bidirectional[district].length === 0) {
            console.warn(`Warning: ${district} doesn't have any connection in the graph.`);
        }
    });
    
    return bidirectional;
}

// Create the bidirectional graph
const bidirectionalGraph = createBidirectionalGraph(graph);