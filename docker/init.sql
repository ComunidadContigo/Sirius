CREATE TABLE "user"
(
  email VARCHAR(100) NOT NULL,
  password VARCHAR(200) NOT NULL,
  phone_number VARCHAR(15) NOT NULL,
  birth_date DATE NOT NULL,
  first_name VARCHAR(25) NOT NULL,
  last_name VARCHAR(25) NOT NULL,
  gender VARCHAR(30) NOT NULL,
  u_id SERIAL PRIMARY KEY,
  picture VARCHAR(512),
  user_last_location VARCHAR(100),
  UNIQUE (email),
  UNIQUE (phone_number)
);

CREATE TABLE vetting(
  u_id INT NOT NULL,
  is_vetted BOOLEAN NOT NULL,
  buddify BOOLEAN NOT NULL,
  FOREIGN KEY (u_id) REFERENCES "user"(u_id),
  PRIMARY KEY (u_id)
);

CREATE TABLE buddy
(
  b_id SERIAL PRIMARY KEY,
  buddy_rating_avg FLOAT NOT NULL,
  is_active BOOLEAN,
  u_id INT NOT NULL,
  FOREIGN KEY (u_id) REFERENCES "user"(u_id)
);

CREATE TABLE requester
(
  r_id SERIAL PRIMARY KEY,
  requester_rating_avg FLOAT NOT NULL,
  u_id INT NOT NULL,
  FOREIGN KEY (u_id) REFERENCES "user"(u_id)
);

CREATE TABLE request
(
  request_date VARCHAR(100) NOT NULL,
  request_meeting_point VARCHAR(100) NOT NULL,
  request_destination VARCHAR(100) NOT NULL,
  stat VARCHAR(100) NOT NULL,
  r_id INT NOT NULL,
  b_id INT,
  rq_id SERIAL PRIMARY KEY,
  FOREIGN KEY (r_id) REFERENCES requester(r_id),
  FOREIGN KEY (b_id) REFERENCES buddy(b_id)
);

CREATE TABLE feedback
(
  request_rating INT,
  buddy_rating INT,
  requester_rating INT,
  buddy_review INT NOT NULL,
  request_review INT NOT NULL,
  requester_review INT NOT NULL,
  rq_id INT NOT NULL,
  FOREIGN KEY (rq_id) REFERENCES request(rq_id)
);



CREATE TABLE refreshtoken
(
  token VARCHAR(512) NOT NULL,
  u_id INT NOT NULL,
  expo_push_token VARCHAR(512),
  FOREIGN KEY (u_id) REFERENCES "user"(u_id)
);
