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
  user_name VARCHAR(25) NOT NULL,
  phone_number VARCHAR(15) NOT NULL,
  birth_date DATE NOT NULL,
  first_name VARCHAR(25) NOT NULL,
  last_name VARCHAR(25) NOT NULL,
  gender VARCHAR(30) NOT NULL,
  u_id SERIAL PRIMARY KEY,
  isVetted INT NOT NULL,
  b_id INT,
  r_id INT,
  FOREIGN KEY (b_id) REFERENCES buddy(b_id),
  FOREIGN KEY (r_id) REFERENCES requester(r_id),
  UNIQUE (email),
  UNIQUE (user_name),
  UNIQUE (phone_number)
);

CREATE TABLE refreshtoken
(
  token VARCHAR(512) NOT NULL,
  u_id INT NOT NULL,
  PRIMARY KEY (u_id),
  FOREIGN KEY (u_id) REFERENCES "user"(u_id)
);

insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('mlearman0@google.es', 'NlDWB7xkM', 'Vagram', '350-913-8736', '12/15/2020', 'Morrie', 'Learman', 'Bigender', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('ebreffitt1@1und1.de', '6xuMrx5', 'Trippledex', '575-123-1713', '2/9/2021', 'Emmott', 'Breffitt', 'Polygender', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('zcorzor2@csmonitor.com', 'p4wBookPS', 'Stronghold', '990-183-0717', '10/11/2020', 'Zane', 'Corzor', 'Bigender', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('ldeclerk3@yale.edu', '4YIbpMrZG', 'Gembucket', '704-996-8243', '11/13/2020', 'Licha', 'de Clerk', 'Non-binary', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('lhitschke4@booking.com', 'QfFVhvMgP8xk', 'Ventosanzap', '230-228-1937', '9/3/2021', 'Laurene', 'Hitschke', 'Agender', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('aodwyer5@merriam-webster.com', 'lbPGxSMTtdzX', 'Solarbreeze', '338-257-7358', '4/23/2021', 'Amara', 'O''Dwyer', 'Polygender', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('ebowne6@ftc.gov', 'jdegq0', 'Tin', '444-182-6732', '8/20/2021', 'Eb', 'Bowne', 'Male', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('cnoore7@webeden.co.uk', 'JHhz67Ml2n5d', 'Alpha', '965-846-2621', '3/16/2021', 'Cloe', 'Noore', 'Non-binary', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('pscarsbrooke8@booking.com', 'V7HYjiszfe2r', 'Pannier', '654-433-3249', '1/31/2021', 'Page', 'Scarsbrooke', 'Female', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('mmaccaffrey9@simplemachines.org', 'ARgxRMk', 'Ventosanzap', '482-187-1862', '1/9/2021', 'Miner', 'MacCaffrey', 'Male', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('gbarnfathera@businesswire.com', 'ijCQ9sn5yU', 'Toughjoyfax', '541-662-1611', '1/5/2021', 'Godart', 'Barnfather', 'Bigender', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('kmatsonb@biglobe.ne.jp', 'BJvU3HIsh', 'Bamity', '243-982-6819', '10/27/2020', 'Kellie', 'Matson', 'Non-binary', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('switherowc@youtube.com', 'EHgga0qKB9', 'Stronghold', '187-229-8603', '5/13/2021', 'Suzy', 'Witherow', 'Bigender', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('jbotterelld@imdb.com', 'L1N3ve', 'Bigtax', '837-360-4787', '3/6/2021', 'Jaclyn', 'Botterell', 'Non-binary', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('imattsone@flickr.com', 'rsQ7CBqU', 'Fix San', '183-266-1240', '10/14/2020', 'Irvin', 'Mattson', 'Female', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('lgoodgef@springer.com', 'ZJcCP4USlBN', 'Namfix', '234-975-3093', '9/20/2021', 'Lanita', 'Goodge', 'Genderqueer', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('astiversg@tinypic.com', 'Lzf76rdNgmb5', 'Span', '412-605-4754', '6/24/2021', 'Anneliese', 'Stivers', 'Female', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('jthornewillh@miitbeian.gov.cn', 'OiQtATIruyGb', 'Zaam-Dox', '789-310-2361', '10/21/2020', 'Janie', 'Thornewill', 'Polygender', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('dkembleyi@about.me', 'GNT5p8r93xI', 'Bamity', '376-232-3435', '11/11/2020', 'Dyann', 'Kembley', 'Genderqueer', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('gebbettsj@discuz.net', 'g3tvu5AfOzVl', 'Bitchip', '951-286-5302', '9/9/2021', 'Georgie', 'Ebbetts', 'Male', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('zcaffink@edublogs.org', 'aHoHpmYftpJ', 'Viva', '485-665-6879', '5/24/2021', 'Zach', 'Caffin', 'Agender', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('ryarhaml@state.gov', 'nb2yZdI', 'Alpha', '532-589-7836', '11/29/2020', 'Roger', 'Yarham', 'Male', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('tschowenburgm@odnoklassniki.ru', 'jMPbvt', 'Toughjoyfax', '116-457-6518', '8/6/2021', 'Timotheus', 'Schowenburg', 'Non-binary', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('fandrosikn@jiathis.com', 'bDLqaDOI', 'Domainer', '398-586-2264', '7/6/2021', 'Freeland', 'Androsik', 'Genderfluid', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('cnannonio@ow.ly', 'K6tP9JT', 'Tempsoft', '821-838-3530', '12/12/2020', 'Casper', 'Nannoni', 'Genderfluid', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('castlattp@csmonitor.com', 'tVGiVi2tu', 'Redhold', '347-864-1551', '2/9/2021', 'Cindie', 'Astlatt', 'Bigender', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('dwassellq@nba.com', 'Cw9jeOo6OSS', 'Stringtough', '511-504-6740', '12/7/2020', 'Donna', 'Wassell', 'Non-binary', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('csproulsr@arstechnica.com', 'LWTNdtp18s', 'Flowdesk', '253-729-7570', '7/14/2021', 'Corinna', 'Sprouls', 'Polygender', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('ojouhans@cbslocal.com', '6HtlFu', 'Zoolab', '199-507-3361', '2/11/2021', 'Osborn', 'Jouhan', 'Polygender', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('rfeviert@nhs.uk', 'oT7wdSIOLUS', 'Konklab', '832-152-3237', '6/26/2021', 'Rafferty', 'Fevier', 'Female', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('thuggettu@indiatimes.com', 'JCHH02o', 'Pannier', '922-173-2201', '7/2/2021', 'Tiler', 'Huggett', 'Agender', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('mwhitev@histats.com', 'fCXWi7', 'Fix San', '574-992-0965', '9/30/2021', 'Mariya', 'White', 'Agender', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('mdiscombew@bloglines.com', 'MMC7ebUvyw9', 'Wrapsafe', '444-163-3663', '12/8/2020', 'Murdoch', 'Discombe', 'Agender', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('tmacswaydex@cnet.com', 'LlxCwE0lcwTE', 'Tin', '305-913-7295', '3/8/2021', 'Theo', 'MacSwayde', 'Genderfluid', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('dpacky@nyu.edu', '7ns3wUO3', 'It', '901-568-0971', '12/21/2020', 'Dana', 'Pack', 'Female', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('ebelamyz@globo.com', 'wFGWzGDNJc27', 'Quo Lux', '859-597-0854', '10/14/2020', 'Eden', 'Belamy', 'Male', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('csalery10@usda.gov', 'dNpL21D', 'Home Ing', '479-563-4712', '8/30/2021', 'Cullan', 'Salery', 'Male', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('avescovo11@gmpg.org', 'q8DLHEZe', 'Flowdesk', '634-510-8328', '5/5/2021', 'Audre', 'Vescovo', 'Agender', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('nwinterson12@slideshare.net', 'Oe8XJUHytft', 'Job', '910-226-7203', '2/3/2021', 'Nariko', 'Winterson', 'Male', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('gturban13@naver.com', 'btVfib4UHYJp', 'Konklab', '830-188-8213', '6/7/2021', 'Georgeta', 'Turban', 'Genderqueer', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('dbatt14@google.fr', 'dcqs14blI', 'Fintone', '235-917-5363', '12/26/2020', 'Dynah', 'Batt', 'Agender', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('nsibthorp15@goodreads.com', 'FseC92w', 'Span', '986-828-0144', '7/30/2021', 'Natividad', 'Sibthorp', 'Non-binary', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('cyakunikov16@vkontakte.ru', 'YTutWLgVMKP8', 'Stronghold', '634-428-3824', '12/7/2020', 'Chauncey', 'Yakunikov', 'Non-binary', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('mgillbe17@google.com', 'Ivzj7JK', 'Lotlux', '989-915-7385', '2/1/2021', 'Melva', 'Gillbe', 'Non-binary', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('adahlen18@ucsd.edu', 'cbBgJ5zr3', 'Voltsillam', '274-355-0475', '12/4/2020', 'Arthur', 'Dahlen', 'Female', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('rslucock19@godaddy.com', 'RubqNncKSvu', 'Mat Lam Tam', '592-671-4041', '12/17/2020', 'Ryon', 'Slucock', 'Non-binary', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('twiltshire1a@google.it', 'w0UE1fd', 'Vagram', '213-497-6152', '11/9/2020', 'Ted', 'Wiltshire', 'Female', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('pholberry1b@weibo.com', 'qPnKCKq', 'Fintone', '630-323-3304', '1/20/2021', 'Pearl', 'Holberry', 'Agender', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('alavalle1c@washingtonpost.com', '8XOnKnnB7T', 'Gembucket', '186-832-9334', '4/16/2021', 'Alley', 'Lavalle', 'Genderfluid', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('fdudeney1d@wordpress.com', 'h76gA3iynq59', 'Mat Lam Tam', '456-940-2886', '6/6/2021', 'Francine', 'Dudeney', 'Agender', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('salway1e@barnesandnoble.com', '17qpQlJtB2', 'Matsoft', '943-527-9189', '12/5/2020', 'Suzette', 'Alway', 'Male', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('jshimmin1f@geocities.com', 'xj4w7qno71Qy', 'Toughjoyfax', '303-877-6043', '11/26/2020', 'Jerri', 'Shimmin', 'Genderfluid', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('gstuck1g@about.me', 'OFvctyGUMhe', 'Opela', '701-244-5781', '5/14/2021', 'Gwen', 'Stuck', 'Agender', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('rzecchinii1h@vimeo.com', 'j9nvEs9hu', 'Prodder', '266-332-0363', '10/11/2020', 'Reeta', 'Zecchinii', 'Female', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('aviscovi1i@discuz.net', 'Kl1kOQNgWpu', 'Y-Solowarm', '722-648-7902', '9/25/2021', 'Aharon', 'Viscovi', 'Non-binary', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('ssidebotham1j@tuttocitta.it', 'XO74pnUZFt9j', 'Alpha', '271-863-7231', '11/17/2020', 'Skipper', 'Sidebotham', 'Non-binary', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('idelete1k@thetimes.co.uk', 'b0xQcLn6meJX', 'Cookley', '434-161-3874', '1/29/2021', 'Isabel', 'Delete', 'Female', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('gduchenne1l@imgur.com', 'ADyf94aDYj', 'Lotstring', '163-872-7577', '2/15/2021', 'Goddart', 'Duchenne', 'Genderfluid', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('prolance1m@blinklist.com', 'eFsHZG', 'Voyatouch', '776-201-5312', '11/12/2020', 'Parnell', 'Rolance', 'Genderqueer', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('cfleote1n@furl.net', 'L7XLa7', 'Solarbreeze', '234-883-8851', '7/17/2021', 'Cody', 'Fleote', 'Female', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('belward1o@free.fr', 'rTPXrDeu', 'Otcom', '254-386-0566', '1/14/2021', 'Bondie', 'Elward', 'Bigender', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('gwhiteson1p@whitehouse.gov', 'BxPvbeqlYtjS', 'Alphazap', '745-402-6952', '5/6/2021', 'Gwendolen', 'Whiteson', 'Genderfluid', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('ufandrich1q@gravatar.com', 'QEzPXGXH4TQ6', 'Greenlam', '664-689-6795', '3/1/2021', 'Ursa', 'Fandrich', 'Non-binary', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('jgarrison1r@seesaa.net', 's9b9dryc6', 'Temp', '593-775-5084', '10/5/2020', 'Jennette', 'Garrison', 'Genderfluid', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('btoyne1s@jigsy.com', 'NaXl6QT4', 'Overhold', '178-664-4130', '1/14/2021', 'Bobine', 'Toyne', 'Bigender', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('rbeaumont1t@howstuffworks.com', 'bUItZmRm6', 'Regrant', '676-500-0900', '12/4/2020', 'Rutherford', 'Beaumont', 'Non-binary', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('tfossitt1u@ask.com', 'ZfMd0OwX', 'Alpha', '528-836-8660', '7/6/2021', 'Tanney', 'Fossitt', 'Agender', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('pbuckland1v@yahoo.com', '4tbdDSlrEZum', 'Namfix', '352-403-5130', '8/6/2021', 'Parry', 'Buckland', 'Agender', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('brome1w@upenn.edu', 'IDup7Nd9lLC', 'Transcof', '428-781-6408', '9/26/2021', 'Brynna', 'Rome', 'Genderfluid', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('wmeo1x@vkontakte.ru', 'F9MWouuPyYj7', 'Redhold', '943-404-0331', '2/18/2021', 'Wendi', 'Meo', 'Non-binary', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('jdyett1y@wikispaces.com', 'VVquYeS', 'Sub-Ex', '610-847-5566', '10/30/2020', 'Jaimie', 'Dyett', 'Genderqueer', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('fboud1z@bandcamp.com', 'LGphbd', 'Stim', '299-953-1899', '1/22/2021', 'Fredi', 'Boud', 'Genderqueer', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('bmidden20@mtv.com', 'Y4rEaisL', 'Stronghold', '626-904-3422', '7/20/2021', 'Beryle', 'Midden', 'Agender', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('ydefrancisci21@yahoo.co.jp', '6lyYhAnvT3T8', 'Bitchip', '431-326-3749', '5/31/2021', 'Yolane', 'De Francisci', 'Agender', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('reggleston22@si.edu', 'iMxJ5WO17TQ', 'Otcom', '951-586-6819', '6/9/2021', 'Rhodia', 'Eggleston', 'Genderfluid', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('cfound23@google.com.au', 'bnutmK', 'Cardguard', '162-427-9404', '5/6/2021', 'Coriss', 'Found', 'Bigender', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('wbezants24@auda.org.au', 'tslxGDDQft', 'Cookley', '593-101-6381', '3/30/2021', 'Wilhelm', 'Bezants', 'Polygender', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('cmacconnell25@amazon.de', 'S24kTG', 'Otcom', '693-311-0207', '10/6/2020', 'Chryste', 'MacConnell', 'Polygender', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('ldjorvic26@dedecms.com', 'upZEPl0', 'Greenlam', '467-269-8088', '12/27/2020', 'Lottie', 'Djorvic', 'Polygender', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('chaydn27@berkeley.edu', 'GmNg72wj9i', 'Flexidy', '328-735-9789', '9/3/2021', 'Cassey', 'Haydn', 'Genderfluid', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('dcutforth28@apache.org', 'PyIsrhG9', 'Asoka', '440-330-8281', '6/19/2021', 'Dennet', 'Cutforth', 'Bigender', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('goloughnan29@yolasite.com', 'OEVxNNbL', 'Regrant', '242-886-0625', '6/27/2021', 'Glenn', 'O''Loughnan', 'Polygender', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('trobelet2a@amazon.com', '62A31gUgix', 'Fix San', '613-458-9815', '10/16/2020', 'Thibaut', 'Robelet', 'Male', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('ringlese2b@statcounter.com', '9OVYaewYNe', 'Ventosanzap', '788-205-6639', '9/15/2021', 'Rois', 'Inglese', 'Male', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('etremmil2c@fastcompany.com', '8DgoqRzp1qO', 'Flexidy', '749-710-3805', '4/25/2021', 'Ericka', 'Tremmil', 'Genderfluid', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('fburnyeat2d@freewebs.com', 'vlOIXMpRv', 'Y-Solowarm', '557-653-7337', '11/11/2020', 'Farris', 'Burnyeat', 'Female', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('glinscott2e@patch.com', 'F5fl2zQQ3gy', 'Aerified', '160-902-7130', '1/14/2021', 'Gerardo', 'Linscott', 'Male', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('jjenk2f@google.ru', 'ng35UusdM', 'Job', '320-906-7202', '7/16/2021', 'Jefferson', 'Jenk', 'Male', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('gswadlinge2g@boston.com', 'v6nyj8OrtUY', 'Lotlux', '154-235-8463', '2/11/2021', 'Gayleen', 'Swadlinge', 'Agender', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('lbadham2h@gravatar.com', 'jxmMxLQ', 'Subin', '690-600-9046', '4/2/2021', 'Lou', 'Badham', 'Polygender', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('lnoirel2i@merriam-webster.com', '5K7OFEOU', 'Temp', '135-988-6161', '7/28/2021', 'Loretta', 'Noirel', 'Agender', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('bbonniface2j@jalbum.net', 'dRpY5UMGNJ', 'Namfix', '917-729-6808', '11/22/2020', 'Bevin', 'Bonniface', 'Genderfluid', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('bbartolomeotti2k@marketwatch.com', 'pU4C54l', 'Biodex', '416-701-0932', '5/18/2021', 'Benedetta', 'Bartolomeotti', 'Polygender', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('dsibille2l@nba.com', 'xoJqFKlj', 'Sonair', '196-555-6272', '1/22/2021', 'Dasi', 'Sibille', 'Female', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('skittredge2m@examiner.com', 'MuSclJZpI', 'Viva', '167-521-6522', '12/27/2020', 'Sonja', 'Kittredge', 'Genderfluid', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('amacalpyne2n@theglobeandmail.com', 'GgXpyyD9c', 'Tampflex', '727-725-8556', '5/27/2021', 'Alfie', 'MacAlpyne', 'Genderqueer', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('gfyldes2o@biblegateway.com', 'XdvSExd', 'Namfix', '622-938-2911', '6/24/2021', 'Gillan', 'Fyldes', 'Female', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('ebuntine2p@vkontakte.ru', 'lohE8HoBXlke', 'Treeflex', '904-240-0899', '3/23/2021', 'Earvin', 'Buntine', 'Genderfluid', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('mudell2q@ftc.gov', 'dTUVkTAGEQlE', 'Gembucket', '596-367-5803', '7/23/2021', 'Mattie', 'Udell', 'Male', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('hfalconar2r@google.com', 'vmfeSw7NDM', 'Wrapsafe', '944-822-2411', '10/13/2020', 'Haily', 'Falconar', 'Bigender', false);
