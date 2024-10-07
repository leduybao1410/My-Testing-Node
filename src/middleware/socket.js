const { WebSocket } = require('ws');

const clients = [];
const onConnectionWss = (ws) => {
    console.log('New client connected');

    const clientID = clients.length;
    clients.push({ clientID, ws });
    // Send ID only if clients array is empty
    if (ws !== clients[clients.length - 1].ws) {
        return;
    }

    ws.on('message', (message) => {
        let content;
        try {
            content = JSON.parse(message);
            console.log(`Received: ${JSON.stringify(content)}`);
        } catch (error) {
            console.error('Error parsing message:', error);
            return;
        }
        if (typeof content === 'object') {
            clients.forEach(client => {
                if (client['ws'].readyState === WebSocket.OPEN) {
                    let messageObj = { clientID, message: content };
                    const jsonMessage = JSON.stringify(messageObj);
                    client['ws'].send(jsonMessage);
                }
            });
        }
    });

    ws.on('close', () => {
        clients = clients.filter(client => client['ws'] !== ws);
        console.log('Client disconnected');
    });
}

module.exports = { onConnectionWss }