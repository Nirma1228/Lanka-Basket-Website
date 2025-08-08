const axios = require('axios');

async function testServer() {
    try {
        console.log('Testing local server...');
        const response = await axios.get('http://localhost:8080');
        console.log('✅ Local server is running:', response.data);

        console.log('\nTesting Azure backend...');
        const azureResponse = await axios.get('https://lankabasket-dme4c4dcf0gea3c4.southindia-01.azurewebsites.net');
        console.log('✅ Azure backend is running:', azureResponse.data);

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

testServer();
