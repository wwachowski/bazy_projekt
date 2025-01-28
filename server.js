const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Konfiguracja połączenia z Oracle
const dbConfig = {
  user: 'c##projekt',
  password: 'qwerty',
  connectString: '192.168.56.1:1521/XE'
};

// Endpoint do logowania
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  let connection;
  try {
      // Nawiązanie połączenia z bazą danych
      connection = await oracledb.getConnection(dbConfig);
    // Wykonanie zapytania SQL
    const result = await connection.execute(
      `SELECT * FROM Users WHERE email = :email AND password = :password`,
      [email, password]
    );

    // Sprawdzenie wyników
    if (result.rows.length > 0) {
      res.json({ success: true, user: result.rows[0] });
    } else {
      res.status(401).json({ success: false, message: 'Nieprawidłowe dane logowania' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Błąd serwera' });
  } finally {
    // Zamknięcie połączenia
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

app.get('/api/users', async (req, res) => {
    let connection;
    try {
      connection = await oracledb.getConnection(dbConfig);
      const result = await connection.execute(`SELECT * FROM Users`);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Błąd serwera' });
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  });

  app.get('/api/leave-types', async (req, res) => {
    let connection;
    try {
      connection = await oracledb.getConnection(dbConfig);
      const result = await connection.execute(`SELECT * FROM LeaveTypes`);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Błąd serwera' });
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  });

// Uruchomienie serwera
app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
  
});