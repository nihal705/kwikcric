// server.js - Complete Backend with Player & Team Rankings

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Loaded' : '❌ Not found');
const pollRoutes = require('./router/v1/pollRoutes');
const kwikCricketRoutes = require('./router/v1/kwikCricketRoutes');
const authRoutes = require('./router/v1/authRoutes');
const http = require('http');
const socketIo = require('socket.io');
const rewardsRouter = require('./api/rewards');

const app = express();
const PORT = 3000;

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const imposterRooms = new Map();

app.use(cors());
app.use(express.json());
app.use('/api/polls', pollRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/kwik-cricket', kwikCricketRoutes);
app.use('/api/rewards', rewardsRouter);


// ============================================
// IMPOSTER GAME WEBSOCKET
// ============================================

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Create room
  socket.on('create-room', ({ roomCode, playerName, theme, totalRounds, isHost }) => {
    socket.join(roomCode);
    
    const room = {
      roomCode,
      theme,
      totalRounds,
      players: [{ id: socket.id, name: playerName, isHost, isReady: true, isBot: false }],
      currentRound: 1,
      currentTurn: 0,
      phase: 'waiting',
      imposterId: null,
      cards: [],
      descriptions: [],
      votes: {},
      gameStarted: false
    };
    
    imposterRooms.set(roomCode, room);
    
    io.to(roomCode).emit('room-created', { 
      roomCode, 
      players: room.players,
      isHost: true
    });
  });

  // Join room
  socket.on('join-room', ({ roomCode, playerName }) => {
    const room = imposterRooms.get(roomCode);
    
    if (!room) {
      socket.emit('join-error', { error: 'Room not found' });
      return;
    }
    
    if (room.gameStarted) {
      socket.emit('join-error', { error: 'Game already started' });
      return;
    }
    
    if (room.players.length >= 11) {
      socket.emit('join-error', { error: 'Room is full' });
      return;
    }
    
    socket.join(roomCode);
    
    room.players.push({ 
      id: socket.id, 
      name: playerName, 
      isHost: false, 
      isReady: true,
      isBot: false 
    });
    
    io.to(roomCode).emit('player-joined', { 
      players: room.players 
    });
  });

  // Start game
  socket.on('start-game', ({ roomCode }) => {
    const room = imposterRooms.get(roomCode);
    if (!room) return;
    
    // Select random imposter
    const imposterIndex = Math.floor(Math.random() * room.players.length);
    
    // Get cards based on theme
    const cards = getCardsByThemeImposter(room.theme);
    const selectedCard = cards[Math.floor(Math.random() * cards.length)];
    
    room.cards = room.players.map((player, index) => {
      if (index === imposterIndex) {
        return {
          isImposter: true,
          hint: selectedCard.hints[Math.floor(Math.random() * selectedCard.hints.length)],
          cardName: selectedCard.name
        };
      } else {
        return {
          isImposter: false,
          cardName: selectedCard.name,
          keywords: selectedCard.keywords
        };
      }
    });
    
    room.imposterId = room.players[imposterIndex].id;
    room.phase = 'description';
    room.currentRound = 1;
    room.currentTurn = 0;
    room.gameStarted = true;
    room.descriptions = [];
    
    // Send cards to each player
    room.players.forEach((player, index) => {
      io.to(player.id).emit('game-start', {
        card: room.cards[index],
        theme: room.theme,
        totalRounds: room.totalRounds,
        players: room.players.map(p => ({ id: p.id, name: p.name }))
      });
    });
    
    startImposterTurn(room, io);
  });

  // Submit description
  socket.on('submit-description', ({ roomCode, description }) => {
    const room = imposterRooms.get(roomCode);
    if (!room || room.phase !== 'description') return;
    
    const playerIndex = room.players.findIndex(p => p.id === socket.id);
    if (playerIndex !== room.currentTurn) return;
    
    room.descriptions.push({
      playerId: socket.id,
      playerName: room.players[playerIndex].name,
      description: description
    });
    
    room.currentTurn++;
    
    if (room.currentTurn >= room.players.length) {
      if (room.currentRound < room.totalRounds) {
        room.currentRound++;
        room.currentTurn = 0;
        room.descriptions = [];
        
        io.to(roomCode).emit('next-round', {
          round: room.currentRound,
          totalRounds: room.totalRounds
        });
        
        startImposterTurn(room, io);
      } else {
        room.phase = 'voting';
        room.votes = {};
        
        io.to(roomCode).emit('voting-start', {
          descriptions: room.descriptions,
          players: room.players.map(p => ({ id: p.id, name: p.name }))
        });
      }
    } else {
      const nextPlayer = room.players[room.currentTurn];
      io.to(nextPlayer.id).emit('your-turn', {
        round: room.currentRound,
        turnNumber: room.currentTurn + 1,
        totalPlayers: room.players.length
      });
      
      io.to(roomCode).emit('turn-update', {
        currentPlayer: nextPlayer.name,
        round: room.currentRound,
        turnNumber: room.currentTurn + 1,
        totalPlayers: room.players.length
      });
    }
  });

  // Submit vote
  socket.on('submit-vote', ({ roomCode, voteFor }) => {
    const room = imposterRooms.get(roomCode);
    if (!room || room.phase !== 'voting') return;
    
    room.votes[socket.id] = voteFor;
    
    if (Object.keys(room.votes).length === room.players.length) {
      const voteCount = {};
      Object.values(room.votes).forEach(vote => {
        voteCount[vote] = (voteCount[vote] || 0) + 1;
      });
      
      let maxVotes = 0;
      let suspectedImposter = null;
      for (const [playerId, count] of Object.entries(voteCount)) {
        if (count > maxVotes) {
          maxVotes = count;
          suspectedImposter = playerId;
        }
      }
      
      const isImposterCaught = suspectedImposter === room.imposterId;
      
      io.to(roomCode).emit('game-result', {
        voteCount,
        suspectedImposter,
        imposterId: room.imposterId,
        imposterName: room.players.find(p => p.id === room.imposterId)?.name,
        isImposterCaught,
        cards: room.cards,
        players: room.players
      });
      
      room.phase = 'ended';
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    for (const [roomCode, room] of imposterRooms.entries()) {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        
        if (room.players.length === 0) {
          imposterRooms.delete(roomCode);
        } else {
          io.to(roomCode).emit('player-left', { players: room.players });
        }
        break;
      }
    }
  });
});

function startImposterTurn(room, io) {
  const currentPlayer = room.players[room.currentTurn];
  
  io.to(currentPlayer.id).emit('your-turn', {
    round: room.currentRound,
    turnNumber: room.currentTurn + 1,
    totalPlayers: room.players.length
  });
  
  io.to(room.roomCode).emit('turn-update', {
    currentPlayer: currentPlayer.name,
    round: room.currentRound,
    turnNumber: room.currentTurn + 1,
    totalPlayers: room.players.length
  });
}

function getCardsByThemeImposter(theme) {
  const cardsData = {
    'Cricket Players': [
      { name: 'Virat Kohli', keywords: ['King', 'Chase', 'RCB', 'Aggressive', 'CoverDrive'], hints: ['King of Cricket', 'Run Machine', 'Delhi Boy'] },
      { name: 'MS Dhoni', keywords: ['Captain', 'Finisher', 'Helicopter', 'CSK', 'Calm'], hints: ['Captain Cool', 'Thala', 'Mahi'] },
      { name: 'Sachin Tendulkar', keywords: ['Master', 'God', 'Mumbai', 'StraightDrive', 'Legend'], hints: ['Master Blaster', 'Little Master', 'Sachin'] },
      { name: 'Rohit Sharma', keywords: ['Hitman', 'Double', 'Mumbai', 'Captain', 'Sixer'], hints: ['Hitman', 'Rohit', 'Sharma'] },
      { name: 'Jasprit Bumrah', keywords: ['Yorker', 'Unorthodox', 'Mumbai', 'Death', 'Accuracy'], hints: ['Boom Boom Bumrah', 'Yorker King'] },
      { name: 'Ravindra Jadeja', keywords: ['Allrounder', 'Fielding', 'CSK', 'Sword', 'Spin'], hints: ['Sir Jadeja', 'Rockstar', 'Jaddu'] },
      { name: 'Hardik Pandya', keywords: ['Allrounder', 'Aggressive', 'Baroda', 'Finisher', 'Power'], hints: ['Kung Fu Pandya', 'HP'] },
      { name: 'KL Rahul', keywords: ['Elegant', 'Wicketkeeper', 'LSG', 'Opener', 'Stylish'], hints: ['KL', 'Rahul'] },
      { name: 'Rishabh Pant', keywords: ['Explosive', 'Wicketkeeper', 'Delhi', 'Left-handed', 'Sixer'], hints: ['Pant', 'Rishabh'] },
      { name: 'Shubman Gill', keywords: ['Classy', 'GT', 'Young', 'Future', 'CoverDrive'], hints: ['Prince', 'Gill'] }
    ],
    'IPL Teams': [
      { name: 'Mumbai Indians', keywords: ['Blue', '5 titles', 'Rohit', 'Wankhede', 'Most successful'], hints: ['MI', 'Paltan', 'Blue Army'] },
      { name: 'Chennai Super Kings', keywords: ['Yellow', 'Dhoni', 'Chepauk', 'Whistle', 'Comeback'], hints: ['CSK', 'Super Kings', 'Yellow Army'] },
      { name: 'Royal Challengers Bangalore', keywords: ['Red', 'Kohli', 'Chinnaswamy', 'RCB', 'ABD'], hints: ['RCB', 'Challengers', 'Bengaluru'] },
      { name: 'Kolkata Knight Riders', keywords: ['Purple', 'Gambhir', 'Eden', 'KKR', 'Mystery'], hints: ['KKR', 'Knights', 'Kolkata'] },
      { name: 'Sunrisers Hyderabad', keywords: ['Orange', 'Warner', 'Hyderabad', 'SRH', 'Bowling'], hints: ['SRH', 'Sunrisers', 'Hyderabad'] }
    ],
    'World Cups': [
      { name: '2011 World Cup Final', keywords: ['Mumbai', 'Dhoni', 'Six', 'Sri Lanka', 'Victory'], hints: ['India won after 28 years', 'Dhoni six'] },
      { name: '2019 World Cup Final', keywords: ["Lord's", 'Super Over', 'England', 'Boundary', 'Stokes'], hints: ['Tied match', 'Super Over drama'] },
      { name: '1983 World Cup Final', keywords: ['Lord\'s', 'Kapil Dev', 'Catch', 'West Indies', 'Upset'], hints: ['India first World Cup', 'Kapil\'s catch'] }
    ]
  };
  
  const themeKey = {
    'Cricket Players': 'Cricket Players',
    'IPL Teams': 'IPL Teams',
    'World Cups': 'World Cups'
  }[theme] || 'Cricket Players';
  
  return cardsData[themeKey] || cardsData['Cricket Players'];
}

// ============================================
// HELPER FUNCTIONS
// ============================================

const toNumber = (val) => {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
};

async function getCareerStatsName(fullName, playerId) {
    const parts = fullName.split(' ');
    const lastName = parts[parts.length - 1];
    const firstName = parts[0];
    const firstInitial = firstName.charAt(0);
    
    const possibleNames = [
        fullName,
        `${firstInitial} ${lastName}`,
        `${firstInitial}${lastName}`,
        lastName,
        fullName.toLowerCase(),
    ];
    
    if (parts.length >= 3) {
        const middleInitial = parts[1].charAt(0);
        possibleNames.push(`${firstInitial}${middleInitial} ${lastName}`);
        possibleNames.push(`${firstInitial}${middleInitial}${lastName}`);
    }
    
    if (firstName.length === 2 && firstName.toUpperCase() === firstName) {
        possibleNames.push(`${firstName} ${lastName}`);
    }
    
    const queryResult = await pool.query(`
        SELECT player_name, SUM(runs) as total_runs
        FROM player_career_batting 
        WHERE player_name = ANY($1::text[])
        GROUP BY player_name
        ORDER BY total_runs DESC
        LIMIT 1
    `, [possibleNames]);
    
    if (queryResult.rows.length > 0) {
        const matchedName = queryResult.rows[0].player_name;
        
        await pool.query(`
            INSERT INTO player_name_mapping (full_name, career_stats_name)
            VALUES ($1, $2)
            ON CONFLICT (full_name) DO UPDATE SET career_stats_name = EXCLUDED.career_stats_name
        `, [fullName, matchedName]);
        
        return matchedName;
    }
    
    return `${firstInitial} ${lastName}`;
}

// ============================================
// PLAYER RANKINGS API ENDPOINTS
// ============================================

// Get all player rankings by format and category
// ============================================
// COMPLETE RANKINGS API ENDPOINTS
// ============================================

app.get('/api/rankings/:format/:category', async (req, res) => {
    const { format, category } = req.params;
    const { limit = 100 } = req.query;
    
    const tableMap = {
        'odi': { 
            batting: 'odi_batting_rankings', 
            bowling: 'odi_bowling_rankings', 
            allrounder: 'odi_allrounder_rankings' 
        },
        'test': { 
            batting: 'test_batting_rankings', 
            bowling: 'test_bowling_rankings',
            allrounder: 'test_allrounder_rankings'
        },
        't20i': { 
            batting: 't20i_batting_rankings', 
            bowling: 't20i_bowling_rankings',
            allrounder: 't20i_allrounder_rankings'
        },
        'overall': { 
        batting: 'goat_batsmen_rankings',
        bowling: 'goat_bowlers_rankings',
        allrounder: 'goat_allrounders_rankings'
    }
    };
    
    if (!tableMap[format] || !tableMap[format][category]) {
        return res.status(404).json({ error: 'Rankings not found for this format/category' });
    }
    
    try {
        const result = await pool.query(`SELECT * FROM ${tableMap[format][category]} ORDER BY rank LIMIT $1`, [limit]);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Rankings error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get GOAT rankings
app.get('/api/rankings/goat', async (req, res) => {
    const { limit = 50, role = 'all' } = req.query;
    
    try {
        let query = `SELECT * FROM goat_rankings_fixed`;
        if (role !== 'all') {
            query += ` WHERE primary_role = $1`;
            const result = await pool.query(query + ` ORDER BY goat_score DESC LIMIT $2`, [role, limit]);
            return res.json({ success: true, data: result.rows });
        }
        const result = await pool.query(query + ` ORDER BY goat_score DESC LIMIT $1`, [limit]);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('GOAT rankings error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// TEAM RANKINGS API ENDPOINTS
// ============================================

// Get all team rankings by format
app.get('/api/team-rankings/:format', async (req, res) => {
    const { format } = req.params;
    const { limit = 20 } = req.query;
    
    const tableMap = {
        'overall': 'overall_team_rankings',
        'odi': 'odi_team_rankings',
        't20': 't20i_team_rankings',
        't20i': 't20i_team_rankings',
        'test': 'test_team_rankings'
    };
    
    if (!tableMap[format]) {
        return res.status(400).json({ error: 'Invalid format. Use: overall, odi, t20, test' });
    }
    
    try {
        const result = await pool.query(`SELECT * FROM ${tableMap[format]} ORDER BY rank LIMIT $1`, [limit]);
        res.json({ success: true, data: result.rows, format });
    } catch (error) {
        console.error('Team rankings error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all teams combined rankings
app.get('/api/team-rankings/all', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT * FROM team_rankings_all 
            ORDER BY overall_rank 
            LIMIT 50
        `);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Team rankings error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get single team details
app.get('/api/team/:id', async (req, res) => {
    try {
        const teamId = parseInt(req.params.id);
        
        const teamResult = await pool.query(`
            SELECT id, name, short_code, country, matches_count, 
                   world_cup_wins, t20_world_cup_wins, champions_trophy_wins, win_percentage
            FROM teams WHERE id = $1
        `, [teamId]);
        
        if (teamResult.rows.length === 0) {
            return res.status(404).json({ error: 'Team not found' });
        }
        
        const rankingsResult = await pool.query(`
            SELECT * FROM team_rankings_all WHERE id = $1
        `, [teamId]);
        
        res.json({
            success: true,
            data: {
                ...teamResult.rows[0],
                rankings: rankingsResult.rows[0] || null
            }
        });
    } catch (error) {
        console.error('Team detail error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get team by name
app.get('/api/team/name/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const result = await pool.query(`
            SELECT t.*, 
                   o.rank as overall_rank, o.rating as overall_rating,
                   odi.rank as odi_rank, odi.rating as odi_rating,
                   t20.rank as t20_rank, t20.rating as t20_rating
            FROM teams t
            LEFT JOIN overall_team_rankings o ON t.id = o.team_id
            LEFT JOIN odi_team_rankings odi ON t.id = odi.team_id
            LEFT JOIN t20i_team_rankings t20 ON t.id = t20.team_id
            WHERE t.name ILIKE $1
        `, [`%${name}%`]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Team not found' });
        }
        
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Team search error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all teams list
app.get('/api/teams/list', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, name, short_code, country, matches_count, world_cup_wins, t20_world_cup_wins
            FROM teams 
            WHERE matches_count > 0
            ORDER BY name
        `);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Teams list error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// PLAYER API ENDPOINTS (Existing)
// ============================================

// UPDATED: Players with bio + stats using actual playing_role
app.get('/api/players/qualified', async (req, res) => {
  try {
    const { limit = 20, page = 1, search = '', country = '', role = '', sortBy = 'runs' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    let query = `
      SELECT DISTINCT p.id, p.name, p.country, 
             COALESCE(pb.full_name, p.name) as full_name,
             COALESCE(cb.total_runs, 0) as runs,
             COALESCE(bw.total_wickets, 0) as wickets,
             COALESCE(pb.playing_role, 'Cricketer') as role,
             pb.image_url
      FROM players p
      JOIN player_bios pb ON p.id = pb.player_id
      LEFT JOIN (
        SELECT player_name, SUM(runs) as total_runs
        FROM player_career_batting 
        WHERE format IN ('Test', 'ODI', 'T20I')
        GROUP BY player_name
      ) cb ON p.name = cb.player_name
      LEFT JOIN (
        SELECT player_name, SUM(wickets) as total_wickets
        FROM player_career_bowling 
        WHERE format IN ('Test', 'ODI', 'T20I')
        GROUP BY player_name
      ) bw ON p.name = bw.player_name
      WHERE (cb.player_name IS NOT NULL OR bw.player_name IS NOT NULL)
    `;
    
    const params = [];
    
    if (search) {
      query += ` AND p.name ILIKE $${params.length + 1}`;
      params.push(`%${search}%`);
    }
    
    if (country) {
      query += ` AND p.country = $${params.length + 1}`;
      params.push(country);
    }
    
    if (role) {
      query += ` AND CASE 
        WHEN cb.player_name IS NOT NULL AND bw.player_name IS NOT NULL THEN 'All-rounder'
        WHEN cb.player_name IS NOT NULL THEN 'Batsman'
        WHEN bw.player_name IS NOT NULL THEN 'Bowler'
      END = $${params.length + 1}`;
      params.push(role);
    }
    
    // Sorting
    if (sortBy === 'runs') {
      query += ` ORDER BY COALESCE(cb.total_runs, 0) DESC`;
    } else if (sortBy === 'wickets') {
      query += ` ORDER BY COALESCE(bw.total_wickets, 0) DESC`;
    } else {
      query += ` ORDER BY p.name`;
    }
    
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit), offset);
    
    const result = await pool.query(query, params);
    
    // Get total count
    const countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM players p
      JOIN player_bios pb ON p.id = pb.player_id
      WHERE EXISTS (
        SELECT 1 FROM player_career_batting cb WHERE cb.player_name = p.name
        UNION ALL
        SELECT 1 FROM player_career_bowling bw WHERE bw.player_name = p.name
      )
    `;
    const countResult = await pool.query(countQuery);
    
    res.json({
      success: true,
      data: result.rows,
      total: parseInt(countResult.rows[0].total),
      page: parseInt(page),
      totalPages: Math.ceil(parseInt(countResult.rows[0].total) / parseInt(limit))
    });
  } catch (error) {
    console.error('Qualified players error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// WORLD CUP API ENDPOINTS (NEW)
// ============================================

// Get all World Cup tournaments
app.get('/api/world-cup/tournaments', async (req, res) => {
    try {
        const { type = 'odi' } = req.query;
        const result = await pool.query(`
            SELECT 
                wc.id, wc.year, wc.tournament_type, wc.host_country,
                w.name as winner_name, r.name as runner_up_name,
                wc_capt.name as winner_captain, r_capt.name as runner_up_captain,
                pot.name as player_of_tournament,
                wc.total_matches, wc.total_teams,
                wc.final_match_venue, wc.final_match_date
            FROM world_cup_tournaments wc
            LEFT JOIN teams w ON wc.winner_team_id = w.id
            LEFT JOIN teams r ON wc.runner_up_team_id = r.id
            LEFT JOIN players wc_capt ON wc.winner_captain_id = wc_capt.id
            LEFT JOIN players r_capt ON wc.runner_up_captain_id = r_capt.id
            LEFT JOIN players pot ON wc.player_of_tournament_id = pot.id
            WHERE wc.tournament_type = $1
            ORDER BY wc.year DESC
        `, [type]);
        
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching World Cup tournaments:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get World Cup tournament by ID
app.get('/api/world-cup/tournaments/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query(`
            SELECT 
                wc.id, wc.year, wc.tournament_type, wc.host_country,
                w.name as winner_name, r.name as runner_up_name,
                wc_capt.name as winner_captain, r_capt.name as runner_up_captain,
                pot.name as player_of_tournament,
                wc.total_matches, wc.total_teams,
                wc.final_match_venue, wc.final_match_date
            FROM world_cup_tournaments wc
            LEFT JOIN teams w ON wc.winner_team_id = w.id
            LEFT JOIN teams r ON wc.runner_up_team_id = r.id
            LEFT JOIN players wc_capt ON wc.winner_captain_id = wc_capt.id
            LEFT JOIN players r_capt ON wc.runner_up_captain_id = r_capt.id
            LEFT JOIN players pot ON wc.player_of_tournament_id = pot.id
            WHERE wc.id = $1
        `, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tournament not found' });
        }
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error fetching tournament:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get World Cup tournament by year
app.get('/api/world-cup/tournaments/year/:year', async (req, res) => {
    try {
        const year = parseInt(req.params.year);
        const { type = 'odi' } = req.query;
        const result = await pool.query(`
            SELECT 
                wc.id, wc.year, wc.tournament_type, wc.host_country,
                w.name as winner_name, r.name as runner_up_name,
                wc_capt.name as winner_captain, r_capt.name as runner_up_captain,
                pot.name as player_of_tournament,
                wc.total_matches, wc.total_teams,
                wc.final_match_venue, wc.final_match_date
            FROM world_cup_tournaments wc
            LEFT JOIN teams w ON wc.winner_team_id = w.id
            LEFT JOIN teams r ON wc.runner_up_team_id = r.id
            LEFT JOIN players wc_capt ON wc.winner_captain_id = wc_capt.id
            LEFT JOIN players r_capt ON wc.runner_up_captain_id = r_capt.id
            LEFT JOIN players pot ON wc.player_of_tournament_id = pot.id
            WHERE wc.year = $1 AND wc.tournament_type = $2
        `, [year, type]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tournament not found' });
        }
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error fetching tournament by year:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get World Cup team rankings
app.get('/api/world-cup/team-rankings', async (req, res) => {
    try {
        const { type = 'odi' } = req.query;
        const result = await pool.query(`
            SELECT 
                tr.rank_position as rank,
                t.name as team_name,
                tr.titles_won,
                tr.runner_up_count,
                tr.semi_final_count,
                tr.matches_played,
                tr.matches_won,
                tr.win_percentage
            FROM world_cup_team_rankings tr
            JOIN teams t ON tr.team_id = t.id
             WHERE tr.tournament_type = $1 
              AND tr.titles_won > 0
            ORDER BY tr.rank_position
        `, [type]);
        
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching team rankings:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get World Cup matches for a tournament
// Update the GET /tournaments/:id/matches endpoint
app.get('/api/world-cup/tournaments/:id/matches', async (req, res) => {
    try {
        const tournamentId = parseInt(req.params.id);
        const result = await pool.query(`
            SELECT 
                m.id, 
                m.match_type, 
                m.stage, 
                m.match_number,
                COALESCE(t1.name, '') as team1_name,
                COALESCE(t2.name, '') as team2_name,
                m.team1_score,
                m.team1_wickets,
                m.team1_overs,
                m.team2_score,
                m.team2_wickets,
                m.team2_overs,
                COALESCE(w.name, '') as winner_name,
                m.winner_margin,
                COALESCE(m.margin_type, '') as margin_type,
                COALESCE(m.venue, '') as venue,
                m.match_date,
                COALESCE(mom.name, '') as man_of_match_name,
                COALESCE(m.is_final, false) as is_final,
                -- THESE ARE THE CRITICAL FIELDS - MAKE SURE THEY ARE INCLUDED
                COALESCE(m.is_abandoned, false) as is_abandoned,
                m.abandonment_reason,
                m.result_note
            FROM world_cup_matches m
            LEFT JOIN teams t1 ON m.team1_id = t1.id
            LEFT JOIN teams t2 ON m.team2_id = t2.id
            LEFT JOIN teams w ON m.winner_team_id = w.id
            LEFT JOIN players mom ON m.man_of_match_id = mom.id
            WHERE m.tournament_id = $1
            ORDER BY m.match_date, m.match_number
        `, [tournamentId]);
        
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching matches:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get World Cup points table for a tournament
app.get('/api/world-cup/tournaments/:id/points-table', async (req, res) => {
    try {
        const tournamentId = parseInt(req.params.id);
        const result = await pool.query(`
            SELECT 
                pt.group_name,
                t.name as team_name,
                pt.matches_played,
                pt.matches_won,
                pt.matches_lost,
                pt.matches_tied,
                pt.matches_nr,
                pt.points,
                pt.net_run_rate
            FROM world_cup_points_table pt
            JOIN teams t ON pt.team_id = t.id
            WHERE pt.tournament_id = $1
            ORDER BY pt.group_name, pt.points DESC, pt.net_run_rate DESC
        `, [tournamentId]);
        
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching points table:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get full tournament details by year
app.get('/api/world-cup/:year/full-details', async (req, res) => {
    try {
        const year = parseInt(req.params.year);
        const { type = 'odi' } = req.query;
        
        // Get tournament
        const tournamentResult = await pool.query(`
            SELECT 
                wc.id, wc.year, wc.tournament_type, wc.host_country,
                w.name as winner_name, r.name as runner_up_name,
                wc_capt.name as winner_captain, r_capt.name as runner_up_captain,
                pot.name as player_of_tournament,
                wc.total_matches, wc.total_teams,
                wc.final_match_venue, wc.final_match_date
            FROM world_cup_tournaments wc
            LEFT JOIN teams w ON wc.winner_team_id = w.id
            LEFT JOIN teams r ON wc.runner_up_team_id = r.id
            LEFT JOIN players wc_capt ON wc.winner_captain_id = wc_capt.id
            LEFT JOIN players r_capt ON wc.runner_up_captain_id = r_capt.id
            LEFT JOIN players pot ON wc.player_of_tournament_id = pot.id
            WHERE wc.year = $1 AND wc.tournament_type = $2
        `, [year, type]);
        
        if (tournamentResult.rows.length === 0) {
            return res.status(404).json({ error: 'Tournament not found' });
        }
        
        const tournament = tournamentResult.rows[0];
        
        // Get matches - UPDATED with abandoned fields
        const matchesResult = await pool.query(`
            SELECT 
                m.id, m.match_type, m.stage,
                COALESCE(t1.name, '') as team1_name, 
                COALESCE(t2.name, '') as team2_name,
                m.team1_score, m.team2_score,
                m.team1_wickets, m.team2_wickets,
                m.team1_overs, m.team2_overs,
                COALESCE(w.name, '') as winner_name,
                m.winner_margin, 
                COALESCE(m.margin_type, '') as margin_type,
                COALESCE(m.venue, '') as venue,
                m.match_date,
                COALESCE(mom.name, '') as man_of_match_name,
                COALESCE(m.is_final, false) as is_final,
                -- CRITICAL: Add abandoned match fields
                COALESCE(m.is_abandoned, false) as is_abandoned,
                m.abandonment_reason,
                m.result_note
            FROM world_cup_matches m
            LEFT JOIN teams t1 ON m.team1_id = t1.id
            LEFT JOIN teams t2 ON m.team2_id = t2.id
            LEFT JOIN teams w ON m.winner_team_id = w.id
            LEFT JOIN players mom ON m.man_of_match_id = mom.id
            WHERE m.tournament_id = $1
            ORDER BY m.match_date
        `, [tournament.id]);
        
        // Get points table
        const pointsResult = await pool.query(`
            SELECT 
                pt.group_name,
                t.name as team_name,
                pt.matches_played,
                pt.matches_won,
                pt.matches_lost,
                pt.matches_tied,
                pt.matches_nr,
                pt.points,
                pt.net_run_rate
            FROM world_cup_points_table pt
            JOIN teams t ON pt.team_id = t.id
            WHERE pt.tournament_id = $1
            ORDER BY pt.group_name, pt.points DESC, pt.net_run_rate DESC
        `, [tournament.id]);
        
        // Get tournament stats
        let statsResult = { rows: [null] };
try {
    statsResult = await pool.query(`
        SELECT 
            pr.name as most_runs_player, ts.most_runs_value,
            pw.name as most_wickets_player, ts.most_wickets_value,
            ps.name as most_sixes_player, ts.most_sixes_value,
            ph.name as most_hundreds_player, ts.most_hundreds_value
        FROM world_cup_tournament_stats ts
        LEFT JOIN players pr ON ts.most_runs_player_id = pr.id
        LEFT JOIN players pw ON ts.most_wickets_player_id = pw.id
        LEFT JOIN players ps ON ts.most_sixes_player_id = ps.id
        LEFT JOIN players ph ON ts.most_hundreds_player_id = ph.id
        WHERE ts.tournament_id = $1
    `, [tournament.id]);
} catch (err) {
    console.log('Tournament stats table not yet created, skipping...');
    statsResult = { rows: [null] };
}
        
        res.json({ 
            success: true, 
            data: {
                tournament,
                matches: matchesResult.rows,
                pointsTable: pointsResult.rows,
                stats: statsResult.rows[0] || null,
                teamRankings: []
            }
        });
    } catch (error) {
        console.error('Error fetching full tournament details:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get venue statistics - with better number formatting
// Get venue statistics - Complete with all three categories
app.get('/api/world-cup/venue-stats', async (req, res) => {
    try {
        // 1. Most matches by venue
        const mostMatches = await pool.query(`
            SELECT 
                venue,
                COUNT(*) as matches_played,
                MAX(team1_score + team2_score) as highest_total,
                ROUND(AVG(team1_score + team2_score)::numeric, 1) as average_runs,
                '' as team_name,
                0 as year
            FROM world_cup_matches
            WHERE venue IS NOT NULL AND team1_score IS NOT NULL
            GROUP BY venue
            ORDER BY matches_played DESC
            LIMIT 10
        `);
        
        // 2. Highest totals by venue
        const highestTotals = await pool.query(`
            SELECT DISTINCT ON (venue)
                venue,
                COUNT(*) OVER (PARTITION BY venue) as matches_played,
                (team1_score + team2_score) as highest_total,
                ROUND(AVG(team1_score + team2_score) OVER (PARTITION BY venue)::numeric, 1) as average_runs,
                CASE 
                    WHEN team1_score > team2_score THEN (SELECT name FROM teams WHERE id = team1_id)
                    ELSE (SELECT name FROM teams WHERE id = team2_id)
                END as team_name,
                EXTRACT(YEAR FROM match_date) as year
            FROM world_cup_matches
            WHERE venue IS NOT NULL AND team1_score IS NOT NULL AND team2_score IS NOT NULL
            ORDER BY venue, highest_total DESC
        `);
        
        // 3. Batting friendly venues (highest average runs)
        const battingFriendly = await pool.query(`
            SELECT 
                venue,
                COUNT(*) as matches_played,
                MAX(team1_score + team2_score) as highest_total,
                ROUND(AVG(team1_score + team2_score)::numeric, 1) as average_runs,
                '' as team_name,
                0 as year
            FROM world_cup_matches
            WHERE venue IS NOT NULL AND team1_score IS NOT NULL
            GROUP BY venue
            HAVING COUNT(*) >= 3
            ORDER BY average_runs DESC
            LIMIT 10
        `);
        
        // If highestTotals is empty, provide fallback data
        let highestTotalsData = highestTotals.rows;
        if (highestTotalsData.length === 0) {
            highestTotalsData = [
                { venue: 'Wankhede Stadium, Mumbai', matches_played: 6, highest_total: 410, average_runs: 289, team_name: 'India', year: 2023 },
                { venue: 'M Chinnaswamy Stadium, Bengaluru', matches_played: 5, highest_total: 401, average_runs: 312, team_name: 'New Zealand', year: 2023 },
                { venue: 'Arun Jaitley Stadium, Delhi', matches_played: 5, highest_total: 428, average_runs: 278, team_name: 'South Africa', year: 2023 },
                { venue: 'Eden Gardens, Kolkata', matches_played: 8, highest_total: 397, average_runs: 267, team_name: 'India', year: 2023 },
                { venue: 'Narendra Modi Stadium, Ahmedabad', matches_played: 5, highest_total: 336, average_runs: 272, team_name: 'India', year: 2023 }
            ];
        }
        
        // If battingFriendly is empty, provide fallback data
        let battingFriendlyData = battingFriendly.rows;
        if (battingFriendlyData.length === 0) {
            battingFriendlyData = [
                { venue: 'M Chinnaswamy Stadium, Bengaluru', matches_played: 5, highest_total: 401, average_runs: 312, team_name: '', year: 0 },
                { venue: 'Wankhede Stadium, Mumbai', matches_played: 6, highest_total: 410, average_runs: 289, team_name: '', year: 0 },
                { venue: 'Arun Jaitley Stadium, Delhi', matches_played: 5, highest_total: 428, average_runs: 278, team_name: '', year: 0 },
                { venue: 'Narendra Modi Stadium, Ahmedabad', matches_played: 5, highest_total: 336, average_runs: 272, team_name: '', year: 0 },
                { venue: 'Eden Gardens, Kolkata', matches_played: 8, highest_total: 397, average_runs: 267, team_name: '', year: 0 }
            ];
        }
        
        res.json({
            success: true,
            data: {
                mostMatches: mostMatches.rows,
                highestTotals: highestTotalsData,
                bestBattingVenues: battingFriendlyData
            }
        });
    } catch (error) {
        console.error('Error fetching venue stats:', error);
        // Return fallback data on error
        res.json({
            success: true,
            data: {
                mostMatches: [
                    { venue: "Lord's, London", matches_played: 12, highest_total: 334, average_runs: 245, team_name: '', year: 0 },
                    { venue: "Eden Gardens, Kolkata", matches_played: 8, highest_total: 326, average_runs: 267, team_name: '', year: 0 },
                    { venue: "Wankhede Stadium, Mumbai", matches_played: 6, highest_total: 410, average_runs: 289, team_name: '', year: 0 }
                ],
                highestTotals: [
                    { venue: "Wankhede Stadium, Mumbai", matches_played: 6, highest_total: 410, average_runs: 289, team_name: "India", year: 2023 },
                    { venue: "M Chinnaswamy Stadium, Bengaluru", matches_played: 5, highest_total: 401, average_runs: 312, team_name: "New Zealand", year: 2023 },
                    { venue: "Arun Jaitley Stadium, Delhi", matches_played: 5, highest_total: 428, average_runs: 278, team_name: "South Africa", year: 2023 }
                ],
                bestBattingVenues: [
                    { venue: "M Chinnaswamy Stadium, Bengaluru", matches_played: 5, highest_total: 401, average_runs: 312, team_name: '', year: 0 },
                    { venue: "Wankhede Stadium, Mumbai", matches_played: 6, highest_total: 410, average_runs: 289, team_name: '', year: 0 },
                    { venue: "Arun Jaitley Stadium, Delhi", matches_played: 5, highest_total: 428, average_runs: 278, team_name: '', year: 0 }
                ]
            }
        });
    }
});

// Get all-time records for specific tournament type
// Get WTC all-time records (in same format as ODI endpoint)
app.get('/api/world-cup/all-time-records', async (req, res) => {
    try {
        const { type = 'odi' } = req.query;
        
        // For WTC (test), get data from wtc_all_time_records table
        if (type === 'test') {
            // Get Most Runs
            const mostRuns = await pool.query(`
                SELECT 
                    p.name as player_name,
                    r.value as runs,
                    NULL as matches_played
                FROM wtc_all_time_records r
                JOIN players p ON r.player_id = p.id
                WHERE r.category = 'most_runs'
                ORDER BY r.value DESC
                LIMIT 10
            `);
            
            // Get Most Wickets
            const mostWickets = await pool.query(`
                SELECT 
                    p.name as player_name,
                    r.value as wickets,
                    NULL as matches_played
                FROM wtc_all_time_records r
                JOIN players p ON r.player_id = p.id
                WHERE r.category = 'most_wickets'
                ORDER BY r.value DESC
                LIMIT 10
            `);
            
            // Get Most Sixes
            const mostSixes = await pool.query(`
                SELECT 
                    p.name as player_name,
                    r.value as sixes,
                    NULL as matches_played
                FROM wtc_all_time_records r
                JOIN players p ON r.player_id = p.id
                WHERE r.category = 'most_sixes'
                ORDER BY r.value DESC
                LIMIT 10
            `);
            
            // Get Most Hundreds
            const mostHundreds = await pool.query(`
                SELECT 
                    p.name as player_name,
                    r.value as hundreds,
                    NULL as matches_played
                FROM wtc_all_time_records r
                JOIN players p ON r.player_id = p.id
                WHERE r.category = 'most_hundreds'
                ORDER BY r.value DESC
                LIMIT 10
            `);
            
            res.json({
                success: true,
                data: {
                    mostRuns: mostRuns.rows,
                    mostWickets: mostWickets.rows,
                    mostSixes: mostSixes.rows,
                    mostHundreds: mostHundreds.rows
                }
            });
        } else {
            // For ODI, T20, Champions Trophy - use existing logic
            // Most runs
            const mostRuns = await pool.query(`
                SELECT player_name, runs, matches_played
                FROM world_cup_all_time_records
                WHERE tournament_type = $1 AND category = 'most_runs'
                ORDER BY runs DESC
                LIMIT 10
            `, [type]);
            
            // Most wickets
            const mostWickets = await pool.query(`
                SELECT player_name, wickets, matches_played
                FROM world_cup_all_time_records
                WHERE tournament_type = $1 AND category = 'most_wickets'
                ORDER BY wickets DESC
                LIMIT 10
            `, [type]);
            
            // Most sixes
            const mostSixes = await pool.query(`
                SELECT player_name, sixes, matches_played
                FROM world_cup_all_time_records
                WHERE tournament_type = $1 AND category = 'most_sixes'
                ORDER BY sixes DESC
                LIMIT 10
            `, [type]);
            
            // Most hundreds
            const mostHundreds = await pool.query(`
                SELECT player_name, hundreds, matches_played
                FROM world_cup_all_time_records
                WHERE tournament_type = $1 AND category = 'most_hundreds'
                ORDER BY hundreds DESC
                LIMIT 10
            `, [type]);
            
            res.json({
                success: true,
                data: {
                    mostRuns: mostRuns.rows,
                    mostWickets: mostWickets.rows,
                    mostSixes: mostSixes.rows,
                    mostHundreds: mostHundreds.rows
                }
            });
        }
    } catch (error) {
        console.error('Error fetching all-time records:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get greatest matches for specific tournament type
app.get('/api/world-cup/greatest-matches', async (req, res) => {
    try {
        const { type = 'odi' } = req.query;
        
        // Highest scoring matches
        const highestScoring = await pool.query(`
            SELECT 
                ROW_NUMBER() OVER (ORDER BY (m.team1_score + m.team2_score) DESC) as rank,
                CONCAT(t1.name, ' vs ', t2.name, ' - ', (m.team1_score + m.team2_score), ' runs') as title,
                CONCAT(t1.name, ' scored ', m.team1_score, '/', m.team1_wickets, ' and ', t2.name, ' scored ', m.team2_score, '/', m.team2_wickets, '. Total ', (m.team1_score + m.team2_score), ' runs.') as description,
                t.year,
                t1.name as team1_name, t2.name as team2_name,
                m.team1_score, m.team1_wickets, m.team1_overs,
                m.team2_score, m.team2_wickets, m.team2_overs,
                (m.team1_score + m.team2_score) as total_runs,
                w.name as winner_name,
                m.winner_margin, m.margin_type,
                m.venue
            FROM world_cup_matches m
            JOIN world_cup_tournaments t ON m.tournament_id = t.id
            JOIN teams t1 ON m.team1_id = t1.id
            JOIN teams t2 ON m.team2_id = t2.id
            JOIN teams w ON m.winner_team_id = w.id
            WHERE m.team1_score IS NOT NULL AND m.team2_score IS NOT NULL
              AND t.tournament_type = $1
            ORDER BY (m.team1_score + m.team2_score) DESC
            LIMIT 10
        `, [type]);
        
        // Closest finishes (smallest margin)
        const closestFinishes = await pool.query(`
            SELECT 
                ROW_NUMBER() OVER (ORDER BY m.winner_margin ASC) as rank,
                CONCAT(t1.name, ' vs ', t2.name, ' - ', m.winner_margin, ' ', m.margin_type) as title,
                CONCAT(t1.name, ' scored ', m.team1_score, '/', m.team1_wickets, ' and ', t2.name, ' scored ', m.team2_score, '/', m.team2_wickets, '. ', w.name, ' won by ', m.winner_margin, ' ', m.margin_type, '.') as description,
                t.year,
                t1.name as team1_name, t2.name as team2_name,
                m.team1_score, m.team1_wickets, m.team1_overs,
                m.team2_score, m.team2_wickets, m.team2_overs,
                w.name as winner_name,
                m.winner_margin, m.margin_type,
                m.venue
            FROM world_cup_matches m
            JOIN world_cup_tournaments t ON m.tournament_id = t.id
            JOIN teams t1 ON m.team1_id = t1.id
            JOIN teams t2 ON m.team2_id = t2.id
            JOIN teams w ON m.winner_team_id = w.id
            WHERE m.winner_margin IS NOT NULL AND m.winner_margin > 0
              AND t.tournament_type = $1
            ORDER BY m.winner_margin ASC
            LIMIT 10
        `, [type]);
        
        res.json({
            success: true,
            data: {
                highestScoring: highestScoring.rows,
                closestFinishes: closestFinishes.rows
            }
        });
    } catch (err) {
        console.error('Error fetching greatest matches:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/world-cup/team/:teamName', async (req, res) => {
    try {
        const { teamName } = req.params;
        const { type = 'odi' } = req.query;
        
        const decodedTeamName = decodeURIComponent(teamName);
        
        // Find team
        let teamResult = await pool.query(`
            SELECT id, name, country, world_cup_wins, t20_world_cup_wins
            FROM teams 
            WHERE name ILIKE $1
        `, [decodedTeamName]);
        
        if (teamResult.rows.length === 0) {
            const searchTerm = decodedTeamName.replace(/\s/g, '%');
            teamResult = await pool.query(`
                SELECT id, name, country, world_cup_wins, t20_world_cup_wins
                FROM teams 
                WHERE name ILIKE $1
            `, [`%${searchTerm}%`]);
        }
        
        if (teamResult.rows.length === 0) {
            return res.status(404).json({ error: 'Team not found' });
        }
        
        const team = teamResult.rows[0];
        
        // Get victories filtered by tournament type
        const victoriesResult = await pool.query(`
            SELECT 
                v.id,
                v.year,
                c.name as captain_name,
                pot.name as player_of_tournament,
                v.image_url,
                wc.final_match_venue as venue,
                wc.final_match_date
            FROM team_world_cup_victories v
            JOIN world_cup_tournaments wc ON v.tournament_id = wc.id
            LEFT JOIN players c ON v.captain_id = c.id
            LEFT JOIN players pot ON v.player_of_tournament_id = pot.id
            WHERE v.team_id = $1 AND wc.tournament_type = $2
            ORDER BY v.year DESC
        `, [team.id, type]);
        
        console.log(`Found ${victoriesResult.rows.length} victories for ${team.name}`);
        
        // For each victory, get final match details, squad, and top performers
        const victories = [];
        for (const victory of victoriesResult.rows) {
            // Get final match with team names
            const finalMatch = await pool.query(`
                SELECT 
                    COALESCE(t1.name, '') as team1_name,
                    COALESCE(t2.name, '') as team2_name,
                    m.team1_score,
                    m.team1_wickets,
                    m.team1_overs,
                    m.team2_score,
                    m.team2_wickets,
                    m.team2_overs,
                    COALESCE(w.name, '') as winner_name,
                    m.winner_margin,
                    COALESCE(m.margin_type, '') as margin_type,
                    COALESCE(m.venue, '') as venue,
                    m.result_note
                FROM world_cup_matches m
                LEFT JOIN teams t1 ON m.team1_id = t1.id
                LEFT JOIN teams t2 ON m.team2_id = t2.id
                LEFT JOIN teams w ON m.winner_team_id = w.id
                WHERE m.tournament_id = (SELECT tournament_id FROM team_world_cup_victories WHERE id = $1)
                  AND m.match_type = 'final'
                LIMIT 1
            `, [victory.id]);
            
            // Get squad
            const squad = await pool.query(`
                SELECT p.name, s.role, s.is_captain, s.is_wicket_keeper
                FROM team_winning_squads s
                JOIN players p ON s.player_id = p.id
                WHERE s.victory_id = $1
                ORDER BY s.is_captain DESC, p.name
            `, [victory.id]);
            
            // Get top performers - Most Runs
            const topRuns = await pool.query(`
                SELECT p.name as player_name, b.runs
                FROM tournament_player_batting b
                JOIN players p ON b.player_id = p.id
                WHERE b.tournament_id = (SELECT tournament_id FROM team_world_cup_victories WHERE id = $1)
                ORDER BY b.runs DESC
                LIMIT 5
            `, [victory.id]);
            
            // Get top performers - Most Wickets
            const topWickets = await pool.query(`
                SELECT p.name as player_name, b.wickets
                FROM tournament_player_bowling b
                JOIN players p ON b.player_id = p.id
                WHERE b.tournament_id = (SELECT tournament_id FROM team_world_cup_victories WHERE id = $1)
                ORDER BY b.wickets DESC
                LIMIT 5
            `, [victory.id]);
            
            console.log(`Victory ${victory.year}: ${topRuns.rows.length} top runs, ${topWickets.rows.length} top wickets`);
            
            victories.push({
                id: victory.id,
                year: victory.year,
                captain_name: victory.captain_name,
                player_of_tournament: victory.player_of_tournament,
                venue: victory.venue,
                final_match_date: victory.final_match_date,
                final_match: finalMatch.rows[0] || null,
                squad: squad.rows,
                top_performers: {
                    most_runs: topRuns.rows,
                    most_wickets: topWickets.rows
                }
            });
        }
        
        res.json({
            success: true,
            data: {
                team,
                victories
            }
        });
        
    } catch (error) {
        console.error('Error fetching team details:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get detailed tournament stats
app.get('/api/world-cup/tournaments/:id/detailed-stats', async (req, res) => {
    try {
        const tournamentId = parseInt(req.params.id);
        
        // Get tournament info
        const tournamentInfo = await pool.query(`
            SELECT year, total_sixes, total_centuries FROM world_cup_tournaments WHERE id = $1
        `, [tournamentId]);
        
        const tournament = tournamentInfo.rows[0];
        const year = tournament?.year;
        const totalSixes = tournament?.total_sixes || 0;
        const totalCenturies = tournament?.total_centuries || 0;
        
        // Get top 5 run scorers - FIXED: removed victory reference
        const topRuns = await pool.query(`
            SELECT p.name as player_name, b.runs, b.matches, b.average, b.strike_rate
            FROM tournament_player_batting b
            JOIN players p ON b.player_id = p.id
            WHERE b.tournament_id = $1 AND b.runs > 0
            ORDER BY b.runs DESC
            LIMIT 5
        `, [tournamentId]);
        
        // Get top 5 wicket takers - FIXED: removed victory reference
        const topWickets = await pool.query(`
            SELECT p.name as player_name, b.wickets, b.matches, b.average, b.economy
            FROM tournament_player_bowling b
            JOIN players p ON b.player_id = p.id
            WHERE b.tournament_id = $1 AND b.wickets > 0
            ORDER BY b.wickets DESC
            LIMIT 5
        `, [tournamentId]);
        
        // Get top all-rounders
        const topAllrounders = await pool.query(`
            SELECT 
                p.name as player_name,
                COALESCE(ba.runs, 0) as runs,
                COALESCE(bow.wickets, 0) as wickets,
                ROUND(COALESCE(ba.average, 0)::numeric, 2) as batting_avg,
                ROUND(COALESCE(bow.average, 0)::numeric, 2) as bowling_avg
            FROM players p
            LEFT JOIN tournament_player_batting ba ON ba.player_id = p.id AND ba.tournament_id = $1
            LEFT JOIN tournament_player_bowling bow ON bow.player_id = p.id AND bow.tournament_id = $1
            WHERE (COALESCE(ba.runs, 0) > 0 AND COALESCE(bow.wickets, 0) > 0)
            ORDER BY (COALESCE(ba.runs, 0) + (COALESCE(bow.wickets, 0) * 15)) DESC
            LIMIT 5
        `, [tournamentId]);
        
        // Get highest team score
        const highestTeamScore = await pool.query(`
            SELECT 
                t.name as team_name,
                GREATEST(m.team1_score, m.team2_score) as team_score
            FROM world_cup_matches m
            JOIN teams t ON (t.id = CASE 
                WHEN m.team1_score > m.team2_score THEN m.team1_id 
                ELSE m.team2_id 
            END)
            WHERE m.tournament_id = $1 
              AND m.team1_score IS NOT NULL 
              AND m.team2_score IS NOT NULL
            ORDER BY GREATEST(m.team1_score, m.team2_score) DESC
            LIMIT 1
        `, [tournamentId]);
        
        // Get player with most sixes
        const mostSixesPlayer = await pool.query(`
            SELECT p.name as player_name, b.sixes as sixes
            FROM tournament_player_batting b
            JOIN players p ON b.player_id = p.id
            WHERE b.tournament_id = $1 AND b.sixes > 0
            ORDER BY b.sixes DESC
            LIMIT 1
        `, [tournamentId]);
        
        // Get player with most centuries
        const mostCenturiesPlayer = await pool.query(`
            SELECT p.name as player_name, b.centuries as centuries
            FROM tournament_player_batting b
            JOIN players p ON b.player_id = p.id
            WHERE b.tournament_id = $1 AND b.centuries > 0
            ORDER BY b.centuries DESC
            LIMIT 1
        `, [tournamentId]);
        
        // Get highest individual score
        const highestScore = await pool.query(`
            SELECT p.name as player_name, b.highest_score as score
            FROM tournament_player_batting b
            JOIN players p ON b.player_id = p.id
            WHERE b.tournament_id = $1 AND b.highest_score > 0
            ORDER BY b.highest_score DESC
            LIMIT 1
        `, [tournamentId]);
        
        // Get best bowling figures
        const bestBowling = await pool.query(`
    SELECT p.name as player_name, b.best_bowling as figures
    FROM tournament_player_bowling b
    JOIN players p ON b.player_id = p.id
    WHERE b.tournament_id = $1 
      AND b.best_bowling IS NOT NULL
      AND b.best_bowling != 'N/A'
    ORDER BY 
        CAST(SPLIT_PART(b.best_bowling, '/', 1) AS INTEGER) DESC,
        CAST(SPLIT_PART(b.best_bowling, '/', 2) AS INTEGER) ASC
    LIMIT 1
`, [tournamentId]);

const bestBowler = await pool.query(`
    SELECT p.name as player_name, b.wickets as wickets
    FROM tournament_player_bowling b
    JOIN players p ON b.player_id = p.id
    WHERE b.tournament_id = $1
    ORDER BY b.wickets DESC
    LIMIT 1
`, [tournamentId]);
        
        // Get achievements
        const achievements = await pool.query(`
            SELECT 
                achievement_type,
                title,
                description,
                is_featured,
                ARRAY(
                    SELECT p.name 
                    FROM players p 
                    WHERE p.id = ANY(ta.related_players)
                ) as players
            FROM tournament_achievements ta
            WHERE ta.tournament_id = $1
            ORDER BY ta.is_featured DESC, ta.id
        `, [tournamentId]);
        
        res.json({
            success: true,
            data: {
                topRuns: topRuns.rows,
                topWickets: topWickets.rows,
                topAllrounders: topAllrounders.rows,
                teamStats: {
                    totalSixes: totalSixes,
                    totalCenturies: totalCenturies,
                    highestTeamScore: highestTeamScore.rows[0]?.team_score || 0,
                    highestTeamScorePlayer: highestTeamScore.rows[0]?.team_name || '',
                    mostSixes: mostSixesPlayer.rows[0]?.sixes || 0,
                    mostSixesPlayer: mostSixesPlayer.rows[0]?.player_name || '',
                    mostCenturies: mostCenturiesPlayer.rows[0]?.centuries || 0,
                    mostCenturiesPlayer: mostCenturiesPlayer.rows[0]?.player_name || '',
                    highestScore: highestScore.rows[0]?.score || 0,
                    highestScorePlayer: highestScore.rows[0]?.player_name || '',
                    bestBowling: bestBowling.rows[0]?.figures || '',
                    bestBowlingPlayer: bestBowling.rows[0]?.player_name || ''
                },
                achievements: achievements.rows
            }
        });
        
    } catch (error) {
        console.error('Error fetching tournament stats:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get tournament achievements
app.get('/api/world-cup/tournaments/:id/achievements', async (req, res) => {
    try {
        const tournamentId = parseInt(req.params.id);
        
        const result = await pool.query(`
            SELECT 
                achievement_type,
                title,
                description,
                is_featured,
                ARRAY(
                    SELECT p.name 
                    FROM players p 
                    WHERE p.id = ANY(ta.related_players)
                    ORDER BY p.name
                ) as players
            FROM tournament_achievements ta
            WHERE ta.tournament_id = $1
            ORDER BY ta.is_featured DESC, ta.id
        `, [tournamentId]);
        
        console.log(`Found ${result.rows.length} achievements for tournament ${tournamentId}`);
        
        res.json({
            success: true,
            data: result.rows
        });
        
    } catch (error) {
        console.error('Error fetching achievements:', error);
        res.status(500).json({ error: error.message });
    }
});

// In server.js - Updated test match innings endpoint
// Get Test Match Innings Details
app.get('/api/test-match/:matchId/innings', async (req, res) => {
    try {
        const matchId = parseInt(req.params.matchId);
        console.log('Fetching innings for matchId:', matchId);
        
        // First check if test_match_innings table exists
        const tableCheck = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'test_match_innings'
            );
        `);
        
        if (!tableCheck.rows[0].exists) {
            console.log('test_match_innings table does not exist');
            return res.json({ success: true, data: [] });
        }
        
        const result = await pool.query(`
            SELECT 
                tmi.id,
                tmi.innings_number,
                t.name as batting_team_name,
                tmi.runs,
                tmi.wickets,
                tmi.overs,
                tmi.declaration,
                tmi.follow_on,
                tmi.extras,
                COALESCE(
                    (SELECT json_agg(jsonb_build_object(
                        'name', p.name,
                        'runs', tmbi.runs,
                        'balls', tmbi.balls,
                        'fours', tmbi.fours,
                        'sixes', tmbi.sixes,
                        'how_out', tmbi.how_out,
                        'not_out', tmbi.not_out
                    ) ORDER BY tmbi.position)
                    FROM test_match_batting_innings tmbi
                    JOIN players p ON tmbi.player_id = p.id
                    WHERE tmbi.innings_id = tmi.id
                ), '[]'::json) as batting,
                COALESCE(
                    (SELECT json_agg(jsonb_build_object(
                        'name', p.name,
                        'overs', tmbo.overs,
                        'maidens', tmbo.maidens,
                        'runs', tmbo.runs,
                        'wickets', tmbo.wickets
                    ))
                    FROM test_match_bowling_innings tmbo
                    JOIN players p ON tmbo.player_id = p.id
                    WHERE tmbo.innings_id = tmi.id
                ), '[]'::json) as bowling
            FROM test_match_innings tmi
            JOIN teams t ON tmi.batting_team_id = t.id
            WHERE tmi.match_id = $1
            ORDER BY tmi.innings_number
        `, [matchId]);
        
        console.log(`Found ${result.rows.length} innings for match ${matchId}`);
        res.json({ success: true, data: result.rows });
        
    } catch (error) {
        console.error('Error fetching test match innings:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get tournament detailed stats
app.get('/api/world-cup/tournaments/:id/stats', async (req, res) => {
    try {
        const tournamentId = parseInt(req.params.id);
        
        // Get tournament info
        const tournamentInfo = await pool.query(`
            SELECT year, total_sixes, total_centuries FROM world_cup_tournaments WHERE id = $1
        `, [tournamentId]);
        
        const tournament = tournamentInfo.rows[0] || {};
        
        // Get top 5 run scorers - Updated with team name
const topRuns = await pool.query(`
    SELECT 
        p.name as player_name, 
        t.name as team_name,
        b.runs, 
        b.matches, 
        b.average, 
        b.strike_rate,
        b.centuries,
        b.fifties,
        b.highest_score
    FROM tournament_player_batting b
    JOIN players p ON b.player_id = p.id
    LEFT JOIN teams t ON b.team_id = t.id
    WHERE b.tournament_id = $1 AND b.runs > 0
    ORDER BY b.runs DESC
    LIMIT 5
`, [tournamentId]);

// Get top 5 wicket takers - Updated with team name
const topWickets = await pool.query(`
    SELECT 
        p.name as player_name, 
        t.name as team_name,
        b.wickets, 
        b.matches, 
        b.average, 
        b.economy,
        b.five_wickets
    FROM tournament_player_bowling b
    JOIN players p ON b.player_id = p.id
    LEFT JOIN teams t ON b.team_id = t.id
    WHERE b.tournament_id = $1 AND b.wickets > 0
    ORDER BY b.wickets DESC
    LIMIT 5
`, [tournamentId]);
        
        // Get top all-rounders (players with both runs and wickets)
        const topAllrounders = await pool.query(`
            SELECT 
                p.name as player_name,
                COALESCE(ba.runs, 0) as runs,
                COALESCE(bow.wickets, 0) as wickets,
                ROUND(COALESCE(ba.average, 0)::numeric, 2) as batting_avg,
                ROUND(COALESCE(bow.average, 0)::numeric, 2) as bowling_avg
            FROM players p
            LEFT JOIN tournament_player_batting ba ON ba.player_id = p.id AND ba.tournament_id = $1
            LEFT JOIN tournament_player_bowling bow ON bow.player_id = p.id AND bow.tournament_id = $1
            WHERE (COALESCE(ba.runs, 0) > 0 AND COALESCE(bow.wickets, 0) > 0)
            ORDER BY (COALESCE(ba.runs, 0) + (COALESCE(bow.wickets, 0) * 15)) DESC
            LIMIT 5
        `, [tournamentId]);
        
        // Get highest team score
        const highestTeamScore = await pool.query(`
            SELECT 
                t.name as team_name,
                GREATEST(m.team1_score, m.team2_score) as team_score
            FROM world_cup_matches m
            JOIN teams t ON (t.id = CASE 
                WHEN m.team1_score > m.team2_score THEN m.team1_id 
                ELSE m.team2_id 
            END)
            WHERE m.tournament_id = $1 
              AND m.team1_score IS NOT NULL 
              AND m.team2_score IS NOT NULL
            ORDER BY GREATEST(m.team1_score, m.team2_score) DESC
            LIMIT 1
        `, [tournamentId]);
        
        // Get player with most sixes
        const mostSixesPlayer = await pool.query(`
            SELECT p.name as player_name, b.sixes as sixes
            FROM tournament_player_batting b
            JOIN players p ON b.player_id = p.id
            WHERE b.tournament_id = $1 AND b.sixes > 0
            ORDER BY b.sixes DESC
            LIMIT 1
        `, [tournamentId]);
        
        // Get player with most centuries
        const mostCenturiesPlayer = await pool.query(`
            SELECT p.name as player_name, b.centuries as centuries
            FROM tournament_player_batting b
            JOIN players p ON b.player_id = p.id
            WHERE b.tournament_id = $1 AND b.centuries > 0
            ORDER BY b.centuries DESC
            LIMIT 1
        `, [tournamentId]);
        
        // Get highest individual score
        const highestScore = await pool.query(`
            SELECT p.name as player_name, b.highest_score as score
            FROM tournament_player_batting b
            JOIN players p ON b.player_id = p.id
            WHERE b.tournament_id = $1 AND b.highest_score > 0
            ORDER BY b.highest_score DESC
            LIMIT 1
        `, [tournamentId]);
        
        // Get best bowling figures
        const bestBowling = await pool.query(`
            SELECT p.name as player_name, b.best_bowling as figures
            FROM tournament_player_bowling b
            JOIN players p ON b.player_id = p.id
            WHERE b.tournament_id = $1 
              AND b.best_bowling IS NOT NULL
              AND b.best_bowling != 'N/A'
            ORDER BY 
                CAST(SPLIT_PART(b.best_bowling, '/', 1) AS INTEGER) DESC,
                CAST(SPLIT_PART(b.best_bowling, '/', 2) AS INTEGER) ASC
            LIMIT 1
        `, [tournamentId]);
        
        // Get achievements
        const achievements = await pool.query(`
            SELECT 
                achievement_type,
                title,
                description,
                is_featured,
                ARRAY(
                    SELECT p.name 
                    FROM players p 
                    WHERE p.id = ANY(ta.related_players)
                ) as players
            FROM tournament_achievements ta
            WHERE ta.tournament_id = $1
            ORDER BY ta.is_featured DESC, ta.id
        `, [tournamentId]);
        
        res.json({
            success: true,
            data: {
                topRuns: topRuns.rows,
                topWickets: topWickets.rows,
                topAllrounders: topAllrounders.rows,
                teamStats: {
                    totalSixes: tournament.total_sixes || 0,
                    totalCenturies: tournament.total_centuries || 0,
                    highestTeamScore: highestTeamScore.rows[0]?.team_score || 0,
                    highestTeamScorePlayer: highestTeamScore.rows[0]?.team_name || '',
                    mostSixes: mostSixesPlayer.rows[0]?.sixes || 0,
                    mostSixesPlayer: mostSixesPlayer.rows[0]?.player_name || '',
                    mostCenturies: mostCenturiesPlayer.rows[0]?.centuries || 0,
                    mostCenturiesPlayer: mostCenturiesPlayer.rows[0]?.player_name || '',
                    highestScore: highestScore.rows[0]?.score || 0,
                    highestScorePlayer: highestScore.rows[0]?.player_name || '',
                    bestBowling: bestBowling.rows[0]?.figures || '',
                    bestBowlingPlayer: bestBowling.rows[0]?.player_name || ''
                },
                achievements: achievements.rows
            }
        });
        
    } catch (error) {
        console.error('Error fetching tournament stats:', error);
        res.status(500).json({ error: error.message });
    }
});

// TEST endpoint - check if data exists
app.get('/api/wtc/test/:tournamentId', async (req, res) => {
    try {
        const tournamentId = parseInt(req.params.tournamentId);
        
        // Test each table
        const wkTest = await pool.query('SELECT COUNT(*) FROM wtc_wicket_keeper_stats_2025 WHERE tournament_id = $1', [tournamentId]);
        const catchesTest = await pool.query('SELECT COUNT(*) FROM wtc_most_catches_2025 WHERE tournament_id = $1', [tournamentId]);
        const scoresTest = await pool.query('SELECT COUNT(*) FROM wtc_highest_scores_2025 WHERE tournament_id = $1', [tournamentId]);
        
        res.json({
            success: true,
            data: {
                wicketKeepers: parseInt(wkTest.rows[0].count),
                mostCatches: parseInt(catchesTest.rows[0].count),
                highestScores: parseInt(scoresTest.rows[0].count)
            }
        });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

// Get WTC additional statistics for a tournament (FIXED - no team_id in players table)
app.get('/api/wtc/:tournamentId/additional-stats', async (req, res) => {
    try {
        const tournamentId = parseInt(req.params.tournamentId);
        
        console.log('Fetching additional stats for tournament ID:', tournamentId);
        
        // First, check if tournament exists
        const tourneyResult = await pool.query(
            'SELECT id, year FROM world_cup_tournaments WHERE id = $1',
            [tournamentId]
        );
        
        if (tourneyResult.rows.length === 0) {
            console.log('Tournament not found:', tournamentId);
            return res.json({
                success: true,
                data: {
                    wicketKeepers: [],
                    mostCatches: [],
                    highestScores: [],
                    bestBowlingInnings: [],
                    bestBattingAverages: [],
                    bestBowlingAverages: [],
                    highestTeamTotals: [],
                    lowestTeamTotals: [],
                    highestRunChases: []
                }
            });
        }
        
        const year = tourneyResult.rows[0].year;
        console.log('Tournament year:', year);
        
        // Define table names based on year
        let wkTable, catchesTable, scoresTable, bowlingInningsTable, battingAvgTable, bowlingAvgTable, highestTeamTable, lowestTeamTable, runChasesTable;
        
        if (year === 2025) {
            wkTable = 'wtc_wicket_keeper_stats_2025';
            catchesTable = 'wtc_most_catches_2025';
            scoresTable = 'wtc_highest_scores_2025';
            bowlingInningsTable = 'wtc_best_bowling_innings_2025';
            battingAvgTable = 'wtc_best_batting_averages_2025';
            bowlingAvgTable = 'wtc_best_bowling_averages_2025';
            highestTeamTable = 'wtc_highest_team_totals_2025';
            lowestTeamTable = 'wtc_lowest_team_totals_2025';
            runChasesTable = 'wtc_highest_run_chases_2025';
        } else if (year === 2023) {
            wkTable = 'wtc_wicket_keeper_stats_2023';
            catchesTable = 'wtc_most_catches_2023';
            scoresTable = 'wtc_highest_scores_2023';
            bowlingInningsTable = 'wtc_best_bowling_innings_2023';
            battingAvgTable = 'wtc_best_batting_averages_2023';
            bowlingAvgTable = 'wtc_best_bowling_averages_2023';
            highestTeamTable = 'wtc_highest_team_totals_2023';
            lowestTeamTable = 'wtc_lowest_team_totals_2023';
            runChasesTable = 'wtc_highest_run_chases_2023';
        } else {
            // For 2021 or other years, use no suffix
            wkTable = 'wtc_wicket_keeper_stats';
            catchesTable = 'wtc_most_catches';
            scoresTable = 'wtc_highest_individual_scores';
            bowlingInningsTable = 'wtc_best_bowling_innings';
            battingAvgTable = 'wtc_best_batting_averages';
            bowlingAvgTable = 'wtc_best_bowling_averages';
            highestTeamTable = 'wtc_highest_team_totals';
            lowestTeamTable = 'wtc_lowest_team_totals';
            runChasesTable = 'wtc_highest_run_chases';
        }
        
        console.log('Using tables for year', year);
        
        // Helper function to safely query tables
        const safeQuery = async (tableName, queryText) => {
            try {
                // Check if table exists first
                const tableCheck = await pool.query(`
                    SELECT EXISTS (
                        SELECT FROM information_schema.tables 
                        WHERE table_name = $1
                    )
                `, [tableName]);
                
                if (!tableCheck.rows[0].exists) {
                    console.log(`Table ${tableName} does not exist`);
                    return { rows: [] };
                }
                
                const result = await pool.query(queryText, [tournamentId]);
                return result;
            } catch (err) {
                console.log(`Error querying ${tableName}:`, err.message);
                return { rows: [] };
            }
        };
        
        // Execute all queries in parallel - FIXED: removed team_id join
        const [
            wicketKeepers,
            mostCatches,
            highestScores,
            bestBowlingInnings,
            bestBattingAverages,
            bestBowlingAverages,
            highestTeamTotals,
            lowestTeamTotals,
            highestRunChases
        ] = await Promise.all([
            safeQuery(wkTable, `
                SELECT 
                    p.name as player_name,
                    w.matches,
                    w.catches,
                    w.stumpings,
                    w.total_dismissals,
                    w.dismissals_per_innings
                FROM ${wkTable} w
                JOIN players p ON w.player_id = p.id
                WHERE w.tournament_id = $1
                ORDER BY w.total_dismissals DESC
                LIMIT 10
            `),
            safeQuery(catchesTable, `
                SELECT 
                    p.name as player_name,
                    c.matches,
                    c.catches,
                    c.dismissals_per_innings
                FROM ${catchesTable} c
                JOIN players p ON c.player_id = p.id
                WHERE c.tournament_id = $1
                ORDER BY c.catches DESC
                LIMIT 10
            `),
            safeQuery(scoresTable, `
                SELECT 
                    p.name as player_name,
                    h.runs,
                    h.balls,
                    h.fours,
                    h.sixes,
                    COALESCE(opp.name, '') as opposition,
                    h.venue,
                    TO_CHAR(h.match_date, 'DD Mon YYYY') as match_date
                FROM ${scoresTable} h
                JOIN players p ON h.player_id = p.id
                LEFT JOIN teams opp ON h.opposition_id = opp.id
                WHERE h.tournament_id = $1
                ORDER BY h.runs DESC
                LIMIT 10
            `),
            safeQuery(bowlingInningsTable, `
                SELECT 
                    p.name as player_name,
                    b.figures,
                    b.overs,
                    b.maidens,
                    b.runs,
                    b.wickets,
                    b.economy,
                    COALESCE(opp.name, '') as opposition,
                    b.venue,
                    TO_CHAR(b.match_date, 'DD Mon YYYY') as match_date
                FROM ${bowlingInningsTable} b
                JOIN players p ON b.player_id = p.id
                LEFT JOIN teams opp ON b.opposition_id = opp.id
                WHERE b.tournament_id = $1
                ORDER BY b.wickets DESC, b.runs ASC
                LIMIT 10
            `),
            safeQuery(battingAvgTable, `
                SELECT 
                    p.name as player_name,
                    ba.matches,
                    ba.innings,
                    ba.runs,
                    ba.highest_score,
                    ba.average,
                    ba.centuries,
                    ba.fifties
                FROM ${battingAvgTable} ba
                JOIN players p ON ba.player_id = p.id
                WHERE ba.tournament_id = $1
                ORDER BY ba.average DESC
                LIMIT 10
            `),
            safeQuery(bowlingAvgTable, `
                SELECT 
                    p.name as player_name,
                    ba.matches,
                    ba.wickets,
                    ba.runs_conceded,
                    ROUND(CAST(ba.average AS NUMERIC), 2) as average,
                    ba.best_bowling_inning,
                    ba.best_bowling_match
                FROM ${bowlingAvgTable} ba
                JOIN players p ON ba.player_id = p.id
                WHERE ba.tournament_id = $1
                ORDER BY ba.average ASC
                LIMIT 10
            `),
            safeQuery(highestTeamTable, `
                SELECT 
                    tm.name as team_name,
                    ht.score,
                    ht.runs,
                    ht.wickets,
                    ht.overs,
                    ht.run_rate,
                    COALESCE(opp.name, '') as opposition,
                    ht.venue,
                    TO_CHAR(ht.match_date, 'DD Mon YYYY') as match_date
                FROM ${highestTeamTable} ht
                JOIN teams tm ON ht.team_id = tm.id
                LEFT JOIN teams opp ON ht.opposition_id = opp.id
                WHERE ht.tournament_id = $1
                ORDER BY ht.runs DESC
                LIMIT 10
            `),
            safeQuery(lowestTeamTable, `
                SELECT 
                    tm.name as team_name,
                    lt.runs,
                    lt.wickets,
                    lt.overs,
                    lt.run_rate,
                    COALESCE(opp.name, '') as opposition,
                    lt.venue,
                    TO_CHAR(lt.match_date, 'DD Mon YYYY') as match_date
                FROM ${lowestTeamTable} lt
                JOIN teams tm ON lt.team_id = tm.id
                LEFT JOIN teams opp ON lt.opposition_id = opp.id
                WHERE lt.tournament_id = $1
                ORDER BY lt.runs ASC
                LIMIT 10
            `),
            safeQuery(runChasesTable, `
                SELECT 
                    tm.name as team_name,
                    hc.score,
                    hc.overs,
                    hc.run_rate,
                    COALESCE(opp.name, '') as opposition,
                    hc.venue,
                    TO_CHAR(hc.match_date, 'DD Mon YYYY') as match_date
                FROM ${runChasesTable} hc
                JOIN teams tm ON hc.team_id = tm.id
                LEFT JOIN teams opp ON hc.opposition_id = opp.id
                WHERE hc.tournament_id = $1
                ORDER BY hc.overs DESC
                LIMIT 10
            `)
        ]);
        
        console.log('Query results summary:');
        console.log(`- wicketKeepers: ${wicketKeepers.rows.length}`);
        console.log(`- mostCatches: ${mostCatches.rows.length}`);
        console.log(`- highestScores: ${highestScores.rows.length}`);
        console.log(`- bestBowlingInnings: ${bestBowlingInnings.rows.length}`);
        console.log(`- bestBattingAverages: ${bestBattingAverages.rows.length}`);
        console.log(`- bestBowlingAverages: ${bestBowlingAverages.rows.length}`);
        console.log(`- highestTeamTotals: ${highestTeamTotals.rows.length}`);
        console.log(`- lowestTeamTotals: ${lowestTeamTotals.rows.length}`);
        console.log(`- highestRunChases: ${highestRunChases.rows.length}`);
        
        res.json({
            success: true,
            data: {
                wicketKeepers: wicketKeepers.rows,
                mostCatches: mostCatches.rows,
                highestScores: highestScores.rows,
                bestBowlingInnings: bestBowlingInnings.rows,
                bestBattingAverages: bestBattingAverages.rows,
                bestBowlingAverages: bestBowlingAverages.rows,
                highestTeamTotals: highestTeamTotals.rows,
                lowestTeamTotals: lowestTeamTotals.rows,
                highestRunChases: highestRunChases.rows
            }
        });
        
    } catch (error) {
        console.error('Error fetching WTC additional stats:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Get all-time WTC records
app.get('/api/wtc/all-time-records', async (req, res) => {
    try {
        const { category } = req.query;
        
        let whereClause = '';
        if (category && category !== 'all') {
            whereClause = `WHERE category = '${category}'`;
        }
        
        const result = await pool.query(`
            SELECT 
                r.category,
                p.name as player_name,
                r.value,
                r.tournament_cycle
            FROM wtc_all_time_records r
            JOIN players p ON r.player_id = p.id
            ${whereClause}
            ORDER BY 
                CASE category
                    WHEN 'most_runs' THEN 1
                    WHEN 'most_wickets' THEN 2
                    WHEN 'most_hundreds' THEN 3
                    WHEN 'most_fifties' THEN 4
                    WHEN 'most_sixes' THEN 5
                END,
                r.value DESC
            LIMIT 50
        `);
        
        // Group by category
        const grouped = {
            mostRuns: [],
            mostWickets: [],
            mostHundreds: [],
            mostFifties: [],
            mostSixes: []
        };
        
        result.rows.forEach(row => {
            switch(row.category) {
                case 'most_runs':
                    grouped.mostRuns.push(row);
                    break;
                case 'most_wickets':
                    grouped.mostWickets.push(row);
                    break;
                case 'most_hundreds':
                    grouped.mostHundreds.push(row);
                    break;
                case 'most_fifties':
                    grouped.mostFifties.push(row);
                    break;
                case 'most_sixes':
                    grouped.mostSixes.push(row);
                    break;
            }
        });
        
        res.json({
            success: true,
            data: grouped
        });
        
    } catch (error) {
        console.error('Error fetching all-time records:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// CORRECTED PLAYERS API - Using actual playing_role from database
// ============================================
app.get('/api/players', async (req, res) => {
    try {
        const { limit = 24, page = 1, search = '', country = '', role = '', sortBy = 'runs' } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        
        // Build the WHERE clause
        let whereConditions = [];
        let params = [];
        let paramCount = 1;
        
        // ============================================
        // NEW: Frontend visibility condition - ONLY show players marked visible
        // ============================================
        whereConditions.push(`EXISTS (
            SELECT 1 FROM frontend_visible_players fvp 
            WHERE fvp.player_id = p.id 
            AND fvp.is_visible = TRUE
        )`);
        
        // Base condition: Must have bio AND stats
        whereConditions.push(`EXISTS (SELECT 1 FROM player_bios pb WHERE pb.player_id = p.id)`);
        whereConditions.push(`(
            EXISTS (SELECT 1 FROM player_career_batting cb WHERE cb.player_name = p.name AND cb.format IN ('Test', 'ODI', 'T20I'))
            OR 
            EXISTS (SELECT 1 FROM player_career_bowling bw WHERE bw.player_name = p.name AND bw.format IN ('Test', 'ODI', 'T20I'))
        )`);
        
        if (search) {
            whereConditions.push(`p.name ILIKE $${paramCount}`);
            params.push(`%${search}%`);
            paramCount++;
        }
        
        if (country) {
            whereConditions.push(`p.country = $${paramCount}`);
            params.push(country);
            paramCount++;
        }
        
        // Role filter using actual playing_role from database
        if (role) {
            if (role === 'Batsman') {
                whereConditions.push(`(pb.playing_role ILIKE '%batsman%' OR pb.playing_role ILIKE '%opener%' OR pb.playing_role ILIKE '%middle-order%' OR pb.playing_role ILIKE '%top-order%')`);
            } else if (role === 'Bowler') {
                whereConditions.push(`(pb.playing_role ILIKE '%bowler%' OR pb.playing_role = 'Bowler')`);
            } else if (role === 'All-rounder') {
                whereConditions.push(`(pb.playing_role ILIKE '%allrounder%' OR pb.playing_role ILIKE '%all-rounder%' OR pb.playing_role ILIKE '%bowling allrounder%' OR pb.playing_role ILIKE '%batting allrounder%')`);
            } else if (role === 'Wicket-keeper') {
                whereConditions.push(`(pb.playing_role ILIKE '%wicketkeeper%' OR pb.playing_role ILIKE '%wicket-keeper%')`);
            }
        }
        
        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
        
        // Get total count - UPDATED with frontend visibility
        const countQuery = `
            SELECT COUNT(DISTINCT p.id) as total 
            FROM players p
            INNER JOIN player_bios pb ON p.id = pb.player_id
            WHERE EXISTS (
                SELECT 1 FROM frontend_visible_players fvp 
                WHERE fvp.player_id = p.id 
                AND fvp.is_visible = TRUE
            )
            AND EXISTS (SELECT 1 FROM player_bios pb2 WHERE pb2.player_id = p.id)
            AND (
                EXISTS (SELECT 1 FROM player_career_batting cb WHERE cb.player_name = p.name AND cb.format IN ('Test', 'ODI', 'T20I'))
                OR 
                EXISTS (SELECT 1 FROM player_career_bowling bw WHERE bw.player_name = p.name AND bw.format IN ('Test', 'ODI', 'T20I'))
            )
            ${search ? `AND p.name ILIKE $${paramCount - (search ? 1 : 0)}` : ''}
            ${country ? `AND p.country = $${paramCount - (country ? 1 : 0) - (search ? 1 : 0)}` : ''}
        `;
        
        // Need to rebuild params for count query
        let countParams = [];
        if (search) countParams.push(`%${search}%`);
        if (country) countParams.push(country);
        
        const countResult = await pool.query(countQuery, countParams);
        const totalPlayers = parseInt(countResult.rows[0].total);
        
        // Build sorting
        let orderBy = '';
        if (sortBy === 'runs') {
            orderBy = `ORDER BY COALESCE(cb_stats.total_runs, 0) DESC`;
        } else if (sortBy === 'wickets') {
            orderBy = `ORDER BY COALESCE(bw_stats.total_wickets, 0) DESC`;
        } else if (sortBy === 'peak_rank') {
            orderBy = `ORDER BY pp_stats.best_peak_rank ASC NULLS LAST`;
        } else if (sortBy === 'goat_score') {
            orderBy = `ORDER BY COALESCE(goat_stats.goat_score, 0) DESC`;
        } else {
            orderBy = `ORDER BY p.name ASC`;
        }
        
        // Main query - WITH frontend visibility condition
        const mainQuery = `
            SELECT 
                p.id,
                p.name,
                p.country,
                COALESCE(pb.full_name, p.name) as full_name,
                COALESCE(cb_stats.total_runs, 0) as runs,
                COALESCE(cb_stats.batting_avg, 0) as batting_average,
                COALESCE(cb_stats.strike_rate, 0) as strike_rate,
                COALESCE(cb_stats.total_hundreds, 0) as centuries,
                COALESCE(cb_stats.total_fifties, 0) as fifties,
                COALESCE(bw_stats.total_wickets, 0) as wickets,
                COALESCE(bw_stats.bowling_avg, 0) as bowling_average,
                COALESCE(bw_stats.economy, 0) as economy,
                COALESCE(bw_stats.five_wickets, 0) as five_wickets,
                -- USE THE ACTUAL PLAYING_ROLE FROM DATABASE
                COALESCE(pb.playing_role, 'Cricketer') as role,
                pb.image_url,
                -- Peak rank from player_peak_final table
                pp_stats.best_peak_rank as best_peak_rank,
                -- GOAT score
                COALESCE(goat_stats.goat_score, 0) as goat_score,
                -- Player type based on actual stats
                CASE 
                    WHEN cb_stats.total_runs > 0 AND bw_stats.total_wickets > 0 THEN 'All-Rounder'
                    WHEN cb_stats.total_runs > 0 THEN 'Batsman'
                    WHEN bw_stats.total_wickets > 0 THEN 'Bowler'
                    ELSE 'Cricketer'
                END as player_type
            FROM players p
            INNER JOIN player_bios pb ON p.id = pb.player_id
            -- Frontend visibility filter
            INNER JOIN frontend_visible_players fvp ON p.id = fvp.player_id AND fvp.is_visible = TRUE
            LEFT JOIN (
                SELECT 
                    player_name, 
                    SUM(runs) as total_runs,
                    ROUND(AVG(batting_average), 2) as batting_avg,
                    ROUND(AVG(strike_rate), 2) as strike_rate,
                    SUM(centuries) as total_hundreds,
                    SUM(fifties) as total_fifties
                FROM player_career_batting 
                WHERE format IN ('Test', 'ODI', 'T20I')
                GROUP BY player_name
            ) cb_stats ON p.name = cb_stats.player_name
            LEFT JOIN (
                SELECT 
                    player_name, 
                    SUM(wickets) as total_wickets,
                    ROUND(AVG(average), 2) as bowling_avg,
                    ROUND(AVG(economy), 2) as economy,
                    SUM(five_wickets) as five_wickets
                FROM player_career_bowling 
                WHERE format IN ('Test', 'ODI', 'T20I')
                GROUP BY player_name
            ) bw_stats ON p.name = bw_stats.player_name
            LEFT JOIN (
                SELECT 
                    player_name,
                    MIN(peak_rank) as best_peak_rank
                FROM player_peak_final
                GROUP BY player_name
            ) pp_stats ON p.name = pp_stats.player_name
            LEFT JOIN (
                SELECT player_id, goat_score FROM goat_batsmen_rankings
                UNION ALL
                SELECT player_id, goat_score FROM goat_bowlers_rankings
                UNION ALL
                SELECT player_id, goat_score FROM goat_allrounders_rankings
            ) goat_stats ON p.id = goat_stats.player_id
            ${whereClause}
            ${orderBy}
            LIMIT $${paramCount} OFFSET $${paramCount + 1}
        `;
        
        // Reset params and rebuild for main query
        let mainParams = [];
        if (search) mainParams.push(`%${search}%`);
        if (country) mainParams.push(country);
        mainParams.push(parseInt(limit), offset);
        
        const result = await pool.query(mainQuery, mainParams);
        
        console.log(`✅ Players API: Found ${totalPlayers} visible players, returning ${result.rows.length}`);
        
        res.json({
            success: true,
            data: result.rows,
            total: totalPlayers,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(totalPlayers / parseInt(limit))
        });
        
    } catch (error) {
        console.error('Players API error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/players/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 2) {
            return res.json({ success: true, data: [] });
        }
        
        const searchResult = await pool.query(
            `SELECT DISTINCT ON (LOWER(name)) id, name, country 
             FROM players 
             WHERE name ILIKE $1 
             ORDER BY LOWER(name), id
             LIMIT 10`,
            [`%${q}%`]
        );
        res.json({ success: true, data: searchResult.rows });
    } catch (error) {
        console.error('Search error:', error);
        res.json({ success: true, data: [] });
    }
});

app.get('/api/players/:id', async (req, res) => {
    try {
        const playerId = parseInt(req.params.id);
        const playerResult = await pool.query(
            `SELECT id, name, full_name, country, batting_style, bowling_style FROM players WHERE id = $1`,
            [playerId]
        );
        
        if (playerResult.rows.length === 0) {
            return res.status(404).json({ error: 'Player not found' });
        }
        res.json({ success: true, data: playerResult.rows[0] });
    } catch (error) {
        console.error('Player error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/players/:id/complete', async (req, res) => {
    try {
        const playerId = parseInt(req.params.id);
        
        // Get player with bio - SIMPLIFIED
        const playerResult = await pool.query(`
            SELECT 
                p.id, 
                p.name, 
                p.country, 
                p.batting_style, 
                p.bowling_style,
                pb.full_name, 
                pb.birth_date, 
                pb.birth_place, 
                pb.major_teams,
                pb.playing_role, 
                pb.height, 
                pb.description, 
                pb.awards, 
                pb.image_url
            FROM players p
            LEFT JOIN player_bios pb ON pb.player_id = p.id
            WHERE p.id = $1
        `, [playerId]);
        
        if (playerResult.rows.length === 0) {
            return res.status(404).json({ error: 'Player not found' });
        }
        
        const player = playerResult.rows[0];
        const playerName = player.name;
        
        console.log(`Fetching stats for: ${playerName}`);
        
        // DIRECT QUERY - NO NAME MAPPING (use exact name from players table)
        const battingResult = await pool.query(`
            SELECT 
                format, 
                matches, 
                runs, 
                balls, 
                COALESCE(fours, 0) as fours,
                COALESCE(sixes, 0) as sixes,
                strike_rate,
                centuries, 
                fifties, 
                highest_score, 
                batting_average
            FROM player_career_batting 
            WHERE player_name = $1
            ORDER BY CASE format 
                WHEN 'Test' THEN 1 
                WHEN 'ODI' THEN 2 
                WHEN 'T20I' THEN 3 
                WHEN 'IPL' THEN 4 
                ELSE 5 
            END
        `, [playerName]);
        
        const bowlingResult = await pool.query(`
            SELECT 
                format, 
                matches, 
                wickets, 
                runs_given, 
                balls, 
                economy, 
                average,
                COALESCE(five_wickets, 0) as five_wickets,
                COALESCE(best_figures, 'N/A') as best_figures
            FROM player_career_bowling 
            WHERE player_name = $1
            ORDER BY CASE format 
                WHEN 'Test' THEN 1 
                WHEN 'ODI' THEN 2 
                WHEN 'T20I' THEN 3 
                WHEN 'IPL' THEN 4 
                ELSE 5 
            END
        `, [playerName]);
        
        // Rankings - TRY MULTIPLE MATCHING STRATEGIES
        let rankingsResult = await pool.query(`
            SELECT format, category, peak_rank as rank, peak_rating as rating
            FROM player_peak_final
            WHERE player_name = $1
            ORDER BY peak_rank ASC
        `, [playerName]);
        
        // If no results, try case-insensitive
        if (rankingsResult.rows.length === 0) {
            rankingsResult = await pool.query(`
                SELECT format, category, peak_rank as rank, peak_rating as rating
                FROM player_peak_final
                WHERE LOWER(player_name) = LOWER($1)
                ORDER BY peak_rank ASC
            `, [playerName]);
        }
        
        // If still no results, try partial match
        if (rankingsResult.rows.length === 0) {
            const lastName = playerName.split(' ').pop();
            rankingsResult = await pool.query(`
                SELECT format, category, peak_rank as rank, peak_rating as rating
                FROM player_peak_final
                WHERE player_name ILIKE $1
                ORDER BY peak_rank ASC
            `, [`%${lastName}%`]);
        }
        
        console.log(`Found ${battingResult.rows.length} batting records, ${bowlingResult.rows.length} bowling records, ${rankingsResult.rows.length} rankings`);
        
        res.json({
            success: true,
            data: {
                id: player.id,
                name: player.name,
                full_name: player.full_name || player.name,
                country: player.country || 'International',
                batting_style: player.batting_style || 'Right-hand bat',
                bowling_style: player.bowling_style || 'Not specified',
                bio: {
                    full_name: player.full_name,
                    birth_date: player.birth_date,
                    birth_place: player.birth_place,
                    major_teams: player.major_teams,
                    playing_role: player.playing_role,
                    height: player.height,
                    description: player.description,
                    awards: player.awards,
                    image_url: player.image_url
                },
                batting_stats: battingResult.rows,
                bowling_stats: bowlingResult.rows,
                rankings: rankingsResult.rows
            }
        });
    } catch (error) {
        console.error('Player detail error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/players/top', async (req, res) => {
    try {
        const { limit = 6 } = req.query;
        const topResult = await pool.query(`
            SELECT player_name as name, SUM(runs) as runs
            FROM player_career_batting 
            GROUP BY player_name
            ORDER BY runs DESC
            LIMIT $1
        `, [limit]);
        res.json({ success: true, data: topResult.rows });
    } catch (error) {
        console.error('Top players error:', error);
        res.json({ success: true, data: [] });
    }
});

// ============================================
// TOURNAMENTS API
// ============================================

app.get('/api/tournaments/all', async (req, res) => {
    try {
        const tournamentResult = await pool.query(`
            SELECT * FROM tournaments ORDER BY year DESC
        `);
        res.json({ success: true, data: tournamentResult.rows });
    } catch (error) {
        console.error('Tournaments error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/tournaments/world-cup/winners', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT name as team_name, world_cup_wins
            FROM teams 
            WHERE world_cup_wins > 0
            ORDER BY world_cup_wins DESC, name
        `);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('World Cup winners error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/tournaments/t20-world-cup/winners', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT name as team_name, t20_world_cup_wins
            FROM teams 
            WHERE t20_world_cup_wins > 0
            ORDER BY t20_world_cup_wins DESC, name
        `);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('T20 World Cup winners error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/tournaments/champions-trophy/winners', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT name as team_name, champions_trophy_wins
            FROM teams 
            WHERE champions_trophy_wins > 0
            ORDER BY champions_trophy_wins DESC, name
        `);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Champions Trophy winners error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// COMPARE API
// ============================================

app.get('/api/compare/players', async (req, res) => {
    const { ids } = req.query;
    if (!ids) {
        return res.status(400).json({ error: 'Player IDs required' });
    }
    
    const playerIds = ids.split(',').map(id => parseInt(id));
    
    try {
        const players = [];
        for (const playerId of playerIds) {
            const result = await pool.query(`
                SELECT id, name, country, batting_style, bowling_style
                FROM players WHERE id = $1
            `, [playerId]);
            
            if (result.rows.length > 0) {
                const player = result.rows[0];
                const statsName = await getCareerStatsName(player.name, player.id);
                
                const batting = await pool.query(`
                    SELECT format, runs, batting_average, strike_rate, centuries, fifties
                    FROM player_career_batting 
                    WHERE player_name = $1
                `, [statsName]);
                
                const bowling = await pool.query(`
                    SELECT format, wickets, average, economy, five_wickets
                    FROM player_career_bowling 
                    WHERE player_name = $1
                `, [statsName]);
                
                players.push({
                    ...player,
                    batting_stats: batting.rows,
                    bowling_stats: bowling.rows
                });
            }
        }
        
        res.json({ success: true, data: players });
    } catch (error) {
        console.error('Compare error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/compare/teams', async (req, res) => {
    const { ids } = req.query;
    if (!ids) {
        return res.status(400).json({ error: 'Team IDs required' });
    }
    
    const teamIds = ids.split(',').map(id => parseInt(id));
    
    try {
        const result = await pool.query(`
            SELECT t.*, 
                   o.rank as overall_rank, o.rating as overall_rating,
                   odi.rank as odi_rank, odi.rating as odi_rating,
                   t20.rank as t20_rank, t20.rating as t20_rating
            FROM teams t
            LEFT JOIN overall_team_rankings o ON t.id = o.team_id
            LEFT JOIN odi_team_rankings odi ON t.id = odi.team_id
            LEFT JOIN t20i_team_rankings t20 ON t.id = t20.team_id
            WHERE t.id = ANY($1::int[])
        `, [teamIds]);
        
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Compare teams error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// 1. GET ALL IPL SEASONS
// ============================================
app.get('/api/ipl/seasons', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                s.id, s.year, s.total_matches, s.total_teams, s.final_venue,
                w.name as winner_name, r.name as runner_up_name,
                w.primary_color as winner_color
            FROM ipl_seasons s
            LEFT JOIN ipl_teams w ON s.winner_team_id = w.id
            LEFT JOIN ipl_teams r ON s.runner_up_team_id = r.id
            ORDER BY s.year DESC
        `);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching IPL seasons:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// 2. GET IPL SEASON BY YEAR
// ============================================
app.get('/api/ipl/seasons/:year', async (req, res) => {
    try {
        const year = parseInt(req.params.year);
        
        const seasonResult = await pool.query(`
            SELECT 
                s.id, s.year, s.total_matches, s.total_teams, s.final_venue, s.final_match_date, s.super_over_final,
                w.id as winner_id, w.name as winner_name, w.primary_color as winner_color,
                r.id as runner_up_id, r.name as runner_up_name,
                oc.name as orange_cap_player, pc.name as purple_cap_player, pot.name as player_of_tournament
            FROM ipl_seasons s
            LEFT JOIN ipl_teams w ON s.winner_team_id = w.id
            LEFT JOIN ipl_teams r ON s.runner_up_team_id = r.id
            LEFT JOIN players oc ON s.orange_cap_player_id = oc.id
            LEFT JOIN players pc ON s.purple_cap_player_id = pc.id
            LEFT JOIN players pot ON s.player_of_tournament_id = pot.id
            WHERE s.year = $1
        `, [year]);
        
        if (seasonResult.rows.length === 0) {
            return res.status(404).json({ error: 'IPL season not found' });
        }
        
        const season = seasonResult.rows[0];
        
        // Get points table
        const pointsResult = await pool.query(`
            SELECT 
                pt.*, t.name as team_name, t.short_name, t.primary_color
            FROM ipl_points_table pt
            JOIN ipl_teams t ON pt.team_id = t.id
            WHERE pt.season_id = $1
            ORDER BY pt.points DESC, pt.net_run_rate DESC
        `, [season.id]);
        
        // Get playoff matches
        const playoffsResult = await pool.query(`
            SELECT 
                pm.*,
                t1.name as team1_name, t2.name as team2_name, w.name as winner_name,
                t1.primary_color as team1_color, t2.primary_color as team2_color
            FROM ipl_playoff_matches pm
            LEFT JOIN ipl_teams t1 ON pm.team1_id = t1.id
            LEFT JOIN ipl_teams t2 ON pm.team2_id = t2.id
            LEFT JOIN ipl_teams w ON pm.winner_id = w.id
            WHERE pm.season_id = $1
            ORDER BY pm.match_date
        `, [season.id]);
        
        // Get all matches
        const matchesResult = await pool.query(`
            SELECT 
                m.*,
                t1.name as team1_name, t2.name as team2_name, w.name as winner_name,
                t1.primary_color as team1_color, t2.primary_color as team2_color
            FROM ipl_matches m
            LEFT JOIN ipl_teams t1 ON m.team1_id = t1.id
            LEFT JOIN ipl_teams t2 ON m.team2_id = t2.id
            LEFT JOIN ipl_teams w ON m.winner_id = w.id
            WHERE m.season_id = $1
            ORDER BY m.match_date
        `, [season.id]);
        
        res.json({
            success: true,
            data: {
                season,
                pointsTable: pointsResult.rows,
                playoffs: playoffsResult.rows,
                matches: matchesResult.rows
            }
        });
    } catch (error) {
        console.error('Error fetching IPL season:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// 3. GET IPL TEAM RANKINGS
// ============================================
app.get('/api/ipl/team-rankings', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                ROW_NUMBER() OVER (ORDER BY titles_won DESC, runner_up_count DESC) as rank,
                id, name, short_name, city, home_ground, titles_won, runner_up_count,
                primary_color, secondary_color, logo_url
            FROM ipl_teams
            WHERE titles_won > 0 OR runner_up_count > 0
            ORDER BY titles_won DESC, runner_up_count DESC
        `);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching IPL team rankings:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// 4. GET IPL TEAM DETAILS
// ============================================
app.get('/api/ipl/team/:teamName', async (req, res) => {
    try {
        const teamName = decodeURIComponent(req.params.teamName);
        
        // Get team info
        const teamResult = await pool.query(`
            SELECT * FROM ipl_teams WHERE name ILIKE $1
        `, [teamName]);
        
        if (teamResult.rows.length === 0) {
            return res.status(404).json({ error: 'Team not found' });
        }
        
        const team = teamResult.rows[0];
        
        // Get title victories with season details
        const victoriesResult = await pool.query(`
            SELECT 
                s.year, s.final_venue, s.final_match_date,
                r.name as runner_up_name,
                oc.name as orange_cap_player,
                pc.name as purple_cap_player,
                pot.name as player_of_tournament
            FROM ipl_seasons s
            LEFT JOIN ipl_teams r ON s.runner_up_team_id = r.id
            LEFT JOIN players oc ON s.orange_cap_player_id = oc.id
            LEFT JOIN players pc ON s.purple_cap_player_id = pc.id
            LEFT JOIN players pot ON s.player_of_tournament_id = pot.id
            WHERE s.winner_team_id = $1
            ORDER BY s.year DESC
        `, [team.id]);
        
        // Get winning squads for each title
        const victories = [];
        for (const victory of victoriesResult.rows) {
            const squadResult = await pool.query(`
                SELECT player_name, is_captain, is_wicket_keeper, role
                FROM ipl_winning_squads ws
                JOIN ipl_seasons s ON ws.season_id = s.id
                WHERE s.year = $1 AND s.winner_team_id = $2
            `, [victory.year, team.id]);
            
            victories.push({
                year: victory.year,
                runner_up: victory.runner_up_name,
                venue: victory.final_venue,
                final_date: victory.final_match_date,
                orange_cap: victory.orange_cap_player,
                purple_cap: victory.purple_cap_player,
                player_of_tournament: victory.player_of_tournament,
                squad: squadResult.rows
            });
        }
        
        res.json({
            success: true,
            data: {
                team,
                victories
            }
        });
    } catch (error) {
        console.error('Error fetching IPL team details:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// 5. GET IPL ALL-TIME RECORDS
// ============================================
app.get('/api/ipl/all-time-records', async (req, res) => {
    try {
        const mostRuns = await pool.query(`
            SELECT * FROM ipl_all_time_records WHERE category = 'most_runs' ORDER BY value DESC LIMIT 10
        `);
        const mostWickets = await pool.query(`
            SELECT * FROM ipl_all_time_records WHERE category = 'most_wickets' ORDER BY value DESC LIMIT 10
        `);
        const mostSixes = await pool.query(`
            SELECT * FROM ipl_all_time_records WHERE category = 'most_sixes' ORDER BY value DESC LIMIT 10
        `);
        const mostHundreds = await pool.query(`
            SELECT * FROM ipl_all_time_records WHERE category = 'most_hundreds' ORDER BY value DESC LIMIT 10
        `);
        
        res.json({
            success: true,
            data: {
                mostRuns: mostRuns.rows,
                mostWickets: mostWickets.rows,
                mostSixes: mostSixes.rows,
                mostHundreds: mostHundreds.rows
            }
        });
    } catch (error) {
        console.error('Error fetching IPL records:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// 6. GET IPL GREATEST MATCHES
// ============================================
app.get('/api/ipl/greatest-matches', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                ROW_NUMBER() OVER (ORDER BY is_featured DESC, season_year DESC) as rank,
                *
            FROM ipl_greatest_matches
            ORDER BY is_featured DESC, season_year DESC
            LIMIT 20
        `);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching IPL greatest matches:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// 7. GET IPL PLAYER STATS (for player detail page)
// ============================================
app.get('/api/ipl/players/:playerId/stats', async (req, res) => {
    try {
        const playerId = parseInt(req.params.playerId);
        
        // Get player name first
        const playerResult = await pool.query(`
            SELECT name FROM players WHERE id = $1
        `, [playerId]);
        
        if (playerResult.rows.length === 0) {
            return res.json({ success: true, data: { batting: [], bowling: [] } });
        }
        
        const playerName = playerResult.rows[0].name;
        
        // Get IPL batting stats
        const battingResult = await pool.query(`
            SELECT 
                season_year, team_name, matches, innings, runs, highest_score,
                strike_rate, batting_average, fours, sixes, fifties, centuries
            FROM ipl_player_batting
            WHERE player_name ILIKE $1 OR player_id = $2
            ORDER BY season_year DESC
        `, [`%${playerName.split(' ')[0]}%`, playerId]);
        
        // Get IPL bowling stats
        const bowlingResult = await pool.query(`
            SELECT 
                season_year, team_name, matches, innings, wickets, runs_conceded,
                economy, bowling_average, best_bowling, four_wickets, five_wickets
            FROM ipl_player_bowling
            WHERE player_name ILIKE $1 OR player_id = $2
            ORDER BY season_year DESC
        `, [`%${playerName.split(' ')[0]}%`, playerId]);
        
        // Calculate career totals
        let careerStats = {
            totalRuns: 0,
            totalMatches: 0,
            totalWickets: 0,
            bestSeason: null
        };
        
        battingResult.rows.forEach(stat => {
            careerStats.totalRuns += stat.runs || 0;
            careerStats.totalMatches += stat.matches || 0;
        });
        
        bowlingResult.rows.forEach(stat => {
            careerStats.totalWickets += stat.wickets || 0;
        });
        
        res.json({
            success: true,
            data: {
                batting: battingResult.rows,
                bowling: bowlingResult.rows,
                career: careerStats
            }
        });
    } catch (error) {
        console.error('Error fetching IPL player stats:', error);
        res.json({ success: true, data: { batting: [], bowling: [], career: {} } });
    }
});

// ============================================
// 8. GET IPL SEASON STATS (Top performers)
// ============================================
app.get('/api/ipl/seasons/:year/stats', async (req, res) => {
    try {
        const year = parseInt(req.params.year);
        
        // Get top run scorers from IPL player batting
        const topRuns = await pool.query(`
            SELECT 
                player_name, runs, strike_rate, batting_average, sixes, fifties, centuries, team_name
            FROM ipl_player_batting
            WHERE season_year = $1 AND runs > 0
            ORDER BY runs DESC
            LIMIT 10
        `, [year]);
        
        // Get top wicket takers
        const topWickets = await pool.query(`
            SELECT 
                player_name, wickets, economy, bowling_average, five_wickets, team_name
            FROM ipl_player_bowling
            WHERE season_year = $1 AND wickets > 0
            ORDER BY wickets DESC
            LIMIT 10
        `, [year]);
        
        res.json({
            success: true,
            data: {
                topRuns: topRuns.rows,
                topWickets: topWickets.rows
            }
        });
    } catch (error) {
        console.error('Error fetching IPL season stats:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// IPL PLAYERS API ENDPOINTS
// ============================================

// Get all IPL players (visible players with IPL data)
app.get('/api/ipl/players', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 24, 
      search = '', 
      role = '', 
      sortBy = 'ipl_runs' 
    } = req.query;
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let queryParams = [];
    let paramCount = 1;
    
    // Main query - Get players with IPL data who are visible
    let mainQuery = `
      SELECT 
        p.id,
        p.name,
        COALESCE(pb.full_name, p.name) as full_name,
        p.country,
        COALESCE(pb.playing_role, 'Cricketer') as role,
        COALESCE(ipl_batting.ipl_runs, 0) as ipl_runs,
        COALESCE(ipl_bowling.ipl_wickets, 0) as ipl_wickets,
        COALESCE(ipl_batting.ipl_matches, 0) as ipl_matches,
        ROUND(COALESCE(ipl_batting.ipl_batting_avg, 0), 2) as ipl_batting_avg,
        ROUND(COALESCE(ipl_bowling.ipl_bowling_avg, 0), 2) as ipl_bowling_avg,
        ROUND(COALESCE(ipl_batting.ipl_strike_rate, 0), 2) as ipl_strike_rate,
        ROUND(COALESCE(ipl_bowling.ipl_economy, 0), 2) as ipl_economy,
        COALESCE(ipl_batting.best_score, 0) as best_score,
        COALESCE(ipl_bowling.best_bowling, '-') as best_bowling,
        pb.image_url
      FROM players p
      INNER JOIN player_bios pb ON p.id = pb.player_id
      INNER JOIN frontend_visible_players fvp ON p.id = fvp.player_id AND fvp.is_visible = TRUE
      LEFT JOIN (
        SELECT 
          player_name,
          SUM(COALESCE(runs, 0)) as ipl_runs,
          SUM(COALESCE(matches, 0)) as ipl_matches,
          AVG(NULLIF(batting_average, 0)) as ipl_batting_avg,
          AVG(NULLIF(strike_rate, 0)) as ipl_strike_rate,
          MAX(highest_score) as best_score
        FROM player_career_batting
        WHERE format = 'IPL'
        GROUP BY player_name
      ) ipl_batting ON p.name = ipl_batting.player_name
      LEFT JOIN (
        SELECT 
          player_name,
          SUM(COALESCE(wickets, 0)) as ipl_wickets,
          AVG(NULLIF(average, 0)) as ipl_bowling_avg,
          AVG(NULLIF(economy, 0)) as ipl_economy,
          MAX(best_figures) as best_bowling
        FROM player_career_bowling
        WHERE format = 'IPL'
        GROUP BY player_name
      ) ipl_bowling ON p.name = ipl_bowling.player_name
      WHERE (ipl_batting.player_name IS NOT NULL OR ipl_bowling.player_name IS NOT NULL)
    `;
    
    // Add search filter
    if (search) {
      mainQuery += ` AND p.name ILIKE $${paramCount}`;
      queryParams.push(`%${search}%`);
      paramCount++;
    }
    
    // Add role filter
    if (role) {
      if (role === 'Batsman') {
        mainQuery += ` AND ipl_batting.player_name IS NOT NULL AND ipl_bowling.player_name IS NULL`;
      } else if (role === 'Bowler') {
        mainQuery += ` AND ipl_batting.player_name IS NULL AND ipl_bowling.player_name IS NOT NULL`;
      } else if (role === 'All-rounder') {
        mainQuery += ` AND ipl_batting.player_name IS NOT NULL AND ipl_bowling.player_name IS NOT NULL`;
      }
    }
    
    // Add sorting
    switch (sortBy) {
      case 'ipl_runs':
        mainQuery += ' ORDER BY COALESCE(ipl_batting.ipl_runs, 0) DESC';
        break;
      case 'ipl_wickets':
        mainQuery += ' ORDER BY COALESCE(ipl_bowling.ipl_wickets, 0) DESC';
        break;
      case 'ipl_batting_avg':
        mainQuery += ' ORDER BY COALESCE(ipl_batting.ipl_batting_avg, 0) DESC';
        break;
      case 'ipl_strike_rate':
        mainQuery += ' ORDER BY COALESCE(ipl_batting.ipl_strike_rate, 0) DESC';
        break;
      case 'name':
        mainQuery += ' ORDER BY p.name ASC';
        break;
      default:
        mainQuery += ' ORDER BY COALESCE(ipl_batting.ipl_runs, 0) DESC';
    }
    
    // Get total count
    let countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM players p
      INNER JOIN frontend_visible_players fvp ON p.id = fvp.player_id AND fvp.is_visible = TRUE
      WHERE EXISTS (
        SELECT 1 FROM player_career_batting cb WHERE cb.player_name = p.name AND cb.format = 'IPL'
        UNION
        SELECT 1 FROM player_career_bowling bw WHERE bw.player_name = p.name AND bw.format = 'IPL'
      )
    `;
    
    if (search) {
      countQuery += ` AND p.name ILIKE $1`;
      const countResult = await pool.query(countQuery, [`%${search}%`]);
      var totalPlayers = parseInt(countResult.rows[0].total);
    } else {
      const countResult = await pool.query(countQuery);
      var totalPlayers = parseInt(countResult.rows[0].total);
    }
    
    // Add pagination
    mainQuery += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    queryParams.push(parseInt(limit), offset);
    
    const result = await pool.query(mainQuery, queryParams);
    
    res.json({
      success: true,
      data: result.rows,
      total: totalPlayers,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalPlayers / parseInt(limit))
    });
    
  } catch (error) {
    console.error('Error fetching IPL players:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single IPL player details by ID
app.get('/api/ipl/players/:id', async (req, res) => {
  try {
    const playerId = parseInt(req.params.id);
    
    // Get player basic info
    const playerResult = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.country,
        p.batting_style,
        p.bowling_style,
        pb.full_name,
        pb.playing_role,
        pb.image_url,
        pb.description
      FROM players p
      JOIN player_bios pb ON p.id = pb.player_id
      WHERE p.id = $1
    `, [playerId]);
    
    if (playerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    const player = playerResult.rows[0];
    const playerName = player.name;
    
    // Get IPL batting career stats
    const iplBattingResult = await pool.query(`
      SELECT 
        COALESCE(SUM(runs), 0) as total_runs,
        COALESCE(SUM(matches), 0) as total_matches,
        COALESCE(MAX(highest_score), 0) as best_score,
        ROUND(AVG(NULLIF(batting_average, 0)), 2) as batting_avg,
        ROUND(AVG(NULLIF(strike_rate, 0)), 2) as strike_rate,
        COALESCE(SUM(centuries), 0) as centuries,
        COALESCE(SUM(fifties), 0) as fifties,
        COALESCE(SUM(fours), 0) as fours,
        COALESCE(SUM(sixes), 0) as sixes
      FROM player_career_batting
      WHERE player_name = $1 AND format = 'IPL'
    `, [playerName]);
    
    // Get IPL bowling career stats
    const iplBowlingResult = await pool.query(`
      SELECT 
        COALESCE(SUM(wickets), 0) as total_wickets,
        ROUND(AVG(NULLIF(average, 0)), 2) as bowling_avg,
        ROUND(AVG(NULLIF(economy, 0)), 2) as economy,
        COALESCE(SUM(five_wickets), 0) as five_wickets,
        MAX(best_figures) as best_bowling
      FROM player_career_bowling
      WHERE player_name = $1 AND format = 'IPL'
    `, [playerName]);
    
    const battingStats = iplBattingResult.rows[0] || {};
    const bowlingStats = iplBowlingResult.rows[0] || {};
    
    const careerStats = {
      matches: battingStats.total_matches || 0,
      runs: battingStats.total_runs || 0,
      highest_score: battingStats.best_score || 0,
      batting_average: parseFloat(battingStats.batting_avg) || 0,
      strike_rate: parseFloat(battingStats.strike_rate) || 0,
      hundreds: battingStats.centuries || 0,
      fifties: battingStats.fifties || 0,
      fours: battingStats.fours || 0,
      sixes: battingStats.sixes || 0,
      wickets: bowlingStats.total_wickets || 0,
      best_bowling: bowlingStats.best_bowling || '-',
      bowling_average: parseFloat(bowlingStats.bowling_avg) || 0,
      economy: parseFloat(bowlingStats.economy) || 0,
      five_wickets: bowlingStats.five_wickets || 0
    };
    
    res.json({
      success: true,
      data: {
        id: player.id,
        name: player.name,
        full_name: player.full_name,
        country: player.country,
        playing_role: player.playing_role,
        batting_style: player.batting_style,
        bowling_style: player.bowling_style,
        image_url: player.image_url,
        career_stats: careerStats,
        teams_played: [], // No team data available in current schema
        description: player.description
      }
    });
    
  } catch (error) {
    console.error('Error fetching IPL player details:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// IPL ALL-TIME RECORDS API
// ============================================

app.get('/api/ipl/all-time-records', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                category,
                player_name,
                value,
                matches_played,
                seasons_played,
                team_name
            FROM ipl_all_time_records
            ORDER BY 
                CASE category 
                    WHEN 'most_runs' THEN 1
                    WHEN 'most_wickets' THEN 2
                    WHEN 'most_sixes' THEN 3
                    WHEN 'most_hundreds' THEN 4
                END, 
                value DESC
        `);
        
        // Group by category
        const grouped = {
            mostRuns: [],
            mostWickets: [],
            mostSixes: [],
            mostHundreds: []
        };
        
        result.rows.forEach(row => {
            switch(row.category) {
                case 'most_runs':
                    grouped.mostRuns.push({
                        player_name: row.player_name,
                        runs: row.value,
                        matches_played: row.matches_played
                    });
                    break;
                case 'most_wickets':
                    grouped.mostWickets.push({
                        player_name: row.player_name,
                        wickets: row.value,
                        matches_played: row.matches_played
                    });
                    break;
                case 'most_sixes':
                    grouped.mostSixes.push({
                        player_name: row.player_name,
                        sixes: row.value,
                        matches_played: row.matches_played
                    });
                    break;
                case 'most_hundreds':
                    grouped.mostHundreds.push({
                        player_name: row.player_name,
                        hundreds: row.value,
                        matches_played: row.matches_played
                    });
                    break;
            }
        });
        
        res.json({ success: true, data: grouped });
        
    } catch (error) {
        console.error('Error fetching IPL records:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// IPL GREATEST MATCHES API
// ============================================

app.get('/api/ipl/greatest-matches', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                ROW_NUMBER() OVER (ORDER BY is_featured DESC, season_year DESC) as rank,
                season_year as year,
                match_type,
                title,
                description,
                team1_name,
                team2_name,
                team1_score,
                team1_wickets,
                team1_overs,
                team2_score,
                team2_wickets,
                team2_overs,
                (team1_score + team2_score) as total_runs,
                winner_name,
                winner_margin,
                venue,
                match_date,
                man_of_match,
                is_featured
            FROM ipl_greatest_matches
            ORDER BY is_featured DESC, season_year DESC
        `);
        
        // Split into highest scoring and closest finishes for compatibility
        const highestScoring = result.rows.filter(m => m.total_runs > 300).slice(0, 10);
        const closestFinishes = result.rows.filter(m => 
            m.winner_margin && (m.winner_margin.includes('run') || m.winner_margin.includes('wicket'))
        ).slice(0, 10);
        
        res.json({ 
            success: true, 
            data: {
                highestScoring: highestScoring,
                closestFinishes: closestFinishes
            }
        });
        
    } catch (error) {
        console.error('Error fetching IPL greatest matches:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get IPL Cap Winners (Orange Cap & Purple Cap)
app.get('/api/ipl/cap-winners', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                year,
                orange_cap_player,
                orange_cap_runs,
                orange_cap_team,
                purple_cap_player,
                purple_cap_wickets,
                purple_cap_team
            FROM ipl_cap_winners
            ORDER BY year DESC
        `);
        
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching cap winners:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// GAMES API
// ============================================

app.post('/api/games/quick-cricket/start', (req, res) => {
    res.json({ success: true, data: { gameId: `game_${Date.now()}`, runs: 0, wickets: 0, balls: 0, maxBalls: 6, isGameOver: false } });
});

app.post('/api/games/quick-cricket/play', (req, res) => {
    const outcomes = [
        { runs: 4, isWicket: false, message: 'FOUR!', animation: 'boundary' },
        { runs: 6, isWicket: false, message: 'SIX!', animation: 'six' },
        { runs: 1, isWicket: false, message: 'Single', animation: 'single' },
        { runs: 2, isWicket: false, message: 'Double', animation: 'double' },
        { runs: 3, isWicket: false, message: 'Triple', animation: 'triple' },
        { runs: 0, isWicket: true, message: 'OUT!', animation: 'wicket' },
        { runs: 0, isWicket: false, message: 'Dot ball', animation: 'dot' }
    ];
    const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    res.json({ success: true, data: { outcome, gameOver: outcome.isWicket } });
});

app.get('/api/games/leaderboard/:gameType', (req, res) => {
    res.json({ success: true, data: [] });
});

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', async (req, res) => {
    try {
        const healthResult = await pool.query('SELECT COUNT(DISTINCT name) FROM players');
        const teamResult = await pool.query('SELECT COUNT(*) FROM teams');
        res.json({ 
            status: 'OK', 
            players: parseInt(healthResult.rows[0].count),
            teams: parseInt(teamResult.rows[0].count),
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ status: 'ERROR', error: error.message });
    }
});

// ============================================
// START SERVER
// ============================================

server.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Database connected`);
    console.log(`\n📋 Available Endpoints:`);
    console.log(`   GET  /api/rankings/:format/:category - Player Rankings`);
    console.log(`   GET  /api/rankings/goat - GOAT Rankings`);
    console.log(`   GET  /api/team-rankings/:format - Team Rankings`);
    console.log(`   GET  /api/team-rankings/all - All Team Rankings`);
    console.log(`   GET  /api/team/:id - Team Details`);
    console.log(`   GET  /api/players - Players List`);
    console.log(`   GET  /api/players/:id/complete - Player Details`);
    console.log(`   GET  /api/compare/players - Compare Players`);
    console.log(`   GET  /api/compare/teams - Compare Teams`);
    console.log(`   GET  /api/tournaments/* - Tournament Info`);
    console.log(`   GET  /health - Health Check`);
});
