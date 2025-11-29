import React, { useState,useEffect  } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column'
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { Card } from 'primereact/card';
import { SpeedDial } from 'primereact/speeddial';
import { Tag } from 'primereact/tag';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { ButtonGroup } from 'primereact/buttongroup';

export default function App() {
  const [standings, setStandings] = useState(null);
  const [leadersPoints, setLeadersPoints] = useState(null);
  const [games, setGames] = useState(null);
  const [dateSelected, setDateSelected] = useState(null);

  const teamMapping = {
    "Boston Fleet":1,
     "Minnesota Frost":2,
     "Montréal Victoire":3,
     "New York Sirens":4,
     "Ottawa Charge":5,
     "Toronto Sceptre":6,
     "Seattle Torrent":8,
     "Vancouver Goldeneyes":9,
  } 


   const items = [
        {
            label: 'LeaderBoard',
            icon: () => <Avatar icon="pi pi-list" size="xlarge" onClick={() => scrollToSection('leaderBoardSection')}/>
        },
        {
            label: 'Teams Teams',
            icon: () => <Avatar icon="pi pi-id-card" size="xlarge" onClick={() => scrollToSection('teamsSection')}/>,
        },
        {
            label: 'Schedule',
            icon: () => <Avatar icon="pi pi-calendar" size="xlarge" onClick={() => scrollToSection('scheduleSection')}/>,
        },
        {
            labe: 'Player Select',
            icon: () => <SpeedDial model={stats} direction="up" showIcon="pi pi-user" style={{ left: -15, bottom: 10, position: 'fixed' }} />

        }
    ];

    const scrollToSection = (id) => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const decreaseSelectedDate = () => {
      if (dateSelected) {
        const newDate = new Date(dateSelected); 
        newDate.setDate(newDate.getDate() - 1);
        setDateSelected(newDate);
      } 
    };

    const increaseSelectedDat = () => {
      if (dateSelected) {
        const newDate = new Date(dateSelected);
        newDate.setDate(newDate.getDate() + 1);
        setDateSelected(newDate);
      }
    };

    const getTeamLogo = (teamName) => {
      const teamId = teamMapping[teamName]; 
      var url = "https://assets.leaguestat.com/pwhl/logos/"+teamId+".png"
      return url;
    }

  const playerNameTemplate = (rowData) => {
    return (
      // use Tailwind flex + items-center to vertically center the text with the image
      <div className="flex items-center gap-2">
        <img alt={rowData.name} src={rowData.photo} className="h-15 w-15 object-cover rounded" />
        <span>{rowData.name}</span>
      </div>
    );
  };

  const playerTeamTemplate = (rowData) => {
    return (
      <div className="flex items-center gap-2"> 
        <img alt={rowData.team_name} src={rowData.logo} className="h-15 w-15 object-cover rounded-full" />
        <span>{rowData.team_name}</span>
      </div>
    );
  }

  const teamDisplayTemplate = (rowData) => {
    return (
      <div className="flex items-center gap-2"> 
        <img alt={rowData.team_name} src={"https://assets.leaguestat.com/pwhl/logos/"+rowData.team_id+".png"} className="h-15 w-15 object-cover" />
        <span>{rowData.team_name}</span>
      </div>
    );
  }

  // get data (fetch data.json and data2.json in parallel)
  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    //init dateSelected to today
    setDateSelected(new Date());

    async function loadAll() {
      try {
        const [data1, data2, data3] = await Promise.all([
          fetch('./data.json', { signal }).then((r) => {
            if (!r.ok) throw new Error('Failed to fetch data.json')
            return r.json()
          }),
          fetch('./data2.json', { signal }).then((r) => {
            if (!r.ok) throw new Error('Failed to fetch data2.json')
            return r.json()
          }),
          fetch('./data3.json', { signal }).then((r) => {
          if (!r.ok) throw new Error('Failed to fetch data2.json')
          return r.json()
        })
        ])

        //API used = https://github.com/IsabelleLefebvre97/PWHL-Data-Reference?tab=readme-ov-file
        // standings url = https://lscluster.hockeytech.com/feed/index.php?feed=modulekit&view=statviewtype&stat=conference&type=standings&season_id=8&key=446521baf8c38984&client_code=pwhl
        // leader url = https://lscluster.hockeytech.com/feed/index.php?feed=modulekit&view=combinedplayers&type=skaters&season_id=8&key=446521baf8c38984&client_code=pwhl
        // games url = https://lscluster.hockeytech.com/feed/index.php?feed=modulekit&view=scorebar&numberofdaysback=200&numberofdaysahead=300&key=446521baf8c38984&client_code=pwhl

        // console.log('data.json', data1.SiteKit.Statviewtype)
        // console.log('data2.json', data2.SiteKit.Combinedplayers)
        // console.log('data3.json', data3.SiteKit.Scorebar)

        if (data1?.SiteKit?.Statviewtype) setStandings(data1.SiteKit.Statviewtype)

        if (data2?.SiteKit?.Combinedplayers) setLeadersPoints(data2.SiteKit.Combinedplayers.points)

        if (data3?.SiteKit?.Scorebar) setGames(data3.SiteKit.Scorebar)

      } catch (err) {
        if (err.name === 'AbortError') return
        console.error(err)
      }
    }

    loadAll()

    return () => controller.abort()
  }, [])


  // filter games to only those matching the selected date (by day)
  const displayedGames = (games || []).filter((game) => {
    if (!dateSelected) return false
    const selected = new Date(dateSelected)
    // start of selected day
    const dayStart = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate())
    const dayEnd = new Date(dayStart)
    dayEnd.setDate(dayEnd.getDate() + 1)

    const gDate = new Date(game.GameDateISO8601)
    return gDate >= dayStart && gDate < dayEnd
  })

  // filter standings to hide rows without a points value
  const displayedStandings = (standings || []).filter((row) => {
    // hide if points is null, undefined, or an empty string
    return row?.points != null && row?.points !== ''
  })

  return (
    <div className="p-4 bg-gray-100 fff-body-tag">

         {/* Game Score Section */}

         <div className="flex-auto">
              <ButtonGroup>
                <Button icon="pi pi-angle-double-left" onClick={() => decreaseSelectedDate()}/>
                <Button icon="pi pi-angle-double-right" onClick={() => increaseSelectedDat()}/>
              </ButtonGroup>
              <Calendar id="buttondisplay" value={dateSelected} onChange={(e) => setDateSelected(e.value)} showIcon />
          </div>
          <br/>

        {/* Date Picker */}

        {/* End Date Picker */}


         <div className="grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-4">

          {displayedGames.map((game, ID) => (
           
           <Card key={ID} className={'shadow-md'}> 
           {new Date(game.GameDateISO8601).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              timeZoneName: 'short',
            })} <br/>{game.venue_name}<br/>
           <Divider></Divider>
           <div className='p-1'>
              <div className="flex items-center gap-2">
                  <Avatar  image={game.VisitorLogo} size="large"/>
                  <span>{game.VisitorLongName}</span>
                  {game.awayTeamOwner &&  <Tag value={game.awayTeamOwner} rounded/> }
                  <span className="ml-auto p-3">{game.VisitorGoals}</span>
              </div>  
            </div>  
            <div className='p-1'>
              <div className="flex items-center gap-2">
                <Avatar  image={game.HomeLogo} size="large"/>
                <span>{game.HomeLongName}</span>
                {game.homeTeamOwner && <Tag value={game.homeTeamOwner} rounded/> }
                <span className="ml-auto p-3">{game.HomeGoals}</span>
              </div>   
            </div>   
           </Card>
          ))}

          {displayedGames.length === 0 && (
           <Card className={'shadow-md'}> 
            No Games on This Date <br/><br/>
           <Divider></Divider>
           <div className='p-1'>
              <div className="flex items-center gap-2">
                  <Avatar   size="large"/>
                  <span></span>
                  
                  <span className="ml-auto p-3"></span>
              </div>  
            </div>  
            <div className='p-1'>
              <div className="flex items-center gap-2">
                <Avatar  size="large"/>
                <span></span>
               
                <span className="ml-auto p-3"></span>
              </div>   
            </div>   
           </Card>
          )}

        </div>
        <br/>

        {/* End Game Score Section */}


        {/* Start Standings */}
        <DataTable value={displayedStandings}  header="Overall Standings" sortField="points" sortOrder={-1} className="shadow-md">
          <Column field="name" header="Name" body={teamDisplayTemplate}></Column>
          <Column field="points" header="Points"></Column>
          <Column field="games_played" header="Games Played"></Column>
          <Column field="wins" header="Wins"></Column>
          <Column field="ot_wins" header="OT Wins"></Column>
          <Column field="ot_losses" header="OT Losses"></Column>
          <Column field="losses" header="Losses"></Column>
          <Column field="ties" header="Ties"></Column>
        </DataTable>
        {/* End Standings */}


        {/* Leaders Section */}

        {/* Points Leaders */}
        <DataTable value={leadersPoints}  header="Points Leaders" sortField="points" sortOrder={-1} className="shadow-md mt-4">
          <Column field="name" header="Player Name" body={playerNameTemplate}></Column>
          <Column field="team_name" header="Team" body={playerTeamTemplate}></Column>
          <Column field="points" header="Points"></Column>
          <Column field="goals" header="Goals"></Column>
          <Column field="assists" header="Assists"></Column>
        </DataTable>
        {/* End Points Leaders */}


        {/* End Leaders Section */}   


       
      
    </div>
  )
}


