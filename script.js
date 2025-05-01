// Map initialization
const map = L.map('map').setView([37.215, 28.363], 9);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Markers and polylines for visualization
let districtMarkers = {};
let pathPolyline = null;

// Initialize district markers
function initializeMarkers() {
    // Clear existing markers
    Object.values(districtMarkers).forEach(marker => map.removeLayer(marker));
    districtMarkers = {};
    
    // Create markers for each district
    Object.entries(districts).forEach(([name, location]) => {
        const marker = L.marker([location.lat, location.lng], {
            title: name
        }).addTo(map);
        
        marker.bindPopup(`<b>${name}</b>`);
        districtMarkers[name] = marker;
    });
    
    // Populate dropdowns
    const startSelect = document.getElementById('start-district');
    const endSelect = document.getElementById('end-district');
    
    // Clear existing options
    startSelect.innerHTML = '<option value="">Select Start District</option>';
    endSelect.innerHTML = '<option value="">Select End District</option>';
    
    // Add district options
    Object.keys(districts).sort().forEach(district => {
        startSelect.add(new Option(district, district));
        endSelect.add(new Option(district, district));
    });
}

// Find and display the shortest path
function findShortestPath() {
    // Get selected districts
    const startDistrict = document.getElementById('start-district').value;
    const endDistrict = document.getElementById('end-district').value;
    
    // Validate selection
    if (!startDistrict || !endDistrict) {
        alert("Please select both start and end districts");
        return;
    }
    
    if (startDistrict === endDistrict) {
        alert("Start and end districts cannot be the same");
        return;
    }
    
    // Run Dijkstra's algorithm
    const result = dijkstra(bidirectionalGraph, startDistrict, endDistrict);
    
    // Display path information
    const pathInfoElement = document.getElementById('path-info');
    const pathDistanceElement = document.getElementById('path-distance');
    const pathStepsElement = document.getElementById('path-steps');
    
    if (result.distance === Infinity) {
        pathInfoElement.textContent = "Seçilen ilçeler arasında yol bulunamadı.";
        pathDistanceElement.textContent = "";
        pathStepsElement.textContent = "";
    } else {
        pathInfoElement.textContent = `En kısa yol bulundu:`;
        pathDistanceElement.textContent = `Toplam mesafe: ${result.distance} km`;
        pathStepsElement.textContent = `Rota: ${result.path.join(" → ")}`;
        
        // Visualize the path on the map
        visualizePath(result.path);
    }
}

// Visualize path on the map
function visualizePath(path) {
    // Remove existing path
    if (pathPolyline) {
        map.removeLayer(pathPolyline);
    }
    
    // Create polyline coordinates
    const coordinates = path.map(district => [districts[district].lat, districts[district].lng]);
    
    // Create and add polyline
    pathPolyline = L.polyline(coordinates, {
        color: 'blue',
        weight: 5,
        opacity: 0.7,
        dashArray: '10, 10',
        lineJoin: 'round'
    }).addTo(map);
    
    // Fit map to show the entire path
    map.fitBounds(pathPolyline.getBounds(), { padding: [50, 50] });
    
    // Highlight markers along the path
    Object.values(districtMarkers).forEach(marker => {
        marker.setOpacity(0.4); // Dim other markers more
    });
    
    // Add animation delay to sequentially highlight path points
    path.forEach((district, index) => {
        setTimeout(() => {
            districtMarkers[district].setOpacity(1);
            districtMarkers[district].openPopup();
            
            // Create an animated pulse effect for each point in the path
            const pulseIcon = L.divIcon({
                className: 'pulse-icon',
                html: `<div class="pulse" style="
                    width: 20px; 
                    height: 20px; 
                    background-color: rgba(255, 0, 0, 0.5);
                    border-radius: 50%;
                    position: absolute;
                    left: -10px;
                    top: -10px;
                    animation: pulse 1.5s infinite;
                "></div>`,
                iconSize: [0, 0]
            });
            
            // Add a pulse marker at each point
            if (index < path.length - 1) {
                const pulseMarker = L.marker([districts[district].lat, districts[district].lng], {
                    icon: pulseIcon,
                    zIndexOffset: 1000
                }).addTo(map);
                
                // Remove the pulse effect after a delay
                setTimeout(() => {
                    map.removeLayer(pulseMarker);
                }, 2000);
            }
        }, index * 500); // Stagger the animations
    });
    
    // Add pulse animation style
    if (!document.getElementById('pulse-style')) {
        const style = document.createElement('style');
        style.id = 'pulse-style';
        style.innerHTML = `
            @keyframes pulse {
                0% {
                    transform: scale(0.5);
                    opacity: 1;
                }
                100% {
                    transform: scale(1.5);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize the application
function initialize() {
    initializeMarkers();
    document.getElementById('find-path').addEventListener('click', findShortestPath);
}

// Run when the page loads
window.onload = initialize;