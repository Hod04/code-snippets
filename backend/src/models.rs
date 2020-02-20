use serde::{Deserialize, Serialize};
use tokio_pg_mapper_derive::PostgresMapper;

#[derive(Serialize)]
pub struct Status {
  pub status: String,
}

#[derive(Serialize, Deserialize, PostgresMapper)]
#[pg_mapper(table = "snippet_list")]
pub struct SnippetList {
  pub id: i32,
  pub title: String,
}

#[derive(Serialize, Deserialize, PostgresMapper)]
#[pg_mapper(table = "item")]
pub struct SnippetItem {
  pub id: i32,
  pub title: String,
  pub code: String,
}

#[derive(Deserialize)]
pub struct CreateSnippetList {
  pub title: String,
}

#[derive(Deserialize)]
pub struct CreateSnippetItem {
  pub title: String,
}

#[derive(Deserialize)]
pub struct UpdateSnippetItem {
  pub code: String,
}

#[derive(Serialize)]
pub struct Response {
  pub result: bool,
}
