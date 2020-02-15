use crate::models::{SnippetItem, SnippetList};

use std::io;
use tokio_pg_mapper::FromTokioPostgresRow;
use tokio_postgres::{Client, Statement};

async fn generate_query_statement(client: &Client, statement: &str) -> Statement {
	client.prepare(statement).await.unwrap()
}

/*
** Snippet List
*/

// @desc Get all snippet lists
// @route GET /snippets
pub async fn get_snippets(client: &Client) -> Result<Vec<SnippetList>, io::Error> {
	let query_statement =
		generate_query_statement(client, "SELECT * FROM snippet_list ORDER BY id DESC").await;

	let snippets = client
		.query(&query_statement, &[])
		.await
		.expect("Error fetching snippets")
		.iter()
		.map(|row| SnippetList::from_row_ref(row).unwrap())
		.collect::<Vec<SnippetList>>();
	Ok(snippets)
}

// @desc Get snippet list by id
// @route GET /snippets/:snippet_list_id
pub async fn get_snippet_list(client: &Client, list_id: i32) -> Result<SnippetList, io::Error> {
	let query_statement =
		generate_query_statement(client, "SELECT * FROM snippet_list WHERE id = $1").await;

	let maybe_snippet = client
		.query_opt(&query_statement, &[&list_id])
		.await
		.expect("Error fetching snippet list")
		.map(|row| SnippetList::from_row_ref(&row).unwrap());

	match maybe_snippet {
		Some(snippet) => Ok(snippet),
		None => Err(io::Error::new(io::ErrorKind::NotFound, "Not found")),
	}
}

// @desc Create a snippet list
// @route POST /snippets
pub async fn create_snippet_list(client: &Client, title: String) -> Result<SnippetList, io::Error> {
	let query_statement = generate_query_statement(
		client,
		"INSERT INTO snippet_list (title) VALUES ($1) RETURNING id, title",
	)
	.await;

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

// @desc Delete snippet list by id
// @route DELETE /snippets/:snippet_list_id
pub async fn delete_snippet_list(client: &Client, list_id: i32) -> () {
	let query_statement =
		generate_query_statement(client, "DELETE FROM snippet_list WHERE id = $1 ").await;

	client
		.query_opt(&query_statement, &[&list_id])
		.await
		.expect("Error deleting snippet list");
}

/*
** Snippet Item
*/

// @desc Get all snippet items for a snippet list
// @route GET /snippets/:snipet_list_id/items
pub async fn get_snippet_items(
	client: &Client,
	list_id: i32,
) -> Result<Vec<SnippetItem>, io::Error> {
	let query_statement = generate_query_statement(
		client,
		"SELECT * FROM snippet_item WHERE list_id = $1 ORDER BY id",
	)
	.await;

	let snippet_items = client
		.query(&query_statement, &[&list_id])
		.await
		.expect("Error fetching snippet item")
		.iter()
		.map(|row| SnippetItem::from_row_ref(row).unwrap())
		.collect::<Vec<SnippetItem>>();
	Ok(snippet_items)
}

// @desc Get a snippet item by id
// @route GET /snippets/:snipet_list_id/items/:snippet_item_id
pub async fn get_snippet_item(
	client: &Client,
	list_id: i32,
	item_id: i32,
) -> Result<SnippetItem, io::Error> {
	let query_statement = generate_query_statement(
		client,
		"SELECT * FROM snippet_item WHERE list_id = $1 and id = $2",
	)
	.await;

	let maybe_item = client
		.query_opt(&query_statement, &[&list_id, &item_id])
		.await
		.expect("Error fetching snippet item")
		.map(|row| SnippetItem::from_row_ref(&row).unwrap());

	match maybe_item {
		Some(item) => Ok(item),
		None => Err(io::Error::new(io::ErrorKind::NotFound, "Not found")),
	}
}

// @desc Create a snippet item
// @route POST /snippet/:snippet_list_id/items
pub async fn create_snippet_item(
	client: &Client,
	list_id: i32,
	title: String,
) -> Result<SnippetItem, io::Error> {
	let query_statement = generate_query_statement(
		client,
		"INSERT INTO snippet_item (list_id, title) VALUES ($1, $2) RETURNING id, title, code, list_id",
	)
	.await;

	client
		.query(&query_statement, &[&list_id, &title])
		.await
		.expect("Error creating snippet item")
		.iter()
		.map(|row| SnippetItem::from_row_ref(row).unwrap())
		.collect::<Vec<SnippetItem>>()
		.pop()
		.ok_or(io::Error::new(
			io::ErrorKind::Other,
			"Error creating snippet item",
		))
}

// @desc Edit a snippet item
// @route PUT /snippets/:snipet_list_id/items/:snippet_item_id
pub async fn update_snippet_item(
	client: &Client,
	list_id: i32,
	item_id: i32,
	title: Option<String>,
	code: Option<String>,
) -> Result<SnippetItem, io::Error> {
	// @TODO - handle missing optional fields gracefully
	let query_statement = generate_query_statement(
		client,
		"UPDATE snippet_item SET code = $1, title = $2 
		WHERE list_id = $3 and id = $4 RETURNING list_id, title, id, code",
	)
	.await;

	let maybe_item = client
		.query_opt(&query_statement, &[&code, &title, &list_id, &item_id])
		.await
		.expect("Error updating snippet item")
		.map(|row| SnippetItem::from_row_ref(&row).unwrap());

	match maybe_item {
		Some(item) => Ok(item),
		None => Err(io::Error::new(io::ErrorKind::NotFound, "Not found")),
	}
}

// @desc Delete snippet item by id
// @route DELETE /snippets/:snippet_list_id/items/:snippet_item_id
pub async fn delete_snippet_item(
	client: &Client,
	list_id: i32,
	item_id: i32,
) -> Result<(), io::Error> {
	let query_statement = generate_query_statement(
		client,
		"DELETE FROM snippet_item WHERE list_id = $1 and id = $2",
	)
	.await;

	let deletion = client
		.query_opt(&query_statement, &[&list_id, &item_id])
		.await
		.expect("Error deleting snippet item");

	match deletion {
		Some(_) => Ok(()),
		None => Err(io::Error::new(io::ErrorKind::NotFound, "Not found")),
	}
}
