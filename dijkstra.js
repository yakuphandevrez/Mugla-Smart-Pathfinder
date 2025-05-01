// Dijkstra's Algorithm Implementation
function dijkstra(graph, startNode, endNode) {
    // Set initial distances as Infinity for all nodes except the starting node
    const distances = {};
    const previous = {};
    const unvisited = new Set();
    
    // Initialize with all nodes
    Object.keys(graph).forEach(node => {
        distances[node] = Infinity;
        previous[node] = null;
        unvisited.add(node);
    });
    
    // Distance from start to start is 0
    distances[startNode] = 0;
    
    // Process nodes until all are visited or the end node is reached
    while (unvisited.size > 0) {
        // Find the unvisited node with the smallest distance
        let current = null;
        let smallestDistance = Infinity;
        
        unvisited.forEach(node => {
            if (distances[node] < smallestDistance) {
                smallestDistance = distances[node];
                current = node;
            }
        });
        
        // If there's no path or we reached the end node
        if (current === null || current === endNode) {
            break;
        }
        
        // Remove current from unvisited
        unvisited.delete(current);
        
        // Check all neighbors of the current node
        graph[current].forEach(neighbor => {
            if (unvisited.has(neighbor.node)) {
                // Calculate new distance
                const newDistance = distances[current] + neighbor.weight;
                
                // If new distance is shorter, update
                if (newDistance < distances[neighbor.node]) {
                    distances[neighbor.node] = newDistance;
                    previous[neighbor.node] = current;
                }
            }
        });
    }
    
    // Construct the path
    const path = [];
    let current = endNode;
    
    // If there is no path to the end node
    if (previous[current] === null && current !== startNode) {
        return { path: [], distance: Infinity };
    }
    
    // Build the path backwards
    while (current !== null) {
        path.unshift(current);
        current = previous[current];
    }
    
    return { path, distance: distances[endNode] };
}