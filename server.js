const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
const bodyParser = require('body-parser');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
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
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT * FROM Users WHERE email = :email AND password = :password`,
      [email, password]
    );

    if (result.rows.length > 0) {
      res.json({ success: true, user: result.rows[0] });
    } else {
      res.status(401).json({ success: false, message: 'Nieprawidłowe dane logowania' });
    }
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

// Endpoint do pobierania typów urlopów
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

// Endpoint do dodawania nowego typu urlopu
app.post('/api/leave-types', async (req, res) => {
  console.log(req.body);
  const { CAPTION, CODE } = req.body;  // Poprawione na CAPS_LOCK
  const caption = CAPTION;
  const code = CODE;

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `INSERT INTO LeaveTypes (id, caption, code)
      VALUES (leave_types_seq.NEXTVAL, :caption, :code)`,
      [caption, code],
      { autoCommit: true }
    );

    res.json({ success: true, message: 'Nowy typ urlopu został dodany' });
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

// Endpoint do aktualizacji typu urlopu
app.put('/api/leave-types/:id', async (req, res) => {
  const leaveTypeId = req.params.id;
  const { CAPTION, CODE } = req.body;  // Poprawione na CAPS_LOCK
  const caption = CAPTION;
  const code = CODE;

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `UPDATE LeaveTypes 
      SET caption = :caption, code = :code 
      WHERE id = :id`,
      [caption, code, leaveTypeId],
      { autoCommit: true }
    );

    if (result.rowsAffected > 0) {
      res.json({ success: true, message: 'Typ urlopu zaktualizowany pomyślnie' });
    } else {
      res.status(404).json({ success: false, message: 'Nie znaleziono typu urlopu' });
    }
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


// Endpoint do usunięcia typu urlopu
app.delete('/api/leave-types/:id', async (req, res) => {
  const leaveTypeId = req.params.id;

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `DELETE FROM LeaveTypes WHERE id = :id`,
      [leaveTypeId],
      { autoCommit: true }
    );

    if (result.rowsAffected > 0) {
      res.json({ success: true, message: 'Typ urlopu usunięty pomyślnie' });
    } else {
      res.status(404).json({ success: false, message: 'Nie znaleziono typu urlopu' });
    }
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

app.get('/api/employees', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    
    // Zapytanie SQL do pobrania wszystkich pracowników
    const result = await connection.execute(`SELECT * FROM Employees`);
    
    // Zwrócenie wyników w formacie JSON
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


app.post('/api/leave-application', async (req, res) => {
  const { employee_id, start_date, end_date, status_id, description } = req.body;

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `INSERT INTO LeaveApplications (id, employee_id, start_date, end_date, status_id, description)
      VALUES (leave_applications_seq.NEXTVAL, :employee_id, TO_DATE(:start_date, 'YYYY-MM-DD'), TO_DATE(:end_date, 'YYYY-MM-DD'), :status_id, :description)`,
      [employee_id, start_date, end_date, status_id, description],
      { autoCommit: true }
    );

    res.json({ success: true, message: 'Wniosek urlopowy został dodany' });
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

app.put('/api/employees/:id', async (req, res) => {
  const employeeId = req.params.id;
  const { EMPLOYEE_TYPE, USER_ID } = req.body; // Nowe właściwości w wielkich literach

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `UPDATE Employees 
       SET EMPLOYEE_TYPE = :EMPLOYEE_TYPE, USER_ID = :USER_ID 
       WHERE ID = :ID`, // Używamy wielkich liter
      [EMPLOYEE_TYPE, USER_ID, employeeId],
      { autoCommit: true }
    );

    if (result.rowsAffected > 0) {
      res.json({ success: true, message: 'Pracownik zaktualizowany pomyślnie' });
    } else {
      res.status(404).json({ success: false, message: 'Nie znaleziono pracownika' });
    }
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

// DELETE - Usuwanie pracownika
app.delete('/api/employees/:id', async (req, res) => {
  const employeeId = req.params.id;

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `DELETE FROM Employees WHERE id = :id`,
      [employeeId],
      { autoCommit: true }
    );

    if (result.rowsAffected > 0) {
      res.json({ success: true, message: 'Pracownik usunięty pomyślnie' });
    } else {
      res.status(404).json({ success: false, message: 'Nie znaleziono pracownika' });
    }
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

// Uruchomienie serwera
app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});
