const express = require("express");
const Path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
const dbPath = Path.join(__dirname, "cricketTeam.db");
let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server Running at http://localhost:3000 ");
    });
  } catch (e) {
    console.log(`DB error:${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();
//api 1 get all players
app.get("/players/", async (request, response) => {
  const getPlayerQuery = `
    select * from cricket_team
    order by player_id;`;
  const playerArray = await db.all(getPlayerQuery);
  response.send(playerArray);
});
//added new player
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { player_id, player_name, jersey_number, role } = playerDetails;
  const addNewPlayer = `insert into cricket_team
    (player_name,jersey_number,role)
    values ('${player_name}',${jersey_number},'${role}');`;
  const dbPlayer = await db.run(addNewPlayer);
  const PlayerId = dbPlayer.lastID;
  response.send("Player Added to Team");
});
//api3 only one player
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerID = `select * from cricket_team
    where player_id=${playerId};`;
  const onePlayer = await db.get(getPlayerID);
  response.send(onePlayer);
});

//api 4 updata data

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetail = request.body;
  const { player_id, player_name, jersey_number, role } = playerDetail;
  const updateData = `UPDATE 
    cricket_team 
    SET
    player_name='${player_name}',
    jersey_number=${jersey_number},
    role='${role}'
    where 
      player_id = ${playerId};`;
  await db.run(updateData);
  response.send("Player Details Updated");
});

//api 5 delete

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayer = `delete from cricket_team 
    where player_id=${playerId};`;
  await db.run(deletePlayer);
  response.send("Player Removed");
});
module.exports = app;
