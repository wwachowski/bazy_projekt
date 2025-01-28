CREATE USER c##projekt IDENTIFIED BY qwerty;
GRANT ALL PRIVILEGES TO c##projekt;
ALTER SESSION SET CURRENT_SCHEMA = c##projekt;

SELECT table_name FROM user_tables;



SELECT CDB FROM V$DATABASE;

SELECT PDB_NAME, STATUS FROM DBA_PDBS;

-- Zmieniamy na PBA gdzie stworzymy schemat
ALTER SESSION SET CONTAINER = XEPDB1;

-- Tworzymy schemat/usera projekt
CREATE USER projekt IDENTIFIED BY qwerty;

ALTER SESSION SET CURRENT_SCHEMA = c##projekt;

-- Nadawanie uprawnień userowi projekt
GRANT CREATE SESSION, CREATE TABLE, CREATE PROCEDURE, CREATE VIEW, CREATE SEQUENCE, CREATE TRIGGER TO projekt;
GRANT ALL PRIVILEGES TO projekt;

-- Usuwanie tabel i sekwencji - reset od zera
DROP TABLE LeaveApplicationsActions CASCADE CONSTRAINTS;
DROP TABLE LeaveApplications CASCADE CONSTRAINTS;
DROP TABLE LeaveApplicationsStatuses CASCADE CONSTRAINTS;
DROP TABLE LeaveTypes CASCADE CONSTRAINTS;
DROP TABLE EmployeesRelations CASCADE CONSTRAINTS;
DROP TABLE Employees CASCADE CONSTRAINTS;
DROP TABLE Users CASCADE CONSTRAINTS;

DROP SEQUENCE users_seq;
DROP SEQUENCE employees_seq;
DROP SEQUENCE employees_relations_seq;
DROP SEQUENCE leave_applications_seq;
DROP SEQUENCE leave_applications_actions_seq;

-- Do rozbudowania mogą być typy przełożonych (główny, niegłówny). Mogą być też zastępstwa dodane.
CREATE TABLE Users (
  id INT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(100),
  password VARCHAR(100) NOT NULL,
  user_type CHAR(1) NOT NULL
    CONSTRAINT user_types CHECK (user_type IN ('S', 'N')) -- Serwisowy / Normal
);

CREATE TABLE Employees (
  id INT PRIMARY KEY,
  user_id INT,
  employee_type CHAR(1) NOT NULL,
  CONSTRAINT employee_types CHECK (employee_type IN ('A', 'N')), -- Administrator / Normal
  CONSTRAINT fk_employees_users FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE EmployeesRelations (
  id INT PRIMARY KEY,
  subordinate_id INT NOT NULL,
  manager_id INT NOT NULL,
  CONSTRAINT fk_subordinate_employee
    FOREIGN KEY (subordinate_id)
    REFERENCES Employees(id),
   CONSTRAINT fk_manager_employee
    FOREIGN KEY (manager_id)
    REFERENCES Employees(id),
   CONSTRAINT unique_subordinate_manager UNIQUE (subordinate_id, manager_id)
);

CREATE TABLE LeaveTypes (
  id INT PRIMARY KEY,
--  icon
--  color
  caption VARCHAR(50),
  code VARCHAR(10)
);

CREATE TABLE LeaveApplicationsStatuses (
  id INT PRIMARY KEY,
  is_initial NUMBER(1),
  name VARCHAR(50),
  code VARCHAR(10)
);

-- Wnioske przypisany jest do przełożonego
CREATE TABLE LeaveApplications (
  id INT PRIMARY KEY,
  employee_id INT NOT NULL,
  submission_date DATE DEFAULT SYSDATE NOT NULL,
  start_date DATE,
  end_date DATE,
  status_id INT NOT NULL,
  description VARCHAR(300),
  CONSTRAINT fk_employee_leave FOREIGN KEY (employee_id) REFERENCES Employees(id),
  CONSTRAINT fk_status_leave FOREIGN KEY (status_id) REFERENCES LeaveApplicationsStatuses(id)
);

CREATE TABLE LeaveApplicationsActions (
  id INT PRIMARY KEY,
  source_status_id INT NOT NULL,
  destination_status_id INT NOT NULL,
  name VARCHAR(50),
  color VARCHAR(50),
  action_index INT,  -- Określa kolejność
  description VARCHAR(300),
  availability_role VARCHAR(50) NOT NULL  -- Rola, która może wykonać akcję
    CONSTRAINT chk_availability_role CHECK (availability_role IN ('ALL', 'OWNER', 'ASSIGNEE')),
  CONSTRAINT fk_source_status FOREIGN KEY (source_status_id) REFERENCES LeaveApplicationsStatuses(id),
  CONSTRAINT fk_destination_status FOREIGN KEY (destination_status_id) REFERENCES LeaveApplicationsStatuses(id)
);

CREATE SEQUENCE users_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE employees_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE employees_relations_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE leave_applications_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE leave_applications_actions_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE leave_types_seq START WITH 1 INCREMENT BY 1;

-- Feedujemy podstawowe dane
INSERT INTO Users (id, first_name, last_name, email, password, user_type) VALUES (users_seq.NEXTVAL, 'Adam', 'Kowalski', 'adam.kowalski@example.com', 'password123', 'N');
INSERT INTO Users (id, first_name, last_name, email, password, user_type) VALUES (users_seq.NEXTVAL, 'Ewa', 'Nowak', 'ewa.nowak@example.com', 'password123', 'N');
INSERT INTO Users (id, first_name, last_name, email, password, user_type) VALUES (users_seq.NEXTVAL, 'Piotr', 'Wiśniewski', 'piotr.wisniewski@example.com', 'password123', 'N');
INSERT INTO Users (id, first_name, last_name, email, password, user_type) VALUES (users_seq.NEXTVAL, 'Jan', 'Kaczmarek', 'jan.kaczmarek@example.com', 'password123', 'N');
INSERT INTO Users (id, first_name, last_name, email, password, user_type) VALUES (users_seq.NEXTVAL, 'Serwis', 'User', 'serwis@example.com', 'password123', 'S');
       
INSERT INTO Employees (id, user_id, employee_type) VALUES (employees_seq.NEXTVAL, 1, 'N');
INSERT INTO Employees (id, user_id, employee_type) VALUES (employees_seq.NEXTVAL, 2, 'N');
INSERT INTO Employees (id, user_id, employee_type) VALUES (employees_seq.NEXTVAL, 3, 'N');
INSERT INTO Employees (id, user_id, employee_type) VALUES (employees_seq.NEXTVAL, 4, 'A');
       
INSERT INTO EmployeesRelations (id, subordinate_id, manager_id) VALUES (employees_relations_seq.NEXTVAL, 1, 2);
INSERT INTO EmployeesRelations (id, subordinate_id, manager_id) VALUES (employees_relations_seq.NEXTVAL, 2, 3);
INSERT INTO EmployeesRelations (id, subordinate_id, manager_id) VALUES (employees_relations_seq.NEXTVAL, 3, 4);
INSERT INTO EmployeesRelations (id, subordinate_id, manager_id) VALUES (employees_relations_seq.NEXTVAL, 2, 4);

INSERT INTO LeaveTypes (id, caption, code) VALUES (leave_types_seq.NEXTVAL, 'Urlop wypoczynkowy', 'WYP');
INSERT INTO LeaveTypes (id, caption, code) VALUES (leave_types_seq.NEXTVAL, 'Urlop na żądanie', 'ŻĄD');
INSERT INTO LeaveTypes (id, caption, code) VALUES (leave_types_seq.NEXTVAL, 'Urlop opiekuńczy', 'OPI');

INSERT INTO LeaveApplicationsStatuses (id, is_initial, name, code) VALUES (1, 1, 'Nowy', 'NOWY');
INSERT INTO LeaveApplicationsStatuses (id, is_initial, name, code) VALUES (2, 0, 'Złożony', 'ZŁOŻ');
INSERT INTO LeaveApplicationsStatuses (id, is_initial, name, code) VALUES (3, 0, 'Odrzucony', 'ODRZ');
INSERT INTO LeaveApplicationsStatuses (id, is_initial, name, code) VALUES (4, 0, 'Zaakceptowany', 'AKC');
INSERT INTO LeaveApplicationsStatuses (id, is_initial, name, code) VALUES (5, 0, 'Anulowany', 'ANU');

INSERT INTO LeaveApplicationsActions (id, source_status_id, destination_status_id, availability_role, name, color, action_index, description)
VALUES (4, 1, 2, 'ALL', 'Złóż wniosek', 'blue', 1, 'Pracownik składa wniosek urlopowy.');
INSERT INTO LeaveApplicationsActions (id, source_status_id, destination_status_id, availability_role, name, color, action_index, description)
VALUES (1, 2, 4, 'ASSIGNEE', 'Zatwierdź wniosek', 'green', 1, 'Przełożony zatwierdza wniosek urlopowy.');
INSERT INTO LeaveApplicationsActions (id, source_status_id, destination_status_id, availability_role, name, color, action_index, description)
VALUES (2, 2, 3, 'ASSIGNEE', 'Odrzuć wniosek', 'red', 2, 'Przełożony odrzuca wniosek urlopowy.');
INSERT INTO LeaveApplicationsActions (id, source_status_id, destination_status_id, availability_role, name, color, action_index, description)
VALUES (3, 2, 5, 'OWNER', 'Anuluj wniosek', 'gray', 3, 'Pracownik anuluje wniosek urlopowy.');


