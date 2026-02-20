BEGIN;

-- Table structure for table `users`
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  nombreUsuario VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  pass VARCHAR(255) NOT NULL
);

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

COMMIT;