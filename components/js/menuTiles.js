const tileContainer = document.querySelector('.tile-container');
const addTileButton = document.getElementById('add-tile');

function adjustTileSize() {
    const tiles = document.querySelectorAll('.tile');
    const containerWidth = tileContainer.clientWidth;
    const tileCount = tiles.length;

    const tileWidth = Math.floor(containerWidth / tileCount) - 10; // Subtracting gap
    tiles.forEach(tile => {
        tile.style.flexBasis = `${tileWidth}px`;
    });
}

function addTile() {
    const newTile = document.createElement('div');
    newTile.className = 'tile';
    newTile.textContent = `Tile ${tileContainer.children.length + 1}`;
    tileContainer.appendChild(newTile);
    adjustTileSize();
}

// Initial size adjustment
adjustTileSize();

// Event listeners
window.addEventListener('resize', adjustTileSize);
addTileButton.addEventListener('click', addTile);
