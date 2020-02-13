use crate::db;
use crate::models::{CreateSnippetItem, CreateSnippetList, Status, UpdateSnippetItem};

use actix_web::{web, HttpResponse, Responder};
use deadpool_postgres::{Client, Pool};
use std::io::ErrorKind::NotFound;

pub async fn status() -> impl Responder {
  web::HttpResponse::Ok().json(Status {
    status: "Up and running".to_string(),
  })
}

/*
** Snippet List
*/

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

pub async fn get_snippet_list(
  list_id: web::Path<(i32,)>,
  db_pool: web::Data<Pool>,
) -> impl Responder {
  let client: Client = get_client(db_pool).await;
  let result = db::get_snippet_list(&client, list_id.0).await;

  match result {
    Ok(snippet) => HttpResponse::Ok().json(snippet),
    Err(ref e) if e.kind() == NotFound => HttpResponse::NotFound().into(),
    Err(_) => HttpResponse::InternalServerError().into(),
  }
}

pub async fn delete_snippet_list(
  list_id: web::Path<(i32,)>,
  db_pool: web::Data<Pool>,
) -> impl Responder {
  let client: Client = get_client(db_pool).await;
  db::delete_snippet_list(&client, list_id.0).await;
  HttpResponse::Ok().json("Snippet list has been successfully removed")
}

pub async fn create_snippet_list(
  snippet_list: web::Json<CreateSnippetList>,
  db_pool: web::Data<Pool>,
) -> impl Responder {
  let client: Client = get_client(db_pool).await;
  let result = db::create_snippet_list(&client, snippet_list.title.clone()).await;

  match result {
    Ok(snippet) => HttpResponse::Ok().json(snippet),
    Err(_) => HttpResponse::InternalServerError().into(),
  }
}

/*
** Snippet Item
*/

pub async fn get_snippet_items(
  list_id: web::Path<(i32,)>,
  db_pool: web::Data<Pool>,
) -> impl Responder {
  let client: Client = get_client(db_pool).await;
  let result = db::get_snippet_items(&client, list_id.0).await;

  match result {
    Ok(snippet_items) => HttpResponse::Ok().json(snippet_items),
    Err(_) => HttpResponse::InternalServerError().into(),
  }
}

pub async fn create_snippet_item(
  list_id: web::Path<(i32,)>,
  snippet_item: web::Json<CreateSnippetItem>,
  db_pool: web::Data<Pool>,
) -> impl Responder {
  let client: Client = get_client(db_pool).await;
  let result = db::create_snippet_item(
    &client,
    list_id.0,
    snippet_item.title.clone(),
    snippet_item.code.clone(),
  )
  .await;

  match result {
    Ok(snippet_item) => HttpResponse::Ok().json(snippet_item),
    Err(_) => HttpResponse::InternalServerError().into(),
  }
}

pub async fn get_snippet_item(
  ids: web::Path<(i32, i32)>,
  db_pool: web::Data<Pool>,
) -> impl Responder {
  let client: Client = get_client(db_pool).await;
  let result = db::get_snippet_item(&client, ids.0, ids.1).await;

  match result {
    Ok(item) => HttpResponse::Ok().json(item),
    Err(ref e) if e.kind() == NotFound => HttpResponse::NotFound().into(),
    Err(_) => HttpResponse::InternalServerError().into(),
  }
}

pub async fn update_snippet_item(
  ids: web::Path<(i32, i32)>,
  snippet_item: web::Json<UpdateSnippetItem>,
  db_pool: web::Data<Pool>,
) -> impl Responder {
  let client: Client = get_client(db_pool).await;
  let result = db::update_snippet_item(
    &client,
    ids.0,
    ids.1,
    snippet_item.title.clone(),
    snippet_item.code.clone(),
  )
  .await;

  match result {
    Ok(item) => HttpResponse::Ok().json(item),
    Err(ref e) if e.kind() == NotFound => HttpResponse::NotFound().into(),
    Err(_) => HttpResponse::InternalServerError().into(),
  }
}

pub async fn delete_snippet_item(
  ids: web::Path<(i32, i32)>,
  db_pool: web::Data<Pool>,
) -> impl Responder {
  let client: Client = get_client(db_pool).await;
  let result = db::delete_snippet_item(&client, ids.0, ids.1).await;

  match result {
    Ok(_) => HttpResponse::Ok().json("Snippet item has been successfully removed"),
    Err(ref e) if e.kind() == NotFound => HttpResponse::NotFound().into(),
    Err(_) => HttpResponse::InternalServerError().into(),
  }
}
