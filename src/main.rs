mod config;
mod db;
mod handlers;
mod models;

use actix_web::{web, App, HttpServer};
use dotenv::dotenv;
use std::io;
use tokio_postgres::NoTls;

use crate::handlers::*;

#[actix_rt::main]
async fn main() -> io::Result<()> {
	dotenv().ok();

	let config = crate::config::Config::from_env().unwrap();

	let pool = config.pg.create_pool(NoTls).unwrap();

	println!(
		"Starting server at http://{}:{}",
		config.server.host, config.server.port
	);

	HttpServer::new(move || {
		App::new()
			.data(pool.clone())
			.route("/", web::get().to(status))
			.route("/snippets{_:/?}", web::get().to(get_snippets))
			.route("/snippets{_:/?}", web::post().to(create_snippet_list))
			.route("/snippets/{list_id}{_:/?}", web::get().to(get_snippet_list))
			.route(
				"/snippets/{list_id}{_:/?}",
				web::delete().to(delete_snippet_list),
			)
			.route(
				"/snippets/{list_id}/items{_:/?}",
				web::get().to(get_snippet_items),
			)
			.route(
				"/snippets/{list_id}/items{_:/?}",
				web::post().to(create_snippet_item),
			)
			.route(
				"/snippets/{list_id}/items/{item_id}{_:/?}",
				web::get().to(get_snippet_item),
			)
			.route(
				"/snippets/{list_id}/items/{item_id}{_:/?}",
				web::put().to(update_snippet_item),
			)
	})
	.bind(format!("{}:{}", config.server.host, config.server.port))?
	.run()
	.await
}
