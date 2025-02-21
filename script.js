document.getElementById('searchBtn').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    if (username) {
        fetchUUID(username);
    } else {
        alert('Bitte einen Minecraft Namen eingeben.');
    }
});

document.getElementById('backBtn').addEventListener('click', function() {
    document.getElementById('stats').style.display = 'none';
    document.getElementById('backBtn').style.display = 'none';
    document.getElementById('searchSection').style.display = 'flex';
    document.getElementById('username').value = '';
});

function checkEnter(event) {
    if (event.key === 'Enter') {
        document.getElementById('searchBtn').click();
    }
}

function fetchUUID(username) {
    const corsProxy = 'https://api.allorigins.win/get?url=';
    const mojangApiUrl = `https://api.mojang.com/users/profiles/minecraft/${username}`;

    fetch(corsProxy + encodeURIComponent(mojangApiUrl))
        .then(response => {
            if (!response.ok) {
                throw new Error('Minecraft Name nicht gefunden');
            }
            return response.json();
        })
        .then(data => {
            const uuid = JSON.parse(data.contents).id;
            const formattedUUID = formatUUID(uuid);
            fetchSkin(uuid); // Fetch and display skin
            fetchStats(formattedUUID);
        })
        .catch(error => {
            console.error('Fehler beim Abrufen der UUID:', error);
            alert(error.message);
        });
}

function formatUUID(uuid) {
    return `${uuid.slice(0, 8)}-${uuid.slice(8, 12)}-${uuid.slice(12, 16)}-${uuid.slice(16, 20)}-${uuid.slice(20)}`;
}

function fetchSkin(uuid) {
    const skinUrl = `https://mc-heads.net/body/${uuid}/100`;
    const statsDiv = document.getElementById('stats');
    statsDiv.innerHTML = `
        <div class="skin">
            <img src="${skinUrl}" alt="Skin von ${uuid}">
        </div>
    `;
}

function fetchStats(uuid) {
    fetch(`https://api.hglabor.de/stats/FFA/${uuid}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Statistiken nicht gefunden');
            }
            return response.json();
        })
        .then(data => {
            if (data && Object.keys(data).length > 0) {
                displayStats(data);
            } else {
                displayNoStats();
            }
        })
        .catch(error => {
            console.error('Fehler beim Abrufen der Statistiken:', error);
            alert(error.message);
        });
}

function displayStats(data) {
    const statsDiv = document.getElementById('stats');
    statsDiv.innerHTML += `
        <h2>Statistiken für Spieler</h2>
        <p>Kills: ${data.kills || 0}</p>
        <p>Tode: ${data.deaths || 0}</p>
        <p>KD Ratio: ${(data.kills / data.deaths).toFixed(2) || 0}</p>
        ${data.points !== undefined ? `<p>Punkte: ${data.points}</p>` : ''}
        ${data.gamesPlayed !== undefined ? `<p>Spiele gespielt: ${data.gamesPlayed}</p>` : ''}
        ${data.gamesWon !== undefined ? `<p>Gewonnene Spiele: ${data.gamesWon}</p>` : ''}
        <p>Aktuelle Kill-Streak: ${data.currentKillStreak || 'Info nur wenn player on ist.'}</p>
        <p>Höchste Kill-Streak: ${data.highestKillStreak || 'Keine Informationen'}</p>
        <p>Kopfgeld: ${data.bounty || 'Info nur wenn player on ist.'}</p>
        <p>XP: ${data.xp || 'Keine Informationen'}</p>
    `;
    document.getElementById('searchSection').style.display = 'none';
    document.getElementById('stats').style.display = 'block';
    document.getElementById('backBtn').style.display = 'block';
}

function displayNoStats() {
    const statsDiv = document.getElementById('stats');
    statsDiv.innerHTML += `
        <h2>Keine Statistiken gefunden</h2>
        <p>Es wurden keine Statistiken für diesen Spieler gefunden.</p>
    `;
    document.getElementById('searchSection').style.display = 'none';
    document.getElementById('stats').style.display = 'block';
    document.getElementById('backBtn').style.display = 'block';
}

// Check server status
function checkServerStatus() {
    const serverIp = 'hglabor.de'; // Replace with your Minecraft server IP
    fetch(`https://api.mcsrvstat.us/2/${serverIp}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Serverstatus nicht verfügbar');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('serverStatus').innerText = data.online ? 'Online' : 'Offline';
        })
        .catch(error => {
            console.error('Fehler beim Abrufen des Serverstatus:', error);
            document.getElementById('serverStatus').innerText = 'Fehler';
        });
}

checkServerStatus();