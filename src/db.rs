use crate::models::SnippetList;

use deadpool_postgres::Client;
use std::io;
use tokio_pg_mapper::FromTokioPostgresRow;

pub async fn get_snippets(client: &Client) -> Result<Vec<SnippetList>, io::Error> {
  let query_statement = client
    .prepare("SELECT * FROM snippet_list ORDER BY id DESC")
    .await
    .unwrap();

  let snippets = client
    .query(&query_statement, &[])
    .await
    .expect("Error fetching snippets")
    .iter()
    .map(|row| SnippetList::from_row_ref(row).unwrap())
    .collect::<Vec<SnippetList>>();
  Ok(snippets)
}

pub async fn create_snippet_list(client: &Client, title: String) -> Result<SnippetList, io::Error> {
  let query_statement = client
    .prepare("INSERT INTO snippet_list (title) VALUES ($1) RETURNING id, title")
    .await
    .unwrap();

  client
    .query(&query_statement, &[&title])
    .await
    .expect("Error creating snippet list")
    .iter()
    .map(|row| SnippetList::from_row_ref(row).unwrap())
    .collect::<Vec<SnippetList>>()
    .pop()
    .ok_or(io::Error::new(
      io::ErrorKind::Other,
      "Error creating snippet list",
    ))
}
