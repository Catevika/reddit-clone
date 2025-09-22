-- Insert sample users
INSERT INTO users (id, name, image) VALUES
    (gen_random_uuid(), 'u/AliceJohnson', NULL),
    (gen_random_uuid(), 'u/MichaelSmith', NULL),
    (gen_random_uuid(), 'u/EmmaDavis', NULL),
    (gen_random_uuid(), 'u/DanielMartinez', NULL),
    (gen_random_uuid(), 'u/SophiaWilson', NULL);

-- Insert sample groups
INSERT INTO groups (id, name, image) VALUES
    (gen_random_uuid(), 'r/FrontendDevelopers', 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/11.png'),
    (gen_random_uuid(), 'r/ReactEnthusiasts', 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/10.png'),
    (gen_random_uuid(), 'r/WebDevelopers', 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/9.png'),
    (gen_random_uuid(), 'r/JSDevelopers', 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/8.png'),
    (gen_random_uuid(), 'r/AIInnovators', 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/7.png'),
    (gen_random_uuid(), 'r/TypeScriptCommunity', 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/6.png'),
    (gen_random_uuid(), 'r/ReactJS', 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/5.jpg'),
    (gen_random_uuid(), 'r/ServerlessTech', 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/4.jpg'),
    (gen_random_uuid(), 'r/WebAccessibility', 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/3.jpg'),
    (gen_random_uuid(), 'r/PWADevs', 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/2.jpg');

-- Insert sample posts
INSERT INTO posts (id, title, created_at, description, image, user_id, group_id) VALUES
    (gen_random_uuid(), 'Why React Native is the best?', '2025-02-12T08:30:00Z', 'Lorem ipsum dolor sit amet...', 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/3.jpg', (SELECT id FROM users LIMIT 1 OFFSET 0), (SELECT id FROM groups LIMIT 1 OFFSET 0)),
    (gen_random_uuid(), 'Exploring Next.js Features in Depth', '2025-02-11T14:22:00Z', 'Next.js brings powerful features...', NULL, (SELECT id FROM users LIMIT 1 OFFSET 1), (SELECT id FROM groups LIMIT 1 OFFSET 1)),
    (gen_random_uuid(), 'How to Build a Portfolio Website with HTML and CSS', '2025-02-10T09:10:00Z', NULL, 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/8.jpg', (SELECT id FROM users LIMIT 1 OFFSET 2), (SELECT id FROM groups LIMIT 1 OFFSET 2)),
    (gen_random_uuid(), 'Top JavaScript Frameworks to Learn in 2025', '2025-02-09T18:45:00Z', 'In 2025, JavaScript frameworks continue to evolve...', NULL, (SELECT id FROM users LIMIT 1 OFFSET 3), (SELECT id FROM groups LIMIT 1 OFFSET 3)),
    (gen_random_uuid(), 'Understanding the Basics of Machine Learning', '2025-02-08T15:00:00Z', NULL, 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/6.jpg', (SELECT id FROM users LIMIT 1 OFFSET 4), (SELECT id FROM groups LIMIT 1 OFFSET 4)),
    (gen_random_uuid(), 'How to Get Started with TypeScript in 2025', '2025-02-07T16:10:00Z', NULL, 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/1.jpg', (SELECT id FROM users LIMIT 1 OFFSET 4), (SELECT id FROM groups LIMIT 1 OFFSET 2)),
    (gen_random_uuid(), 'A Deep Dive into React Hooks', '2025-02-06T11:00:00Z', 'React Hooks allow you to use state and other features...', NULL, (SELECT id FROM users LIMIT 1 OFFSET 1), (SELECT id FROM groups LIMIT 1 OFFSET 6)),
    (gen_random_uuid(), 'Exploring the World of Serverless Architecture', '2025-02-05T17:30:00Z', 'Serverless architecture is revolutionizing cloud computing...', NULL, (SELECT id FROM users LIMIT 1 OFFSET 2), (SELECT id FROM groups LIMIT 1 OFFSET 7)),
    (gen_random_uuid(), 'Best Practices for Web Accessibility', '2025-02-04T14:40:00Z', 'Web accessibility is crucial for making websites usable...', NULL, (SELECT id FROM users LIMIT 1 OFFSET 3), (SELECT id FROM groups LIMIT 1 OFFSET 8)),
    (gen_random_uuid(), 'The Future of Progressive Web Apps', '2025-02-03T19:20:00Z', NULL, 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/5.jpeg', (SELECT id FROM users LIMIT 1 OFFSET 4), (SELECT id FROM groups LIMIT 1 OFFSET 9));

-- Insert sample comments
INSERT INTO comments (id, created_at, post_id, user_id, parent_id, comment) VALUES
    (gen_random_uuid(), '2025-02-19T12:00:00Z', (SELECT id FROM posts LIMIT 1 OFFSET 0), (SELECT id FROM users LIMIT 1 OFFSET 0), NULL, 'Very nice explanation. Detailed, straight to the point and with valid comparisons!'),
    (gen_random_uuid(), '2025-02-19T12:05:00Z', (SELECT id FROM posts LIMIT 1 OFFSET 0), (SELECT id FROM users LIMIT 1 OFFSET 1), (SELECT id FROM comments LIMIT 1 OFFSET 0), 'Totally agree!'),
    (gen_random_uuid(), '2025-02-19T12:02:00Z', (SELECT id FROM posts LIMIT 1 OFFSET 0), (SELECT id FROM users LIMIT 1 OFFSET 3), NULL, 'Nicely written, keep up the good work!'),
    (gen_random_uuid(), '2025-02-20T10:06:00Z', (SELECT id FROM posts LIMIT 1 OFFSET 0), (SELECT id FROM users LIMIT 1 OFFSET 2), (SELECT id FROM comments LIMIT 1 OFFSET 2), 'Yep, wanted to say exactly the same'),
    (gen_random_uuid(), '2025-02-20T12:08:00Z', (SELECT id FROM posts LIMIT 1 OFFSET 0), (SELECT id FROM users LIMIT 1 OFFSET 3), (SELECT id FROM comments LIMIT 1 OFFSET 3), 'Totally!');

-- Insert sample upvotes
INSERT INTO upvotes (user_id, post_id, created_at) VALUES
    ((SELECT id FROM users LIMIT 1 OFFSET 0), (SELECT id FROM posts LIMIT 1 OFFSET 0), '2025-02-12T09:00:00Z'),
    ((SELECT id FROM users LIMIT 1 OFFSET 1), (SELECT id FROM posts LIMIT 1 OFFSET 1), '2025-02-11T15:00:00Z'),
    ((SELECT id FROM users LIMIT 1 OFFSET 2), (SELECT id FROM posts LIMIT 1 OFFSET 2), '2025-02-10T10:00:00Z'),
    ((SELECT id FROM users LIMIT 1 OFFSET 3), (SELECT id FROM posts LIMIT 1 OFFSET 3), '2025-02-09T19:00:00Z'),
    ((SELECT id FROM users LIMIT 1 OFFSET 4), (SELECT id FROM posts LIMIT 1 OFFSET 4), '2025-02-08T16:00:00Z'),
    ((SELECT id FROM users LIMIT 1 OFFSET 0), (SELECT id FROM posts LIMIT 1 OFFSET 5), '2025-02-07T17:00:00Z'),
    ((SELECT id FROM users LIMIT 1 OFFSET 1), (SELECT id FROM posts LIMIT 1 OFFSET 6), '2025-02-06T12:00:00Z'),
    ((SELECT id FROM users LIMIT 1 OFFSET 2), (SELECT id FROM posts LIMIT 1 OFFSET 7), '2025-02-05T18:00:00Z'),
    ((SELECT id FROM users LIMIT 1 OFFSET 3), (SELECT id FROM posts LIMIT 1 OFFSET 8), '2025-02-04T15:00:00Z'),
    ((SELECT id FROM users LIMIT 1 OFFSET 4), (SELECT id FROM posts LIMIT 1 OFFSET 9), '2025-02-03T20:00:00Z'),
    ((SELECT id FROM users LIMIT 1 OFFSET 2), (SELECT id FROM posts LIMIT 1 OFFSET 4), '2025-02-10T11:00:00Z'),
    ((SELECT id FROM users LIMIT 1 OFFSET 3), (SELECT id FROM posts LIMIT 1 OFFSET 0), '2025-02-09T19:30:00Z'),
    ((SELECT id FROM users LIMIT 1 OFFSET 0), (SELECT id FROM posts LIMIT 1 OFFSET 1), '2025-02-07T16:45:00Z'),
    ((SELECT id FROM users LIMIT 1 OFFSET 1), (SELECT id FROM posts LIMIT 1 OFFSET 3), '2025-02-06T14:10:00Z'),
    ((SELECT id FROM users LIMIT 1 OFFSET 4), (SELECT id FROM posts LIMIT 1 OFFSET 5), '2025-02-05T19:30:00Z'),
    ((SELECT id FROM users LIMIT 1 OFFSET 0), (SELECT id FROM posts LIMIT 1 OFFSET 2), '2025-02-07T17:45:00Z'),
    ((SELECT id FROM users LIMIT 1 OFFSET 1), (SELECT id FROM posts LIMIT 1 OFFSET 8), '2025-02-06T12:10:00Z'),
    ((SELECT id FROM users LIMIT 1 OFFSET 2), (SELECT id FROM posts LIMIT 1 OFFSET 6), '2025-02-05T18:30:00Z'),
    ((SELECT id FROM users LIMIT 1 OFFSET 3), (SELECT id FROM posts LIMIT 1 OFFSET 9), '2025-02-04T15:20:00Z'),
    ((SELECT id FROM users LIMIT 1 OFFSET 4), (SELECT id FROM posts LIMIT 1 OFFSET 7), '2025-02-03T20:25:00Z');
