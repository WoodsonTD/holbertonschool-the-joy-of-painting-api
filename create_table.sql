-- Create Episode Table
CREATE TABLE Episode (
    episode_id INT PRIMARY KEY,
    title VARCHAR(255),
    air_date DATE,
    img_src VARCHAR(255),
    num_colors INT,
    youtube_src VARCHAR(255)
);

-- Create Subject Table
CREATE TABLE Subject (
    subject_id INT PRIMARY KEY,
    name VARCHAR(255)
);

-- Create ColorPalette Table
CREATE TABLE Color (
    color_id INT PRIMARY KEY,
    name VARCHAR(255),
    hex_code VARCHAR(7)
);

CREATE TABLE ColorPalette (
    palette_id INT PRIMARY KEY,
    episode_id INT,
    FOREIGN KEY (episode_id) REFERENCES Episode(episode_id)
);

CREATE TABLE Palette_Color (
    palette_id INT,
    color_id INT,
    PRIMARY KEY (palette_id, color_id),
    FOREIGN KEY (palette_id) REFERENCES ColorPalette(palette_id),
    FOREIGN KEY (color_id) REFERENCES Color(color_id)
);

-- Create Episode_Subject Table for Many-to-Many Relationship
CREATE TABLE Episode_Subject (
    episode_id INT,
    subject_id INT,
    PRIMARY KEY (episode_id, subject_id),
    FOREIGN KEY (episode_id) REFERENCES Episode(episode_id),
    FOREIGN KEY (subject_id) REFERENCES Subject(subject_id)
);
