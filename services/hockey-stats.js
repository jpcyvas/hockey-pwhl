import axios from 'axios';

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

function getTodaysDate() {
    // produce YYYY-MM-DD in US Central time
    const now = new Date();
    now.setDate(28);
    now.setDate(now.getDate() + 1);
    return now.toLocaleDateString('en-CA', { timeZone: 'America/Chicago' });
}

//functions for site
export async function getStandingsData() {
    return JSON.stringify(await makeAPICall(hockeyStandingsURL));
}

export async function getLeadersData() {
    return JSON.stringify(await makeAPICall(hockeyLeadersURL));
}

export async function getGamesData() {
    return JSON.stringify(await makeAPICall(hockeyGamesURL));
}

//functions for discord
export async function getDailySchedule() {


    //get data from API
    const dataSchedule =  await makeAPICall(hockeyGamesURL);

    //get the games for today
    var dateToday = getTodaysDate();

    const todaysGames = dataSchedule.SiteKit.Scorebar.filter(game => game.GameDateISO8601.split('T')[0] === dateToday);

    //create string to send
    var output = "# PWHL Games for " + dateToday + "\n\n";
    var gameTime = ''

    //loop through the games and display the data
    //check for null first
    if(todaysGames.length === 0) {
        output += "No games today :'( \n";
        return output;
    }
    for(var i = 0; i < todaysGames.length; i++) {
        output += todaysGames[i].VisitorCode + " at " + todaysGames[i].HomeCode;
        
        //try to convert time to central time
        try {
            gameTime = new Date(todaysGames[i].GameDateISO8601).toLocaleTimeString('en-US', { timeZone: 'America/Chicago', hour: '2-digit', minute: '2-digit' });
            output += " at " + gameTime + " CT";
        } catch(e){
            //do nothing
        } finally{
            output += "\n";
        }
    }
  
    return output;
}