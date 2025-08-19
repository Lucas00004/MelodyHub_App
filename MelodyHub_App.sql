-- --------------------------------------------------------
-- Máy chủ:                      127.0.0.1
-- Phiên bản máy chủ:            10.4.32-MariaDB - mariadb.org binary distribution
-- HĐH máy chủ:                  Win64
-- HeidiSQL Phiên bản:           12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for app_melody
CREATE DATABASE IF NOT EXISTS `app_melody` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `app_melody`;

-- Dumping structure for bảng app_melody.artist
CREATE TABLE IF NOT EXISTS `artist` (
  `id_artist` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `gender` enum('Nam','Nữ','Khác') NOT NULL,
  `bio` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_artist`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Đang đổ dữ liệu cho bảng app_melody.artist: ~3 rows (xấp xỉ)
DELETE FROM `artist`;
INSERT INTO `artist` (`id_artist`, `name`, `gender`, `bio`, `image`) VALUES
	(9, 'Billie Eilish', 'Nữ', 'Hát nhạc ma mị và cuốn hút !', NULL),
	(11, 'Van Kha', 'Nữ', 'GAY Bro', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Anonymous.svg/1200px-Anonymous.svg.png');

-- Dumping structure for bảng app_melody.booking
CREATE TABLE IF NOT EXISTS `booking` (
  `id_booking` int(11) NOT NULL AUTO_INCREMENT,
  `id_event` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `booking_date` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_booking`),
  KEY `id_event` (`id_event`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`id_event`) REFERENCES `event` (`id_event`) ON DELETE CASCADE,
  CONSTRAINT `booking_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Đang đổ dữ liệu cho bảng app_melody.booking: ~7 rows (xấp xỉ)
DELETE FROM `booking`;
INSERT INTO `booking` (`id_booking`, `id_event`, `id_user`, `quantity`, `payment_method`, `booking_date`) VALUES
	(3, 10, 28, 1, 'Momo', '2025-08-13 01:18:25'),
	(4, 10, 28, 1, 'Momo', '2025-08-13 01:19:10'),
	(5, 10, 28, 1, 'Momo', '2025-08-13 01:19:20'),
	(6, 10, 28, 1, 'Momo', '2025-08-13 01:22:04'),
	(7, 10, 28, 1, 'Momo', '2025-08-13 01:23:06'),
	(8, 10, 28, 4, 'Bank', '2025-08-13 13:26:22'),
	(22, 10, 28, 1, 'Momo', '2025-08-14 13:25:08'),
	(31, 16, 28, 1, 'Momo', '2025-08-18 17:50:21');

-- Dumping structure for bảng app_melody.category
CREATE TABLE IF NOT EXISTS `category` (
  `id_category` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_category`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Đang đổ dữ liệu cho bảng app_melody.category: ~6 rows (xấp xỉ)
DELETE FROM `category`;
INSERT INTO `category` (`id_category`, `name`, `image`) VALUES
	(1, 'Nhạc Rock', NULL),
	(2, 'K-Pop', 'https://www.shutterstock.com/image-vector/korean-pop-3d-editable-vector-260nw-2484478485.jpg'),
	(3, 'PHONK', 'https://i1.sndcdn.com/artworks-8TPHyl9TJ4u0Xt1z-PFUArQ-t500x500.jpg'),
	(4, 'EDM', NULL),
	(7, 'Bolero Trữ Tình ', NULL);

-- Dumping structure for bảng app_melody.event
CREATE TABLE IF NOT EXISTS `event` (
  `id_event` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `id_venue` int(11) NOT NULL,
  `id_category` int(11) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `ticket_price` int(10) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `seat_left` int(11) DEFAULT 0,
  PRIMARY KEY (`id_event`),
  KEY `id_venue` (`id_venue`),
  KEY `id_category` (`id_category`),
  CONSTRAINT `event_ibfk_1` FOREIGN KEY (`id_venue`) REFERENCES `venue` (`id_venue`) ON DELETE CASCADE,
  CONSTRAINT `event_ibfk_2` FOREIGN KEY (`id_category`) REFERENCES `category` (`id_category`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Đang đổ dữ liệu cho bảng app_melody.event: ~4 rows (xấp xỉ)
DELETE FROM `event`;
INSERT INTO `event` (`id_event`, `name`, `id_venue`, `id_category`, `start_time`, `end_time`, `ticket_price`, `description`, `image`, `seat_left`) VALUES
	(10, 'Sơn Tùng M-TP - Sky Tour 2025', 2, 4, '2025-07-19 09:29:00', '2025-05-13 09:29:00', 1000000, 'Choáy !!', 'https://static2.yan.vn/YanNews/2167221/202507/hanh-trinh-skymeet-tiep-dien-cuoc-hen-11-tai-da-nang-mung-thang-sinh-nhat-son-tung-mtp-a58213ba.jpg', 39991),
	(16, 'Alan Đi Bộ Về VN !!', 4, 4, '2025-07-23 19:01:00', '2025-05-18 19:01:00', 500000, 'Quẩy nhiệt tìnhhhh ', 'https://wallpaperaccess.com/full/3763154.jpg', 3464),
	(24, 'tet', 2, 3, '2025-08-18 17:39:00', '2025-08-18 17:39:00', 35, 'jgh', 'https://bcp.cdnchinhphu.vn/334894974524682240/2024/10/7/z5903476015481a512d3fe73754bcbe84dbef9090c5339-17282983566261359561022.jpg', 40000),
	(25, 'sda', 2, 4, '2025-08-18 17:39:00', '2025-08-18 17:39:00', 55, 'ddg', 'https://bcp.cdnchinhphu.vn/334894974524682240/2024/10/7/z5903476015481a512d3fe73754bcbe84dbef9090c5339-17282983566261359561022.jpg', 40000);

-- Dumping structure for bảng app_melody.event_artist
CREATE TABLE IF NOT EXISTS `event_artist` (
  `id_event_artist` int(11) NOT NULL AUTO_INCREMENT,
  `id_event` int(11) NOT NULL,
  `id_artist` int(11) NOT NULL,
  `role` varchar(255) NOT NULL,
  `performance_order` int(11) NOT NULL,
  PRIMARY KEY (`id_event_artist`),
  KEY `fk_event` (`id_event`),
  KEY `fk_artist` (`id_artist`),
  CONSTRAINT `fk_artist` FOREIGN KEY (`id_artist`) REFERENCES `artist` (`id_artist`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_event` FOREIGN KEY (`id_event`) REFERENCES `event` (`id_event`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Đang đổ dữ liệu cho bảng app_melody.event_artist: ~0 rows (xấp xỉ)
DELETE FROM `event_artist`;

-- Dumping structure for bảng app_melody.favorite
CREATE TABLE IF NOT EXISTS `favorite` (
  `id_favorite` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `id_event` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_favorite`),
  KEY `id_user` (`id_user`),
  KEY `id_event` (`id_event`),
  CONSTRAINT `favorite_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE,
  CONSTRAINT `favorite_ibfk_2` FOREIGN KEY (`id_event`) REFERENCES `event` (`id_event`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Đang đổ dữ liệu cho bảng app_melody.favorite: ~0 rows (xấp xỉ)
DELETE FROM `favorite`;

-- Dumping structure for bảng app_melody.payment
CREATE TABLE IF NOT EXISTS `payment` (
  `id_payment` int(11) NOT NULL AUTO_INCREMENT,
  `id_ticket` int(11) NOT NULL,
  `payment_method` enum('Credit Card','PayPal','Bank Transfer') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_payment`),
  UNIQUE KEY `id_ticket` (`id_ticket`),
  CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`id_ticket`) REFERENCES `ticket` (`id_ticket`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Đang đổ dữ liệu cho bảng app_melody.payment: ~28 rows (xấp xỉ)
DELETE FROM `payment`;
INSERT INTO `payment` (`id_payment`, `id_ticket`, `payment_method`, `amount`, `payment_date`) VALUES
	(1, 2, '', 100000.00, '2025-04-06 19:27:03'),
	(2, 3, '', 100000.00, '2025-04-06 19:38:49'),
	(3, 4, '', 100000.00, '2025-04-06 19:39:25'),
	(4, 5, '', 100000.00, '2025-04-06 19:45:18'),
	(5, 6, '', 100000.00, '2025-04-06 19:46:15'),
	(6, 7, '', 100000.00, '2025-04-06 19:46:31'),
	(7, 8, '', 100000.00, '2025-04-06 19:46:37'),
	(8, 9, '', 100000.00, '2025-04-06 19:49:41'),
	(9, 10, '', 100000.00, '2025-04-06 19:53:56'),
	(10, 11, '', 100000.00, '2025-04-06 19:55:50'),
	(11, 12, '', 100000.00, '2025-04-06 19:56:05'),
	(12, 13, '', 100000.00, '2025-04-06 19:56:58'),
	(13, 14, '', 100000.00, '2025-04-06 19:57:19'),
	(14, 15, '', 100000.00, '2025-04-06 19:57:34'),
	(15, 16, '', 100000.00, '2025-04-06 19:59:12'),
	(16, 17, '', 100000.00, '2025-04-06 20:02:14'),
	(17, 18, '', 100000.00, '2025-04-06 20:03:06'),
	(18, 19, '', 100000.00, '2025-04-06 20:04:19'),
	(19, 20, '', 100000.00, '2025-04-06 20:05:12'),
	(20, 21, '', 100000.00, '2025-04-06 20:05:40'),
	(21, 22, '', 100000.00, '2025-04-06 20:08:11'),
	(22, 23, '', 100000.00, '2025-04-06 20:14:16'),
	(23, 24, '', 100000.00, '2025-04-06 20:14:19'),
	(24, 25, '', 100000.00, '2025-04-06 20:22:04'),
	(25, 26, '', 100000.00, '2025-04-06 20:22:26'),
	(26, 27, '', 100000.00, '2025-04-06 20:25:53'),
	(27, 28, '', 100000.00, '2025-04-06 20:27:53'),
	(28, 29, '', 100000.00, '2025-04-06 20:28:13');

-- Dumping structure for bảng app_melody.review
CREATE TABLE IF NOT EXISTS `review` (
  `id_review` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `id_event` int(11) NOT NULL,
  `rating` int(11) NOT NULL DEFAULT 0,
  `comment` text DEFAULT NULL,
  `review_date` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_review`),
  KEY `id_event` (`id_event`),
  KEY `fk_review_user` (`id_user`),
  CONSTRAINT `fk_review_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`),
  CONSTRAINT `review_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE,
  CONSTRAINT `review_ibfk_2` FOREIGN KEY (`id_event`) REFERENCES `event` (`id_event`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Đang đổ dữ liệu cho bảng app_melody.review: ~3 rows (xấp xỉ)
DELETE FROM `review`;
INSERT INTO `review` (`id_review`, `id_user`, `id_event`, `rating`, `comment`, `review_date`) VALUES
	(15, 25, 10, 2, 'Thực sự thất vọng, tổ chức chưa tốt và âm thanh cần cải thiện.', '2025-04-02 12:00:00'),
	(21, 25, 10, 5, 'Buổi biểu diễn tuyệt vời, rất hài lòng!', '2025-04-05 19:30:00'),
	(24, 25, 10, 1, 'Tổ chức quá tệ, không đáng tiền vé.', '2025-04-08 21:15:00');

-- Dumping structure for bảng app_melody.ticket
CREATE TABLE IF NOT EXISTS `ticket` (
  `id_ticket` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `id_event` int(11) NOT NULL,
  `seat_number` int(11) NOT NULL,
  `purchased_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `quantity` int(11) DEFAULT 1,
  PRIMARY KEY (`id_ticket`),
  KEY `id_user` (`id_user`),
  KEY `id_event` (`id_event`),
  CONSTRAINT `ticket_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE,
  CONSTRAINT `ticket_ibfk_2` FOREIGN KEY (`id_event`) REFERENCES `event` (`id_event`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Đang đổ dữ liệu cho bảng app_melody.ticket: ~0 rows (xấp xỉ)
DELETE FROM `ticket`;

-- Dumping structure for bảng app_melody.user
CREATE TABLE IF NOT EXISTS `user` (
  `id_user` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','client') NOT NULL DEFAULT 'client',
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Đang đổ dữ liệu cho bảng app_melody.user: ~4 rows (xấp xỉ)
DELETE FROM `user`;
INSERT INTO `user` (`id_user`, `username`, `email`, `password`, `role`, `phone`, `created_at`) VALUES
	(25, 'test3', 'ads@mi', '$2b$10$.Z1H7QnXx6HfN3vXbCXaE.FEUO0lGN.FioC/xePUYIvDmY1MovpVS', 'client', NULL, '2025-03-30 03:59:01'),
	(27, 'hoang', 'hoang@mail', '$2b$10$PJwufe3brOBrL72XKmFgB.KC2WWHH0ZrgpsExKr1JfDETEU4MW2tq', 'admin', NULL, '2025-04-17 05:43:59'),
	(28, 'hoang123', 'hoang123@mail.com', '$2b$10$80tN93HHo7sK6NDmeo7Xu.fiZBOwYiNrEnU.E70.ADlW3ubVD2ZRK', 'client', '0988186931', '2025-07-26 07:45:01'),
	(30, 'bot1', 'bot1@gmail.com', '$2b$10$olyssvm6Hby68foKtroAZujX5xtf82CMBT1OeWvwYuYLwcF9U17eq', 'admin', '0846585444', '2025-08-14 08:29:36'),
	(31, 'admin2', 'admin@gmail.com', '$2b$10$6B9BdhXuwQCgAJqM8MbVo.gKP0apbifznvJPLOhY4YwtHRNfg04Vy', 'admin', '088846583', '2025-08-15 09:35:37');

-- Dumping structure for bảng app_melody.venue
CREATE TABLE IF NOT EXISTS `venue` (
  `id_venue` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `capacity` int(11) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_venue`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Đang đổ dữ liệu cho bảng app_melody.venue: ~5 rows (xấp xỉ)
DELETE FROM `venue`;
INSERT INTO `venue` (`id_venue`, `name`, `capacity`, `image`) VALUES
	(2, 'Sân vận động Mỹ Đình', 40000, NULL),
	(4, 'Trung tâm Hội nghị Quốc gia', 3500, 'https://bcp.cdnchinhphu.vn/334894974524682240/2024/10/7/z5903476015481a512d3fe73754bcbe84dbef9090c5339-17282983566261359561022.jpg'),
	(7, 'Nhà Hát Bạc Liêu', 3000, NULL),
	(9, 'Nha hat Ho Guom', 50000, 'https://images2.thanhnien.vn/528068263637045248/2023/7/9/18b-16889213576981578230098.jpg');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
