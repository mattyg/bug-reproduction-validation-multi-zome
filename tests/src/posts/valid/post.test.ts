import { assert, test } from "vitest";

import { runScenario, pause, CallableCell } from '@holochain/tryorama';
import { NewEntryAction, ActionHash, Record, AppBundleSource, fakeDnaHash, fakeActionHash, fakeAgentPubKey, fakeEntryHash } from '@holochain/client';
import { decode } from '@msgpack/msgpack';

import { createPost, samplePost } from './common.js';

test('create and delete Post', async () => {
  await runScenario(async scenario => {
    // Construct proper paths for your app.
    // This assumes app bundle created by the `hc app pack` command.
    const testAppPath = process.cwd() + '/../workdir/bug-reproduction-template.happ';

    // Set up the app to be installed 
    const appSource = { appBundleSource: { path: testAppPath } };

    // Add 2 players with the test app to the Scenario. The returned players
    // can be destructured.
    const [alice, bob] = await scenario.addPlayersWithApps([appSource, appSource]);

    // Shortcut peer discovery through gossip and register all agents in every
    // conductor of the scenario.
    await scenario.shareAllAgents();

    // Alice creates a Post
    const record: Record = await createPost(alice.cells[0]);
    assert.ok(record);
        
    // Alice deletes the Post
    const deleteActionHash = await alice.cells[0].callZome({
      zome_name: "valid",
      fn_name: "delete_post",
      payload: record.signed_action.hashed.hash,
    });
    assert.ok(deleteActionHash);
  });
});

test('create and delete link', async () => {
  await runScenario(async scenario => {
    // Construct proper paths for your app.
    // This assumes app bundle created by the `hc app pack` command.
    const testAppPath = process.cwd() + '/../workdir/bug-reproduction-template.happ';

    // Set up the app to be installed 
    const appSource = { appBundleSource: { path: testAppPath } };

    // Add 2 players with the test app to the Scenario. The returned players
    // can be destructured.
    const [alice, bob] = await scenario.addPlayersWithApps([appSource, appSource]);

    // Shortcut peer discovery through gossip and register all agents in every
    // conductor of the scenario.
    await scenario.shareAllAgents();

    // Alice creates a link
    const actionHash = await alice.cells[0].callZome({
      zome_name: "valid",
      fn_name: "create_demo_link",
      payload: null,
    });
    assert.ok(actionHash);
        
    // Alice deletes the link
    const deleteActionHash = await alice.cells[0].callZome({
      zome_name: "valid",
      fn_name: "delete_demo_link",
      payload: actionHash,
    });
    assert.ok(deleteActionHash);
  });
});
