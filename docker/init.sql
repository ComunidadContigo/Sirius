CREATE TABLE buddy
(
  availability VARCHAR(100) NOT NULL,
  isActive INT NOT NULL,
  b_id SERIAL PRIMARY KEY,
  buddy_rating_avg FLOAT NOT NULL,
  last_location VARCHAR(100) NOT NULL
  
);

CREATE TABLE requester
(
  scheduled_request DATE NOT NULL,
  r_id SERIAL PRIMARY KEY,
  requester_rating_avg FLOAT NOT NULL
);

CREATE TABLE request
(
  request_date DATE NOT NULL,
  isFulfilled INT NOT NULL,
  request_meeting_point VARCHAR(100) NOT NULL,
  isUrgent INT NOT NULL,
  request_destination VARCHAR(100) NOT NULL,
  rq_id SERIAL PRIMARY KEY
);

CREATE TABLE feedback
(
  request_rating INT NOT NULL,
  buddy_rating INT NOT NULL,
  requester_rating INT NOT NULL,
  buddy_review INT NOT NULL,
  request_review INT NOT NULL,
  requester_review INT NOT NULL,
  rq_id INT NOT NULL,
  FOREIGN KEY (rq_id) REFERENCES request(rq_id)
);

CREATE TABLE makes
(
  r_id INT NOT NULL,
  rq_id INT NOT NULL,
  PRIMARY KEY (r_id, rq_id),
  FOREIGN KEY (r_id) REFERENCES requester(r_id),
  FOREIGN KEY (rq_id) REFERENCES request(rq_id)
);

CREATE TABLE responds
(
  isAccepted INT NOT NULL,
  b_id INT NOT NULL,
  rq_id INT NOT NULL,
  PRIMARY KEY (b_id, rq_id),
  FOREIGN KEY (b_id) REFERENCES buddy(b_id),
  FOREIGN KEY (rq_id) REFERENCES request(rq_id)
);

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
  longitude VARCHAR(25) NOT NULL,
  latitude VARCHAR(25) NOT NULL,
  isVetted BOOLEAN NOT NULL,
  b_id INT,
  r_id INT,
  FOREIGN KEY (b_id) REFERENCES buddy(b_id),
  FOREIGN KEY (r_id) REFERENCES requester(r_id),
  UNIQUE (email),
  UNIQUE (phone_number)
);


CREATE TABLE refreshtoken
(
  token VARCHAR(512) NOT NULL,
  u_id INT NOT NULL,
  FOREIGN KEY (u_id) REFERENCES "user"(u_id)
);
