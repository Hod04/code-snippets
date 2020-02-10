use crate::models::SnippetList;

use deadpool_postgres::Client;
use std::io;
use tokio_pg_mapper::FromTokioPostgresRow;

pub async fn get_snippets(client: &Client) -> Result<Vec<SnippetList>, io::Error> {
  let query_statement = client.prepare("SELECT * FROM snippet_list").await.unwrap();

  let snippets = client
    .query(&query_statement, &[])
    .await
    .expect("Error fetching snippets")
    .iter()
    .map(|row| SnippetList::from_row_ref(row).unwrap())
    .collect::<Vec<SnippetList>>();
  Ok(snippets)
}
