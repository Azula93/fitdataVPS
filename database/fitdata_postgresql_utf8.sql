BEGIN;

-- Table structure for table `users`
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  nombreUsuario VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  pass VARCHAR(255) NOT NULL
);

-- Dumping data for table `users`
INSERT INTO users (id, nombreUsuario, email, pass) VALUES
(6, 'admin', 'admin@admin.com', '$2a$10$08SoKtkFvfjES.E185GqAuOEWveCEbmo/EveiVDO9oUbkjth6mK/y'),
(7, 'azula', 'azula@azula.com', '$2a$10$wUh3xoVmjbynljnXH8BJge1LvhHOJzjIf0MiXWnXTk6KUMdSGRqNm');

-- Table structure for table `user_data`
CREATE TABLE user_data (
  user_id INT PRIMARY KEY,
  imc VARCHAR(255) DEFAULT NULL,
  icc VARCHAR(255) DEFAULT NULL,
  gasto_energetico VARCHAR(255) DEFAULT NULL,
  macro VARCHAR(255) DEFAULT NULL,
  vo2 VARCHAR(255) DEFAULT NULL,
  mets VARCHAR(255) DEFAULT NULL,
  expect_vida VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT current_timestamp,
  updated_at TIMESTAMPTZ DEFAULT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Dumping data for table `user_data`
INSERT INTO user_data (user_id, imc, icc, gasto_energetico, macro, vo2, mets, expect_vida, created_at, updated_at) VALUES
(6, '24.03 PESO NORMAL', '0.67 SIN RIESGO CARDIOVASCULAR', '1654 kcal', 'Carbohidratos 248 gr Proteínas 103 gr Grasas 28 gr', '31 ml/kg/min', '8', '62 años.', '2024-08-13 02:40:55', NULL),
(7, NULL, NULL, '1712 kcal', NULL, NULL, NULL, NULL, '2024-08-13 02:43:10', NULL);

COMMIT;