CREATE DATABASE bookingApp;
USE bookingApp;
CREATE TABLE Restaurants (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  num_two_top_tables INT NOT NULL,
  num_four_top_tables INT NOT NULL,
  num_six_top_tables INT NOT NULL
);
CREATE TABLE DietOption (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);
CREATE TABLE RestaurantEndorsements (
  restaurant_id BIGINT UNSIGNED,
  diet_option_id BIGINT UNSIGNED,
  PRIMARY KEY (restaurant_id, diet_option_id),
  FOREIGN KEY (restaurant_id) REFERENCES Restaurants(id) ON DELETE CASCADE,
  FOREIGN KEY (diet_option_id) REFERENCES DietOption(id) ON DELETE CASCADE
);
CREATE TABLE Users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  home_location POINT NOT NULL
);
CREATE TABLE UserDietaryRestrictions (
  user_id BIGINT UNSIGNED,
  diet_option_id BIGINT UNSIGNED,
  PRIMARY KEY (user_id, diet_option_id),
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (diet_option_id) REFERENCES DietOption(id) ON DELETE CASCADE
);
CREATE TABLE Reservations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED,
  restaurant_id BIGINT UNSIGNED,
  table_size INT,
  reservation_time TIMESTAMP NOT NULL,
  bulk_id_reservation VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (restaurant_id) REFERENCES Restaurants(id) ON DELETE CASCADE
);