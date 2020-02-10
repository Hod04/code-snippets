use crate::db;
use crate::models::Status;

use actix_web::{web, HttpResponse, Responder};
use deadpool_postgres::{Client, Pool};

pub async fn status() -> impl Responder {
  web::HttpResponse::Ok().json(Status {
    status: "Up and running".to_string(),
  })
}

pub async fn get_snippets(db_pool: web::Data<Pool>) -> impl Responder {
  let client: Client = db_pool
    .get()
    .await
    .expect("Error connecting to the database");
  let result = db::get_snippets(&client).await;

  match result {
    Ok(snippets) => HttpResponse::Ok().json(snippets),
    Err(_) => HttpResponse::InternalServerError().into(),
  }
}
