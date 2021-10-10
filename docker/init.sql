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
  isVetted BOOLEAN NOT NULL,
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

insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('mwillavize0@sina.com', 'ujCkcK64v4D', 'mwillavize0', '665-321-2366', '05/22/2021', 'Michaeline', 'Willavize', 'Polygender', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('lstewartson1@mayoclinic.com', 'BAoPNZ', 'lstewartson1', '581-417-7720', '10/21/2020', 'Letitia', 'Stewartson', 'Bigender', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('rtravers2@istockphoto.com', 'lmCRTfNm', 'rtravers2', '958-535-8016', '01/27/2021', 'Ric', 'Travers', 'Genderfluid', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('mseleway3@unicef.org', '7qpqO1', 'mseleway3', '428-518-6040', '06/10/2021', 'Melonie', 'Seleway', 'Agender', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('rstranio4@ow.ly', 'tW8XPhJ3J', 'rstranio4', '386-794-8116', '05/04/2021', 'Royce', 'Stranio', 'Genderfluid', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('dcarnock5@soundcloud.com', '5nmneUINbw', 'dcarnock5', '836-677-2085', '06/19/2021', 'Dorella', 'Carnock', 'Male', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('codd6@oracle.com', 'oYAaJIEZNe', 'codd6', '582-224-6340', '02/27/2021', 'Candida', 'Odd', 'Polygender', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('cglander7@wsj.com', 'qOAUCwl', 'cglander7', '190-472-5129', '09/08/2021', 'Casi', 'Glander', 'Polygender', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('hquan8@pinterest.com', 'CdFXKF', 'hquan8', '464-976-8700', '12/21/2020', 'Hansiain', 'Quan', 'Polygender', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('mbeaten9@cocolog-nifty.com', 'ZjVCQWkUC', 'mbeaten9', '943-492-3964', '12/30/2020', 'Milka', 'Beaten', 'Genderfluid', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('ebortolottia@shutterfly.com', 'BifXEEtiN9Bh', 'ebortolottia', '521-519-4527', '03/02/2021', 'Evangelin', 'Bortolotti', 'Non-binary', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('grevilleb@ow.ly', 'JSZQvn3tUER', 'grevilleb', '517-634-5276', '10/17/2020', 'Gail', 'Reville', 'Female', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('nepplec@slashdot.org', 'RflCj95XRh', 'nepplec', '588-336-9577', '01/22/2021', 'Nikolai', 'Epple', 'Non-binary', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('lwhilded@ebay.com', '9nvJUuR9', 'lwhilded', '862-855-5672', '01/08/2021', 'Loydie', 'Whilde', 'Genderfluid', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('rsentancee@ihg.com', 'GO57gjURB69', 'rsentancee', '804-814-5197', '09/13/2021', 'Ronna', 'Sentance', 'Genderqueer', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('geyresf@booking.com', 'T1RiouK', 'geyresf', '168-868-3386', '12/03/2020', 'Graehme', 'Eyres', 'Genderqueer', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('dgronauerg@sphinn.com', 'uqf6GjkSCLyU', 'dgronauerg', '206-247-3493', '01/26/2021', 'Deidre', 'Gronauer', 'Non-binary', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('learyh@ifeng.com', '4aZaKpZ', 'learyh', '146-276-1658', '10/23/2020', 'Liesa', 'Eary', 'Genderfluid', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('memmeri@csmonitor.com', 'nYI712rzXilt', 'memmeri', '134-628-8033', '03/04/2021', 'Meghan', 'Emmer', 'Non-binary', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('jmcelanej@samsung.com', '2wgU15M', 'jmcelanej', '933-345-1173', '06/04/2021', 'Julita', 'McElane', 'Female', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('ssoutheyk@lycos.com', 'Oakv6Anw', 'ssoutheyk', '300-281-8182', '06/18/2021', 'Sue', 'Southey', 'Female', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('ahewl@weibo.com', '2CORnHB', 'ahewl', '983-611-6815', '02/07/2021', 'Andree', 'Hew', 'Polygender', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('jcotillardm@meetup.com', 'OSqEwmYIXQC', 'jcotillardm', '132-170-6208', '08/20/2021', 'Jacquenette', 'Cotillard', 'Male', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('rcollickn@earthlink.net', 'zgnUxsEGfs', 'rcollickn', '752-464-1832', '06/19/2021', 'Raymund', 'Collick', 'Female', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('jtomasonio@unesco.org', 'CXfYgT7sIY', 'jtomasonio', '124-271-8899', '07/19/2021', 'Josi', 'Tomasoni', 'Non-binary', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('fthomelp@tinypic.com', 'EIKr2YNceS', 'fthomelp', '921-827-5586', '06/01/2021', 'Finley', 'Thomel', 'Non-binary', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('gruffellq@google.fr', 'sTMLvo88O', 'gruffellq', '675-406-5701', '07/03/2021', 'Gavin', 'Ruffell', 'Genderqueer', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('wchasmerr@topsy.com', 'R8ZLbN', 'wchasmerr', '402-155-5280', '05/03/2021', 'Wainwright', 'Chasmer', 'Male', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('ctourots@youtu.be', 'kQU43zHUuRg', 'ctourots', '702-837-6031', '06/13/2021', 'Corbett', 'Tourot', 'Female', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('wmoffattt@indiegogo.com', 'exSb6kKOlv', 'wmoffattt', '684-262-0925', '12/04/2020', 'Welby', 'Moffatt', 'Bigender', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('bgronaveru@github.io', '5nzA9ib', 'bgronaveru', '757-166-5896', '03/13/2021', 'Beulah', 'Gronaver', 'Genderqueer', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('hfranzkev@studiopress.com', '2NknHP', 'hfranzkev', '491-539-9142', '07/27/2021', 'Hayden', 'Franzke', 'Female', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('ojuppw@canalblog.com', 'hQ45fckPJwy', 'ojuppw', '625-486-6145', '03/23/2021', 'Orville', 'Jupp', 'Non-binary', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('cmoncreiffx@springer.com', 'm97gRN9YIG', 'cmoncreiffx', '430-105-1392', '08/15/2021', 'Clarey', 'Moncreiff', 'Genderqueer', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('abalamy@addthis.com', 'G3uLXw', 'abalamy', '360-315-2111', '01/20/2021', 'Anita', 'Balam', 'Genderqueer', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('bmcilwraithz@joomla.org', '6uk6VJ1', 'bmcilwraithz', '214-803-7015', '07/08/2021', 'Bernita', 'McIlwraith', 'Genderqueer', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('mfosken10@digg.com', 'Mc2FuFrzx', 'mfosken10', '707-450-4722', '07/04/2021', 'Margot', 'Fosken', 'Male', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('htunn11@sogou.com', 'v8a4pcASkpvM', 'htunn11', '783-526-8392', '09/10/2021', 'Hubey', 'Tunn', 'Genderfluid', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('fthowes12@stumbleupon.com', 'hHMgs9', 'fthowes12', '186-687-2848', '08/22/2021', 'Far', 'Thowes', 'Non-binary', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('tklain13@webeden.co.uk', 'kAhxnTW', 'tklain13', '277-934-3442', '03/25/2021', 'Tyrone', 'Klain', 'Non-binary', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('tmichelet14@canalblog.com', '7RikOov5iZBM', 'tmichelet14', '801-610-0545', '07/30/2021', 'Terri', 'Michelet', 'Bigender', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('mnapper15@blogs.com', '6kMY7YI2HLC', 'mnapper15', '110-681-7461', '02/06/2021', 'Marci', 'Napper', 'Non-binary', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('bgrayshan16@hatena.ne.jp', 'JDKG3lK', 'bgrayshan16', '941-326-1945', '06/13/2021', 'Britney', 'Grayshan', 'Non-binary', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('tmainston17@usnews.com', 'INtxrSFmMRW', 'tmainston17', '128-544-8317', '05/10/2021', 'Toiboid', 'Mainston', 'Non-binary', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('ahenaughan18@mit.edu', '0AfohI', 'ahenaughan18', '706-150-2252', '08/20/2021', 'Ashlen', 'Henaughan', 'Genderfluid', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('nmicheau19@skyrock.com', 'CcarCCMhjGq', 'nmicheau19', '624-111-8153', '06/22/2021', 'Neddy', 'Micheau', 'Non-binary', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('mfoggo1a@abc.net.au', 'iyvzAP', 'mfoggo1a', '198-954-9125', '04/25/2021', 'Margi', 'Foggo', 'Bigender', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('rmattam1b@is.gd', 'SOnVxwkd', 'rmattam1b', '808-963-7713', '02/14/2021', 'Rudolfo', 'Mattam', 'Polygender', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('pwhittaker1c@zimbio.com', 'q6hmYul5', 'pwhittaker1c', '762-572-9975', '05/14/2021', 'Pebrook', 'Whittaker', 'Female', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('mpaull1d@disqus.com', 's45810', 'mpaull1d', '229-221-5170', '06/04/2021', 'Marcellina', 'Paull', 'Male', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('hdongles1e@blogspot.com', 'A97BBpUa', 'hdongles1e', '625-705-2916', '04/27/2021', 'Haleigh', 'Dongles', 'Female', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('nmiddlemist1f@google.es', 'QyxBmjVb', 'nmiddlemist1f', '241-940-7924', '04/04/2021', 'Nye', 'Middlemist', 'Genderfluid', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('nwilkins1g@desdev.cn', '0lo0bnW', 'nwilkins1g', '678-581-4369', '03/12/2021', 'Nelle', 'Wilkins', 'Agender', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('cfeaviour1h@ocn.ne.jp', 'TrWe36CZ', 'cfeaviour1h', '903-894-1172', '10/15/2020', 'Corella', 'Feaviour', 'Agender', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('cklais1i@who.int', '5I96mlAnsn', 'cklais1i', '194-355-1575', '07/13/2021', 'Corliss', 'Klais', 'Genderqueer', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('jharbour1j@merriam-webster.com', 'zMuAgLPLx', 'jharbour1j', '704-169-8968', '12/02/2020', 'Joete', 'Harbour', 'Male', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('pcapewell1k@xinhuanet.com', 'g14kYiD7u', 'pcapewell1k', '285-321-1132', '12/22/2020', 'Paulie', 'Capewell', 'Bigender', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('tflindall1l@booking.com', 'VCnbkaS', 'tflindall1l', '902-809-1098', '09/15/2021', 'Tibold', 'Flindall', 'Non-binary', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('esloy1m@liveinternet.ru', 'hV9lcemzG3', 'esloy1m', '651-591-8810', '12/22/2020', 'Eziechiele', 'Sloy', 'Genderfluid', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('ggalbraeth1n@goodreads.com', 'zXSQ2IZBo9sX', 'ggalbraeth1n', '136-387-9764', '08/17/2021', 'Gray', 'Galbraeth', 'Agender', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('dgreensitt1o@canalblog.com', 'b7zmbIVDrE', 'dgreensitt1o', '768-823-6455', '05/05/2021', 'Dallas', 'Greensitt', 'Agender', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('gmecchi1p@google.co.uk', 'TBFOELXaJ', 'gmecchi1p', '657-890-9077', '11/28/2020', 'Gerrie', 'Mecchi', 'Bigender', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('tevenett1q@pinterest.com', 'bbHzD6XL', 'tevenett1q', '554-273-5482', '08/03/2021', 'Teirtza', 'Evenett', 'Male', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('mdesseine1r@hao123.com', '41LaocbW', 'mdesseine1r', '905-138-9664', '03/27/2021', 'Monty', 'Desseine', 'Agender', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('galcide1s@gnu.org', 'f9FA8ba', 'galcide1s', '971-246-7680', '06/29/2021', 'Giustino', 'Alcide', 'Female', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('cthickpenny1t@comcast.net', 'SoSnunQ', 'cthickpenny1t', '153-416-0874', '04/11/2021', 'Ceil', 'Thickpenny', 'Bigender', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('mroobottom1u@jalbum.net', 'p1PzDn', 'mroobottom1u', '469-736-5744', '07/18/2021', 'Madison', 'Roobottom', 'Genderfluid', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('msugge1v@topsy.com', '6lYKgA930', 'msugge1v', '733-626-9425', '05/19/2021', 'Marrilee', 'Sugge', 'Non-binary', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('ghannay1w@goo.gl', 'MNQprU3mu5jz', 'ghannay1w', '511-901-6262', '12/01/2020', 'Ginevra', 'Hannay', 'Genderfluid', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('lmcmeekan1x@google.ca', 'U0ZN9rZM6', 'lmcmeekan1x', '164-375-5108', '01/27/2021', 'Luise', 'Mc Meekan', 'Genderqueer', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('dcottill1y@drupal.org', 'uaKhkKXoAO', 'dcottill1y', '971-805-9546', '11/20/2020', 'Derry', 'Cottill', 'Bigender', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('lharmour1z@ca.gov', '9Oysdygiyuq', 'lharmour1z', '385-794-0564', '05/20/2021', 'Lizette', 'Harmour', 'Non-binary', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('acarstairs20@biglobe.ne.jp', 'xLCiye', 'acarstairs20', '650-596-3761', '04/23/2021', 'Auberon', 'Carstairs', 'Female', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('mkinnen21@newsvine.com', '9ptFTmsgBc', 'mkinnen21', '361-173-1952', '11/29/2020', 'Martie', 'Kinnen', 'Genderqueer', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('wtippler22@chronoengine.com', 'KE798q', 'wtippler22', '178-773-8362', '06/30/2021', 'Willa', 'Tippler', 'Polygender', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('adammarell23@mozilla.org', 'VK3yY2', 'adammarell23', '730-850-9800', '08/17/2021', 'Aleece', 'Dammarell', 'Male', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('aflexman24@yellowbook.com', 'x9goioT', 'aflexman24', '970-862-1947', '09/27/2021', 'Alina', 'Flexman', 'Agender', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('katkirk25@netlog.com', 'ix6yxHV3M', 'katkirk25', '571-685-0345', '09/28/2021', 'Killie', 'Atkirk', 'Non-binary', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('qabrahmer26@hexun.com', 'pUu8OHw', 'qabrahmer26', '398-268-9644', '09/20/2021', 'Quill', 'Abrahmer', 'Bigender', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('rpoulglais27@mail.ru', 'uNXheZK', 'rpoulglais27', '414-300-8245', '02/12/2021', 'Roselle', 'Poulglais', 'Genderqueer', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('bblum28@delicious.com', 'xuKZBWHO', 'bblum28', '207-337-2430', '12/12/2020', 'Bengt', 'Blum', 'Agender', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('ajouanet29@mysql.com', 'Z8a13lxwByG', 'ajouanet29', '680-822-7790', '02/28/2021', 'Aggi', 'Jouanet', 'Male', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('odovey2a@omniture.com', 'LttjSlK9yo', 'odovey2a', '325-143-5937', '07/25/2021', 'Orelie', 'Dovey', 'Agender', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('igoodday2b@buzzfeed.com', 'w6vrnh6g', 'igoodday2b', '773-998-6599', '03/24/2021', 'Iolande', 'Goodday', 'Agender', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('ltankard2c@cbslocal.com', 'eRN2OAY', 'ltankard2c', '783-440-2333', '11/01/2020', 'Lorine', 'Tankard', 'Agender', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('obaise2d@whitehouse.gov', '43oN9G8jnLD', 'obaise2d', '760-115-5439', '09/17/2021', 'Oralia', 'Baise', 'Agender', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('askeene2e@people.com.cn', '5FGlx4XcC6JG', 'askeene2e', '906-321-9803', '03/03/2021', 'Ariel', 'Skeene', 'Non-binary', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('cfaireclough2f@addtoany.com', 'PpS56I3PDgF', 'cfaireclough2f', '286-144-4810', '08/04/2021', 'Carina', 'Faireclough', 'Non-binary', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('mnazareth2g@engadget.com', 'pudG9T2xZ', 'mnazareth2g', '908-923-5432', '04/24/2021', 'Merci', 'Nazareth', 'Polygender', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('mkaser2h@msn.com', 'AM8C9DGSI', 'mkaser2h', '364-213-1981', '05/03/2021', 'Madelaine', 'Kaser', 'Male', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('mmawby2i@dyndns.org', 'TFuIdkgoz', 'mmawby2i', '685-561-8394', '03/08/2021', 'Mureil', 'Mawby', 'Female', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('hcolliver2j@google.com.br', 'yglbKA6W', 'hcolliver2j', '299-749-1840', '04/03/2021', 'Hillary', 'Colliver', 'Non-binary', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('bchampley2k@senate.gov', 'dveyPR2Srtys', 'bchampley2k', '990-894-4074', '09/22/2021', 'Banky', 'Champley', 'Polygender', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('sainley2l@sun.com', 'XKHinkJ', 'sainley2l', '208-172-1041', '12/22/2020', 'Sibeal', 'Ainley', 'Genderfluid', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('zpriddy2m@usgs.gov', '3yM671', 'zpriddy2m', '871-255-7771', '03/12/2021', 'Zahara', 'Priddy', 'Genderqueer', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('ksieghard2n@nasa.gov', 'LrprXteR4Ao4', 'ksieghard2n', '889-421-8262', '06/24/2021', 'Kerianne', 'Sieghard', 'Genderqueer', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('jmelley2o@is.gd', 'G8FzLgFd', 'jmelley2o', '401-548-3010', '02/14/2021', 'Julian', 'Melley', 'Male', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('fakehurst2p@google.com.br', '7KqLZ742ec', 'fakehurst2p', '654-777-3344', '01/15/2021', 'Freddie', 'Akehurst', 'Genderqueer', true);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('mhacksby2q@wsj.com', 'uDQe7Q', 'mhacksby2q', '515-532-6333', '10/07/2020', 'Marius', 'Hacksby', 'Genderfluid', false);
insert into "user" (email, password, user_name, phone_number, birth_date, first_name, last_name, gender, isVetted) values ('awelfair2r@example.com', 'BdfcXQ6', 'awelfair2r', '464-854-0595', '07/15/2021', 'Annissa', 'Welfair', 'Genderqueer', false);