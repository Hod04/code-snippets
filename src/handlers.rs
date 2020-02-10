use crate::db;
use crate::models::{SnippetList, Status};

use actix_web::{web, HttpResponse, Responder};
use deadpool_postgres::{Client, Pool};

pub async fn status() -> impl Responder {
  web::HttpResponse::Ok().json(Status {
    status: "Up and running".to_string(),
  })
}

async fn get_client(db_pool: web::Data<Pool>) -> Client {
  db_pool
    .get()
    .await
    .expect("Error connecting to the database")
}

pub async fn get_snippets(db_pool: web::Data<Pool>) -> impl Responder {
  let client: Client = get_client(db_pool).await;
  let result = db::get_snippets(&client).await;

  match result {
    Ok(snippets) => HttpResponse::Ok().json(snippets),
    Err(_) => HttpResponse::InternalServerError().into(),
  }
}

pub async fn create_snippet_list(
  db_pool: web::Data<Pool>,
  snippet_list: web::Json<SnippetList>,
) -> impl Responder {
  let client: Client = get_client(db_pool).await;
  let result = db::create_snippet_list(&client, snippet_list.title.clone()).await;

  match result {
    Ok(snippet) => HttpResponse::Ok().json(snippet),
    Err(_) => HttpResponse::InternalServerError().into(),
  }
}
