import React, { useEffect, useState } from "react";

function App() {
  const [backendData, setBackendData] = useState({
    player_name: "",
    age: "",
    PTS: "",
    AST: "",
    TRB: "",
    games: 0
  });
  const [seasonNum, setSeasonNum] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [totalSeasons, setTotalSeasons] = useState(0);
  const [submittedPlayerName, setSubmittedPlayerName] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (formSubmitted) {
      fetch(
        `https://nba-stats-db.herokuapp.com/api/playerdata/name/${submittedPlayerName}`
      )
        .then((response) => response.json())
        .then((data) => {
          const { count } = data;
          setTotalSeasons(count);
          const seasonData = data.results[seasonNum];
          if (seasonData === undefined) {
            setBackendData({ player_name: "No player found" });
          } else {
            const { player_name, season, age, PTS, AST, TRB, games } = seasonData;
            setBackendData({ player_name, season, age, PTS, AST, TRB, games });
          }
          setDataLoaded(true);
        });
    }
  }, [seasonNum, formSubmitted, submittedPlayerName]);

  const handleSearch = (event) => {
    event.preventDefault();
    setFormSubmitted(true);
    setSubmittedPlayerName(event.target[0].value);
    setSeasonNum(0);
    setPlayerName("");
    setDataLoaded(false);
  };

  const handleClick = (event) => {
    if (event.target.name === "prevSeason" && seasonNum < totalSeasons - 1) {
      setSeasonNum(seasonNum + 1);
    } else if (event.target.name === "nextSeason" && seasonNum > 0) {
      setSeasonNum(seasonNum - 1);
    }
  };

  const handleChange = (event) => {
    setPlayerName(event.target.value);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-4 flex flex-col items-center">
      <h1 className="text-5xl mt-10 font-bold mb-4">NBA Player Stats</h1>
      <h4 className="text-lg mt-10 mb-4">Enter a player name to see their stats!</h4>
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          onChange={handleChange}
          value={playerName}
          placeholder="Enter player name"
          className="px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-800 text-white w-80"
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring focus:border-blue-300"
        >
          Search
        </button>
      </form>
      {dataLoaded && (
        <div className="mt-5">
          <h1 className="text-2xl font-bold">
            {backendData.player_name} - {backendData.season}
          </h1>
          {backendData.player_name === "No player found" ? null : (
            <>
              <h3 className="text-xl mt-2">{backendData.age} years old</h3>
              <p className="mt-2 mb-2">{(backendData.PTS /backendData.games).toFixed(1)} points</p>
              <p className="mt-2 mb-2">{(backendData.AST / backendData.games).toFixed(1)} assists</p>
              <p className="mt-2 mb-2">{(backendData.TRB / backendData.games).toFixed(1)} total rebounds</p>

              <button
                onClick={handleClick}
                name="prevSeason"
                className={`mt-4 mr-2 px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                  seasonNum === totalSeasons - 1
                    ? "bg-gray-500 cursor-default"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={seasonNum === totalSeasons - 1}
              >
                Previous season
              </button>
              <button
                onClick={handleClick}
                name="nextSeason"
                className={`mt-2 px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                  seasonNum === 0
                    ? "bg-gray-500 cursor-default"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={seasonNum === 0}
              >
                Next season
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
