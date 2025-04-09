-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Apr 09, 2025 at 06:33 PM
-- Server version: 9.2.0
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sd2-db`
--

-- --------------------------------------------------------

--
-- Table structure for table `Comments`
--

CREATE TABLE `Comments` (
  `id` int NOT NULL,
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `comment` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Comments`
--

INSERT INTO `Comments` (`id`, `post_id`, `user_id`, `comment`, `created_at`) VALUES
(1, 8, 5, 'Nice!', '2025-03-19 23:36:08'),
(2, 6, 3, 'Love  it ! Thanks <3', '2025-03-19 23:41:12'),
(3, 4, 4, 'I am even afraid to see what\'s gonna happen in 5 years :D', '2025-03-19 23:43:31'),
(4, 14, 1, 'hetewhwe', '2025-04-03 13:52:59'),
(5, 12, 1, 'now this is what im talking about', '2025-04-03 13:53:18'),
(6, 15, 1, 'this is my favourite delivery service', '2025-04-03 13:54:19'),
(7, 15, 1, 'me too', '2025-04-03 14:08:38');

-- --------------------------------------------------------

--
-- Table structure for table `Connections`
--

CREATE TABLE `Connections` (
  `id` int NOT NULL,
  `requester_id` int NOT NULL,
  `recipient_id` int NOT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Connections`
--

INSERT INTO `Connections` (`id`, `requester_id`, `recipient_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 'pending', '2025-04-09 18:22:32', '2025-04-09 18:22:32'),
(2, 1, 6, 'accepted', '2025-04-09 18:22:42', '2025-04-09 18:25:53'),
(3, 3, 1, 'accepted', '2025-04-09 18:27:00', '2025-04-09 18:27:24'),
(4, 1, 4, 'pending', '2025-04-09 18:31:18', '2025-04-09 18:31:18');

-- --------------------------------------------------------

--
-- Table structure for table `ConversationMembers`
--

CREATE TABLE `ConversationMembers` (
  `id` int NOT NULL,
  `conversation_id` int NOT NULL,
  `user_id` int NOT NULL,
  `joined_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `role` varchar(50) DEFAULT 'member'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Conversations`
--

CREATE TABLE `Conversations` (
  `id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `created_by` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_group` tinyint(1) NOT NULL DEFAULT '0',
  `avatar_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Messages`
--

CREATE TABLE `Messages` (
  `id` int NOT NULL,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_system_message` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Messages`
--

INSERT INTO `Messages` (`id`, `sender_id`, `receiver_id`, `message`, `created_at`, `is_system_message`) VALUES
(13, 1, 2, 'Conversation started', '2025-04-07 02:28:55', 1),
(14, 1, 2, 'hello', '2025-04-07 02:29:02', 0),
(15, 1, 2, 'why is it being printed like this', '2025-04-07 02:29:18', 0),
(16, 1, 2, 'okay never mind', '2025-04-07 02:29:25', 0),
(17, 2, 1, 'wow i can chat here really???', '2025-04-07 02:32:33', 0),
(18, 2, 1, 'hello', '2025-04-07 02:32:59', 0),
(19, 1, 3, 'Conversation started', '2025-04-07 02:41:22', 1),
(20, 1, 2, 'hel', '2025-04-07 02:41:57', 0),
(21, 1, 3, 'hello', '2025-04-07 02:44:47', 0),
(22, 1, 2, 'yes, yes you can', '2025-04-07 02:58:34', 0),
(23, 1, 2, 'hmmm', '2025-04-07 02:58:47', 0),
(24, 1, 2, 'hi', '2025-04-07 03:11:43', 0),
(25, 1, 2, 'hellllo', '2025-04-07 03:11:53', 0),
(26, 1, 2, 'ewrghiwhguwiivgwigqwi', '2025-04-07 03:12:15', 0),
(27, 1, 2, 'h', '2025-04-07 03:12:30', 0),
(28, 1, 2, 'h', '2025-04-07 03:12:30', 0),
(29, 1, 2, 'h', '2025-04-07 03:12:31', 0),
(30, 1, 2, 'h', '2025-04-07 03:12:31', 0),
(31, 1, 2, 'h', '2025-04-07 03:12:31', 0),
(32, 1, 2, 'h', '2025-04-07 03:12:31', 0),
(33, 1, 2, 'h', '2025-04-07 03:12:32', 0),
(34, 1, 2, 'hi', '2025-04-07 03:19:36', 0),
(35, 1, 2, 'is it fixed?', '2025-04-07 03:23:40', 0),
(36, 1, 2, 'yayyyyyyy', '2025-04-07 03:23:46', 0),
(37, 2, 1, 'goddamn', '2025-04-07 03:33:24', 0),
(38, 2, 1, 'oh no', '2025-04-07 03:33:51', 0),
(39, 2, 1, 'test', '2025-04-07 03:37:17', 0),
(40, 1, 2, 'hi', '2025-04-07 03:58:06', 0),
(41, 1, 3, 'hgv', '2025-04-09 18:07:42', 0);

-- --------------------------------------------------------

--
-- Table structure for table `Posts`
--

CREATE TABLE `Posts` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `category` enum('question','discussion','resource','event') NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Posts`
--

INSERT INTO `Posts` (`id`, `title`, `content`, `category`, `image`, `user_id`, `created_at`) VALUES
(3, 'Tech News', 'Tech is advancing fast with AI breakthroughs, quantum computing, and 6G development. Cloud computing, cybersecurity, and the metaverse are reshaping industries. Companies like Apple, Google, and Tesla drive innovation, while startups push new frontiers in emerging technologies.', 'resource', '/uploads/tech_news.jpg', 1, '2025-03-17 15:18:36'),
(4, 'Cybersecurity Trends', 'Cybersecurity is evolving with AI-driven threat detection, zero-trust models, and quantum encryption. Ransomware attacks and supply chain vulnerabilities remain key risks. Organizations prioritize cloud security and regulatory compliance to combat emerging cyber threats.', 'resource', '/uploads/cyber_trends.png', 3, '2025-03-17 16:00:00'),
(5, 'Artificial Intelligence Breakthroughs', 'AI is advancing fast with breakthroughs in generative models, robotics, and autonomous systems. GPT models, AI-driven healthcare, and self-learning algorithms are revolutionizing industries. Ethical AI and regulations are key focuses as AI shapes the future of technology. ', 'resource', '/uploads/ai.jpg', 4, '2025-03-17 16:10:00'),
(6, 'Gaming Industry Updates', 'The gaming industry is evolving rapidly with new releases, AI-driven innovations, and cloud gaming expansions. Companies like Sony, Microsoft, and Tencent push boundaries, while indie studios thrive. Esports and VR continue to grow, shaping the future of interactive entertainment', 'resource', '/uploads/gaming_news.jpg', 5, '2025-03-17 16:20:00'),
(7, 'Health and Wellness Tips', 'Prioritize sleep, stay hydrated, eat nutritious foods, and exercise regularly. Manage stress with mindfulness and deep breathing. Maintain social connections and take breaks for mental well-being. Small, consistent habits lead to a healthier, happier life! ', 'resource', '/uploads/well_tips.jpg', 2, '2025-03-17 16:30:00'),
(8, 'Space Exploration', 'Space exploration pushes the boundaries of human knowledge, leading to technological advancements and deeper understanding of the universe. From the Moon landing to Mars rovers and deep-space probes, it fuels innovation, inspires curiosity, and shapes the future of humanity', 'resource', '/uploads/space.jpg', 1, '2025-03-17 16:40:00'),
(12, 'myu favourite anime', 'this is my fav', 'resource', '/uploads/attachments-1743641114489-29234548.jpg', 1, '2025-04-03 00:45:14'),
(14, 'Englsnf', '234', 'discussion', '/uploads/attachments-1743682934484-99440974.png', 1, '2025-04-03 12:22:14'),
(15, 'amazon', 'this is amazon', 'resource', '/uploads/attachments-1743688445888-147011289.jpg', 1, '2025-04-03 13:54:06');

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `id` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `dob` date NOT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `banner_url` varchar(255) DEFAULT NULL,
  `details` text,
  `interests` text,
  `skills` text,
  `bio` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`id`, `name`, `email`, `password`, `created_at`, `dob`, `avatar_url`, `banner_url`, `details`, `interests`, `skills`, `bio`) VALUES
(1, 'Boris', 'a@icloud.com', 'Boris', '2025-03-17 11:36:38', '1212-12-12', '/images/avatars/Boris.jpg', '/images/avatars/banner_boris.jpg', 'I am dedicated and experienced educator based in Turkey, specializing in teaching Physics and Artificial Intelligence. With over 15 years in education, Boris combines traditional physics concepts with modern AI techniques to inspire and engage his students. He is actively involved in developing innovative curricula that integrate AI-driven simulations and robotics into physics education, making complex scientific theories more accessible and exciting.', 'Artificial Intelligence (AI), Robotics, Hiking and Outdoor Adventures, Chess and Strategic Games, Quantum Computing, Educational Technology, Astronomy and Astrophysics', 'Python Programming ,Node.js Development, Data Structures and Algorithms, Machine Learning, Robotics Programming, Physics Simulations, Curriculum Development, Public Speaking and Communication', 'I am passionate, 42-year-old teacher from Turkey who remains single and devoted to continuous learning and personal growth. Outside the classroom, he enjoys deepening his expertise in artificial intelligence, particularly in machine learning applications related to physics and robotics. Boris finds great joy in outdoor adventures, often spending weekends hiking in nature to recharge and gain fresh insights. He is also an avid chess player who appreciates strategic thinking, a skill he enthusiastically fosters among his students.'),
(2, 'Alex', 'alex@gmail.com', 'alex', '2025-03-17 11:38:19', '1233-03-12', '/images/avatars/Alex.jpg', '/images/avatars/banner_boris.jpg', 'I am enthusiastic university student from Germany, majoring in Modern and Classical Languages. Passionate about linguistics, Alex specialises in exploring the historical and cultural contexts behind various languages, particularly Latin, Ancient Greek, and Romance languages.', 'Ancient Rome and Classical Antiquity ; \r\n Philosophy and Ethics ; Historical Linguistics; Cultural History ; Literature and Poetry ;', 'Translation and Interpretation, Linguistic Analysis, Research and Academic Writing, Critical Thinking and Analysis, Public Speaking and Debate, Cultural Awareness and Communication', '22-year-old single student from Germany, deeply fascinated by history, literature, and philosophical thought.  Spends his time not only mastering multiple languages but also engaging in rich discussions about philosophy and cultural history. An avid traveler, I enjoy visiting historical sites, especially those related to Ancient Rome, enhancing his studies with real-world experiences. When not immersed in books, he appreciates quiet cafes, classical music, and thought-provoking debates.'),
(3, 'Hanna', 'game2@gmail.com', '123123', '2025-03-17 12:43:58', '1992-02-09', '/images/avatars/Hanna.jpg', '/images/avatars/banner_boris.jpg', 'I am Hanna, a dedicated university student from Poland, balancing my academic studies with a professional gaming career. Specializing in competitive gaming, I actively participate in international eSports tournaments, representing Poland in major gaming leagues. I am passionate about pushing the boundaries of strategic thinking and teamwork within the digital arena.', 'Competitive eSports\n\nGaming strategy development\n\nAnime and manga culture\n\nFitness and health\n\nTechnology and innovation\n\nTraveling and exploring different cultures\n\nStreaming and content creation', 'Expert-level skills in FPS and MOBA games\n\nTeam leadership and strategic coordination\n\nGame streaming and commentary\n\nSocial media and community engagement\n\nAnalytical thinking and quick decision-making\n\nProficiency in English and Polish\n\nAdaptability and resilience in competitive environments', 'I am a 21-year-old student and professional gamer from Poland. Single and committed to personal excellence, I split my time between rigorous academic coursework and intensive gaming practice. Gaming isn\'t just my profession—it\'s my passion. When not competing, I enjoy streaming, connecting with the gaming community, and mentoring new players. To relax, I immerse myself in anime, fitness activities, and exploring new cities during travel.'),
(4, 'Lola', '123@hotmail.com', '123', '2025-03-17 19:24:06', '1212-12-12', '/images/avatars/Lola.jpg', '/images/avatars/banner_boris.jpg', 'I am Lola, a professor from Pakistan, specializing in interdisciplinary studies and higher education. My academic career is dedicated to inspiring critical thinking, fostering innovation, and promoting research excellence. I actively participate in international conferences, publish scholarly articles, and mentor graduate students in their research projects.', 'Higher education teaching; Research and scholarly writing; Interdisciplinary collaboration; Critical thinking and analysis;', 'International academic networking; Mentoring and student guidance; Literature and arts; Travel and cultural exploration; Public speaking and academic presentations', 'I am a passionate educator and researcher based in Pakistan. With years of experience in academia, I am committed to academic rigor and nurturing intellectual curiosity among my students. Beyond teaching, I enjoy collaborating on international research projects and engaging with academic communities globally. In my personal time, I appreciate literature, art, and traveling to learn from diverse cultures.'),
(5, 'Roma', 'roma@gmail.com', '123123', '2025-03-18 10:36:42', '2008-05-21', '/images/avatars/Roma.jpg', '/images/avatars/banner_boris.jpg', 'I am Donald, a dedicated teacher from Pakistan specializing in secondary education. My focus is on inspiring students to achieve academic excellence while nurturing their creativity and critical thinking. I am committed to developing engaging lesson plans and adopting innovative teaching methodologies to enhance student learning and participation.', 'Curriculum design; Interactive and technology-driven teaching; Student mentoring; Educational psychology', 'Creative arts; Literature and reading; Historical exploration; Community involvement; Communication and interpersonal skills', 'I am a passionate educator based in Pakistan, deeply invested in the intellectual and personal growth of my students. With several years of teaching experience, my approach blends traditional methods with interactive and technology-driven techniques. I enjoy creating supportive classroom environments that encourage student expression and curiosity. Outside the classroom, I am enthusiastic about community service, reading educational literature, and exploring historical sites.'),
(6, 'test', 'test@test.com', 'test', '2025-04-09 18:02:27', '2000-12-12', '/uploads/1744221875095-d2403412834440c37a452da96a6c9f95.jpg', NULL, '', '', '', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Comments`
--
ALTER TABLE `Comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `Connections`
--
ALTER TABLE `Connections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_connection` (`requester_id`,`recipient_id`),
  ADD KEY `idx_recipient` (`recipient_id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `ConversationMembers`
--
ALTER TABLE `ConversationMembers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_membership` (`conversation_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `Conversations`
--
ALTER TABLE `Conversations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `Messages`
--
ALTER TABLE `Messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Indexes for table `Posts`
--
ALTER TABLE `Posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_posts` (`user_id`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Comments`
--
ALTER TABLE `Comments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `Connections`
--
ALTER TABLE `Connections`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `ConversationMembers`
--
ALTER TABLE `ConversationMembers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Conversations`
--
ALTER TABLE `Conversations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Messages`
--
ALTER TABLE `Messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `Posts`
--
ALTER TABLE `Posts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Comments`
--
ALTER TABLE `Comments`
  ADD CONSTRAINT `Comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `Posts` (`id`),
  ADD CONSTRAINT `Comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`);

--
-- Constraints for table `Connections`
--
ALTER TABLE `Connections`
  ADD CONSTRAINT `connections_ibfk_1` FOREIGN KEY (`requester_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `connections_ibfk_2` FOREIGN KEY (`recipient_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `ConversationMembers`
--
ALTER TABLE `ConversationMembers`
  ADD CONSTRAINT `conversationmembers_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `Conversations` (`id`),
  ADD CONSTRAINT `conversationmembers_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`);

--
-- Constraints for table `Conversations`
--
ALTER TABLE `Conversations`
  ADD CONSTRAINT `conversations_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `Users` (`id`);

--
-- Constraints for table `Messages`
--
ALTER TABLE `Messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `Users` (`id`),
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `Users` (`id`);

--
-- Constraints for table `Posts`
--
ALTER TABLE `Posts`
  ADD CONSTRAINT `fk_user_posts` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
