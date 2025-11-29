const axios = require('axios');

//API used = https://github.com/IsabelleLefebvre97/PWHL-Data-Reference?tab=readme-ov-file
// standings url = https://lscluster.hockeytech.com/feed/index.php?feed=modulekit&view=statviewtype&stat=conference&type=standings&season_id=8&key=446521baf8c38984&client_code=pwhl
// leader url = https://lscluster.hockeytech.com/feed/index.php?feed=modulekit&view=combinedplayers&type=skaters&season_id=8&key=446521baf8c38984&client_code=pwhl
// games url = https://lscluster.hockeytech.com/feed/index.php?feed=modulekit&view=scorebar&numberofdaysback=200&numberofdaysahead=300&key=446521baf8c38984&client_code=pwhl

const hockeyStandingsURL = 'https://lscluster.hockeytech.com/feed/index.php?feed=modulekit&view=statviewtype&stat=conference&type=standings&season_id=8&key=446521baf8c38984&client_code=pwhl';
const hockeyLeadersURL = 'https://lscluster.hockeytech.com/feed/index.php?feed=modulekit&view=combinedplayers&type=skaters&season_id=8&key=446521baf8c38984&client_code=pwhl';
const hockeyGamesURL = 'https://lscluster.hockeytech.com/feed/index.php?feed=modulekit&view=scorebar&numberofdaysback=200&numberofdaysahead=300&key=446521baf8c38984&client_code=pwhl';

async function makeAPICall(apiURL) {
    try {
        const fullRequestUrl = apiURL;; 
        const response = await axios.get(fullRequestUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching data from the API:', error.stack || error);
        throw error; // rethrow so server can send 500 and log details
    }
}

async function getStandingsData() {
    return JSON.stringify(await makeAPICall(hockeyStandingsURL));
}

async function getLeadersData() {
    return JSON.stringify(await makeAPICall(hockeyLeadersURL));
}   

async function getGamesData() {
    return JSON.stringify(await makeAPICall(hockeyGamesURL));
}

module.exports = {
    getStandingsData,
    getLeadersData,
    getGamesData
};