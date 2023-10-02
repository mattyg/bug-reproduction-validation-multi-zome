import { CallableCell } from '@holochain/tryorama';
import { NewEntryAction, ActionHash, Record, AppBundleSource, fakeActionHash, fakeAgentPubKey, fakeEntryHash, fakeDnaHash } from '@holochain/client';



export async function samplePost(cell: CallableCell, partialPost = {}) {
    return {
        ...{
	  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        },
        ...partialPost
    };
}

export async function createPost(cell: CallableCell, post = undefined): Promise<Record> {
    return cell.callZome({
      zome_name: "valid",
      fn_name: "create_post",
      payload: post || await samplePost(cell),
    });
}

