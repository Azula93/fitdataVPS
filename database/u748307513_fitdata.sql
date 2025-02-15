-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Feb 09, 2025 at 03:27 PM
-- Server version: 10.11.10-MariaDB
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u748307513_fitdata`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nombreUsuario` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `pass` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nombreUsuario`, `email`, `pass`) VALUES
(6, 'admin', 'admin@admin.com', '$2a$10$08SoKtkFvfjES.E185GqAuOEWveCEbmo/EveiVDO9oUbkjth6mK/y'),
(7, 'azula', 'azula@azula.com', '$2a$10$wUh3xoVmjbynljnXH8BJge1LvhHOJzjIf0MiXWnXTk6KUMdSGRqNm');

-- --------------------------------------------------------

--
-- Table structure for table `user_data`
--

CREATE TABLE `user_data` (
  `user_id` int(11) NOT NULL,
  `imc` varchar(255) DEFAULT NULL,
  `icc` varchar(255) DEFAULT NULL,
  `gasto_energetico` varchar(255) DEFAULT NULL,
  `macro` varchar(255) DEFAULT NULL,
  `vo2` varchar(255) DEFAULT NULL,
  `mets` varchar(255) DEFAULT NULL,
  `expect_vida` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_data`
--

INSERT INTO `user_data` (`user_id`, `imc`, `icc`, `gasto_energetico`, `macro`, `vo2`, `mets`, `expect_vida`, `created_at`, `updated_at`) VALUES
(6, '24.03 PESO NORMAL', '0.67 SIN RIESGO CARDIOVASCULAR', '1654 kcal', 'Carbohidratos 248 gr Proteínas 103 gr Grasas 28 gr', '31 ml/kg/min', '8', '62 años.', '2024-08-13 02:40:55', NULL),
(7, NULL, NULL, '1712 kcal', NULL, NULL, NULL, NULL, '2024-08-13 02:43:10', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_data`
--
ALTER TABLE `user_data`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `user_data`
--
ALTER TABLE `user_data`
  ADD CONSTRAINT `user_data_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
