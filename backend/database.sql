DROP TABLE IF EXISTS snippet_item;
DROP TABLE IF EXISTS snippet_list;

CREATE TABLE snippet_list
(
  id SERIAL PRIMARY KEY,
  title VARCHAR(150)
);

CREATE TABLE snippet_item
(
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  code TEXT NOT NULL DEFAULT '',
  list_id INTEGER NOT NULL,
  FOREIGN KEY (list_id) REFERENCES snippet_list(id)
);

INSERT INTO snippet_list
  (title)
VALUES
  ('List 1'),
  ('List 2');
INSERT INTO snippet_item
  (title, list_id)
VALUES
  ('Connect to database', 1),
  ('Do queries', 1);