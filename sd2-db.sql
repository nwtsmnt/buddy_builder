-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Mar 20, 2025 at 12:10 AM
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
(3, 4, 4, 'I am even afraid to see what\'s gonna happen in 5 years :D', '2025-03-19 23:43:31');

-- --------------------------------------------------------

--
-- Table structure for table `Posts`
--

CREATE TABLE `Posts` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Posts`
--

INSERT INTO `Posts` (`id`, `title`, `content`, `image`, `user_id`, `created_at`) VALUES
(3, 'Tech News', 'Tech is advancing fast with AI breakthroughs, quantum computing, and 6G development. Cloud computing, cybersecurity, and the metaverse are reshaping industries. Companies like Apple, Google, and Tesla drive innovation, while startups push new frontiers in emerging technologies.', '/uploads/tech_news.jpg', 1, '2025-03-17 15:18:36'),
(4, 'Cybersecurity Trends', 'Cybersecurity is evolving with AI-driven threat detection, zero-trust models, and quantum encryption. Ransomware attacks and supply chain vulnerabilities remain key risks. Organizations prioritize cloud security and regulatory compliance to combat emerging cyber threats.', '/uploads/cyber_trends.png', 3, '2025-03-17 16:00:00'),
(5, 'Artificial Intelligence Breakthroughs', 'AI is advancing fast with breakthroughs in generative models, robotics, and autonomous systems. GPT models, AI-driven healthcare, and self-learning algorithms are revolutionizing industries. Ethical AI and regulations are key focuses as AI shapes the future of technology. ', '/uploads/ai.jpg', 4, '2025-03-17 16:10:00'),
(6, 'Gaming Industry Updates', 'The gaming industry is evolving rapidly with new releases, AI-driven innovations, and cloud gaming expansions. Companies like Sony, Microsoft, and Tencent push boundaries, while indie studios thrive. Esports and VR continue to grow, shaping the future of interactive entertainment', '/uploads/gaming_news.jpg', 5, '2025-03-17 16:20:00'),
(7, 'Health and Wellness Tips', 'Prioritize sleep, stay hydrated, eat nutritious foods, and exercise regularly. Manage stress with mindfulness and deep breathing. Maintain social connections and take breaks for mental well-being. Small, consistent habits lead to a healthier, happier life! ', '/uploads/well_tips.jpg', 2, '2025-03-17 16:30:00'),
(8, 'Space Exploration', 'Space exploration pushes the boundaries of human knowledge, leading to technological advancements and deeper understanding of the universe. From the Moon landing to Mars rovers and deep-space probes, it fuels innovation, inspires curiosity, and shapes the future of humanity', '/uploads/space.jpg', 1, '2025-03-17 16:40:00');

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
(5, 'Roma', 'roma@gmail.com', '123123', '2025-03-18 10:36:42', '2008-05-21', '/images/avatars/Roma.jpg', '/images/avatars/banner_boris.jpg', 'I am Donald, a dedicated teacher from Pakistan specializing in secondary education. My focus is on inspiring students to achieve academic excellence while nurturing their creativity and critical thinking. I am committed to developing engaging lesson plans and adopting innovative teaching methodologies to enhance student learning and participation.', 'Curriculum design; Interactive and technology-driven teaching; Student mentoring; Educational psychology', 'Creative arts; Literature and reading; Historical exploration; Community involvement; Communication and interpersonal skills', 'I am a passionate educator based in Pakistan, deeply invested in the intellectual and personal growth of my students. With several years of teaching experience, my approach blends traditional methods with interactive and technology-driven techniques. I enjoy creating supportive classroom environments that encourage student expression and curiosity. Outside the classroom, I am enthusiastic about community service, reading educational literature, and exploring historical sites.');

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Posts`
--
ALTER TABLE `Posts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
-- Constraints for table `Posts`
--
ALTER TABLE `Posts`
  ADD CONSTRAINT `fk_user_posts` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
