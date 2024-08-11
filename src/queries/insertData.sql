USE bookingApp;
-- Insert Restaurants
INSERT INTO Restaurants (
        name,
        num_two_top_tables,
        num_four_top_tables,
        num_six_top_tables
    )
VALUES ('Lardo', 4, 2, 1),
    ('Panadería Rosetta', 3, 2, 0),
    ('Tetetlán', 4, 2, 1),
    ('Falling Piano Brewing Co', 5, 5, 5),
    ('u.to.pi.a', 2, 0, 0);
-- Insert Endorsements
INSERT INTO DietOption (name)
VALUES ('Gluten Free'),
    ('Vegetarian'),
    ('Paleo'),
    ('Vegan');
-- Associate Restaurants with Endorsements
INSERT INTO RestaurantEndorsements (restaurant_id, diet_option_id)
VALUES (1, 1),
    (2, 1),
    (2, 2),
    (3, 1),
    (3, 3),
    (5, 2),
    (5, 4);
-- Insert Users
INSERT INTO Users (name, home_location)
VALUES (
        'Michael',
        ST_GeomFromText('POINT(19.4153107 -99.1804722)')
    ),
    (
        'George Michael',
        ST_GeomFromText('POINT(19.4058242 -99.1671942)')
    ),
    (
        'Lucile',
        ST_GeomFromText('POINT(19.3634215 -99.1769323)')
    ),
    (
        'Gob',
        ST_GeomFromText('POINT(19.3318331 -99.2078983)')
    ),
    (
        'Tobias',
        ST_GeomFromText('POINT(19.4384214 -99.2036906)')
    ),
    (
        'Maeby',
        ST_GeomFromText('POINT(19.4349474 -99.1419256)')
    );
-- Associate Users with Dietary Restrictions
INSERT INTO UserDietaryRestrictions (user_id, diet_option_id)
VALUES (1, 2),
    -- Michael -> Vegetarian
    (2, 1),
    -- George Michael -> Gluten-Free
    (2, 2),
    -- George Michael -> Vegetarian
    (3, 1),
    -- Lucile -> Gluten-Free
    (4, 3),
    -- Gob -> Paleo
    (6, 4);
-- Maeby -> Vegan