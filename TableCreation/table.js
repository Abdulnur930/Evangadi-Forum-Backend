`CREATE TABLE users(
     userid INT(20) NOT NULL AUTO_INCREMENT,
     username VARCHAR(20) NOT NULL,
     firstname VARCHAR(20) NOT NULL,
     lastname VARCHAR (20) NOT NULL,
     email VARCHAR(40) NOT NULL,
     password VARCHAR(100) NOT NULL,
     PRIMARY KEY(userid)
);
CREATE TABLE questions(
     id INT (20) NOT NULL AUTO_INCREMENT,
     questionid VARCHAR(100) NOT NULL UNIQUE, 
     userid INT(20) NOT NULL,
     title VARCHAR(100) NOT NULL,
     description VARCHAR(250) NOT NULL, 
     tag VARCHAR(20),
     PRIMARY KEY(id, questionid),
     FOREIGN KEY(userid) REFERENCES users(userid)
);
CREATE TABLE answers( 
    answerid INT(20) NOT NULL AUTO_INCREMENT,
    userid INT(20) NOT NULL,
    questionid VARCHAR(100) NOT NULL,
    answer VARCHAR(250) NOT NULL,
    PRIMARY KEY(answerid),
    FOREIGN KEY(questionid) REFERENCES questions(questionid),
    FOREIGN KEY(userid) REFERENCES users(userid)
);`;
