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
  connectString: 'localhost:1521/XE'
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

// Backend endpoints for LeaveApplicationsStatuses

// Endpoint to add a new Leave Application Status
app.post('/api/leave-application-statuses', async (req, res) => {
  console.log(req.body);
  const { IS_INITIAL, NAME, CODE } = req.body; // Properties in CAPS_LOCK
  const is_initial = IS_INITIAL;
  const name = NAME;
  const code = CODE;

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `INSERT INTO LeaveApplicationsStatuses (id, is_initial, name, code)
      VALUES (leave_app_statuses_seq.NEXTVAL, :is_initial, :name, :code)`,
      [is_initial, name, code],
      { autoCommit: true }
    );

    res.json({ success: true, message: 'Nowy status aplikacji urlopowej został dodany' });
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

// Endpoint to update an existing Leave Application Status
app.put('/api/leave-application-statuses/:id', async (req, res) => {
  const statusId = req.params.id;
  const { IS_INITIAL, NAME, CODE } = req.body; // Properties in CAPS_LOCK
  const is_initial = IS_INITIAL;
  const name = NAME;
  const code = CODE;

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `UPDATE LeaveApplicationsStatuses 
      SET is_initial = :is_initial, name = :name, code = :code 
      WHERE id = :id`,
      [is_initial, name, code, statusId],
      { autoCommit: true }
    );

    if (result.rowsAffected > 0) {
      res.json({ success: true, message: 'Status aplikacji urlopowej zaktualizowany pomyślnie' });
    } else {
      res.status(404).json({ success: false, message: 'Nie znaleziono statusu aplikacji urlopowej' });
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

// Endpoint to fetch all Leave Application Statuses
app.get('/api/leave-application-statuses', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(`SELECT * FROM LeaveApplicationsStatuses`);
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

// Endpoint to delete a Leave Application Status
app.delete('/api/leave-application-statuses/:id', async (req, res) => {
  const statusId = req.params.id;

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `DELETE FROM LeaveApplicationsStatuses WHERE id = :id`,
      [statusId],
      { autoCommit: true }
    );

    if (result.rowsAffected > 0) {
      res.json({ success: true, message: 'Status aplikacji urlopowej został usunięty' });
    } else {
      res.status(404).json({ success: false, message: 'Nie znaleziono statusu aplikacji urlopowej' });
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

// Endpoint to add a new Leave Application Action
app.post('/api/leave-application-actions', async (req, res) => {
  console.log(req.body);
  const {
    SOURCE_STATUS_ID,
    DESTINATION_STATUS_ID,
    NAME,
    COLOR,
    ACTION_INDEX,
    DESCRIPTION,
    AVAILABILITY_ROLE
  } = req.body; // Properties in CAPS_LOCK

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `INSERT INTO LeaveApplicationsActions (id, source_status_id, destination_status_id, name, color, action_index, description, availability_role)
      VALUES (leave_app_actions_seq.NEXTVAL, :source_status_id, :destination_status_id, :name, :color, :action_index, :description, :availability_role)`,
      [SOURCE_STATUS_ID, DESTINATION_STATUS_ID, NAME, COLOR, ACTION_INDEX, DESCRIPTION, AVAILABILITY_ROLE],
      { autoCommit: true }
    );

    res.json({ success: true, message: 'Nowa akcja została dodana' });
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

// Endpoint to update an existing Leave Application Action
app.put('/api/leave-application-actions/:id', async (req, res) => {
  const actionId = req.params.id;
  const {
    SOURCE_STATUS_ID,
    DESTINATION_STATUS_ID,
    NAME,
    COLOR,
    ACTION_INDEX,
    DESCRIPTION,
    AVAILABILITY_ROLE
  } = req.body; // Properties in CAPS_LOCK

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `UPDATE LeaveApplicationsActions 
      SET source_status_id = :source_status_id, 
          destination_status_id = :destination_status_id, 
          name = :name, 
          color = :color, 
          action_index = :action_index, 
          description = :description, 
          availability_role = :availability_role 
      WHERE id = :id`,
      [
        SOURCE_STATUS_ID,
        DESTINATION_STATUS_ID,
        NAME,
        COLOR,
        ACTION_INDEX,
        DESCRIPTION,
        AVAILABILITY_ROLE,
        actionId
      ],
      { autoCommit: true }
    );

    if (result.rowsAffected > 0) {
      res.json({ success: true, message: 'Akcja została zaktualizowana pomyślnie' });
    } else {
      res.status(404).json({ success: false, message: 'Nie znaleziono akcji' });
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

// Endpoint to fetch all Leave Application Actions
app.get('/api/leave-application-actions', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(`SELECT * FROM LeaveApplicationsActions`);
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

// Endpoint to delete a Leave Application Action
app.delete('/api/leave-application-actions/:id', async (req, res) => {
  const actionId = req.params.id;

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `DELETE FROM LeaveApplicationsActions WHERE id = :id`,
      [actionId],
      { autoCommit: true }
    );

    if (result.rowsAffected > 0) {
      res.json({ success: true, message: 'Akcja została usunięta' });
    } else {
      res.status(404).json({ success: false, message: 'Nie znaleziono akcji' });
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

app.get('/api/subordinates/:manager_id', async (req, res) => {
  const managerId = req.params.manager_id;
  console.log(managerId);
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    // Wywołanie funkcji z kursorem
    const result = await connection.execute(
      `BEGIN
         :result := GetSubordinates(:manager_id);
       END;`,
      {
        result: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }, // BIND_OUT dla kursora
        manager_id: managerId
      }
    );

    // Odczyt danych z kursora
    const cursor = result.outBinds.result;
    const rows = await cursor.getRows();

    // Zwrócenie wyników w formacie JSON
    res.json(rows);
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

// Endpoint do pobierania dni urlopu pracownika
app.get('/api/leave-days/:employee_id', async (req, res) => {
  const employeeId = req.params.employee_id;

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    
    // Wywołanie funkcji GetLeaveDays z bazy danych
    const result = await connection.execute(
      `BEGIN
         :result := GetLeaveDays(:employee_id);
       END;`,
      {
        employee_id: employeeId,
        result: { type: oracledb.STRING, dir: oracledb.BIND_OUT } // wynik funkcji
      }
    );

    // Odpowiedź z dniami urlopu
    res.json({ success: true, leaveDays: result.outBinds.result });
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
