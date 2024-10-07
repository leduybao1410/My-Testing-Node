const path = require('path');

const getReact = (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '../../public/pages/ReactJs/')); // Update this line to send the index.html fileFF
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
}

const getSocketPage = (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '../../public/pages/Socket/')); // Update this line to send the index.html fileFF
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
}

const fs = require('fs');
const gameDataPath = path.join(__dirname, '../../../database/Game/', 'gameData.json');

// Function to read game data from file
async function readGameData() {
    try {
        const data = await fs.promises.readFile(gameDataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading game data:', error);
        return {};
    }
}

// Function to write game data to file
async function writeGameData(data) {
    try {
        await fs.promises.writeFile(gameDataPath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing game data:', error);
    }
}

const updateData = async (req, res) => {
    const { name, value } = req.body;

    // Read current game data
    let gameData = await readGameData();

    // Update the game data
    gameData[name] = value;

    // Write the updated game data back to the file
    await writeGameData(gameData);

    res.status(200).json({ success: true, data: gameData });
}

const getData = async (req, res) => {
    // Read current game data
    let gameData = await readGameData();

    res.status(200).json({ success: true, data: gameData });
}


module.exports = { getReact, getData, updateData, getSocketPage };