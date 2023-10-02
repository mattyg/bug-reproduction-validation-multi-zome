use hdk::prelude::*;
use holochain::test_utils::consistency_10s;
use holochain::{conductor::config::ConductorConfig, sweettest::*};
use valid_integrity::*;


#[tokio::test(flavor = "multi_thread")]
async fn create_then_delete_post_test() {
    // Use prebuilt dna file
    let dna_path = std::env::current_dir()
        .unwrap()
        .join("../../../workdir/posts.dna");
    let dna = SweetDnaFile::from_bundle(&dna_path).await.unwrap();

    // Set up conductors
    let mut conductors = SweetConductorBatch::from_config(2, ConductorConfig::default()).await;
    let apps = conductors.setup_app("demo", &[dna]).await.unwrap();
    conductors.exchange_peer_info().await;

    let ((alice,), (bob,)) = apps.into_tuples();
    
    // Alice creates a post
    let record: Record = alice
        .call( alice.zome("valid"), "create_post", Post { body: "My Post".to_string()})
        .await;

    // Alice deletes the post
    let delete_action_hash: ActionHash = alice
      .call( alice.zome("valid"), "delete_post", record.action_address())
      .await;
}
