use hdk::prelude::*;
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
    let mut conductor: SweetConductor = SweetConductor::from_config(ConductorConfig::default()).await;
    let app = conductor.setup_app("demo", &[dna]).await.unwrap();
    let (alice,) = app.into_tuple();
    
    // Alice creates a post
    let record: Record = conductor
        .call(&alice.zome("valid"), "create_post", Post { body: "My Post".to_string()})
        .await;

    // Alice deletes the post
    let _delete_action_hash: ActionHash = conductor
        .call(&alice.zome("valid"), "delete_post", record.action_address())
        .await;
}
