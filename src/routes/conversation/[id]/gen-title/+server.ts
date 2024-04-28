import { authCondition } from "$lib/server/auth";
import { collections } from "$lib/server/database";
import { defaultModel } from "$lib/server/models";
import { ObjectId } from "mongodb";
import { error } from "@sveltejs/kit";
import { genTitle } from "$lib/server/title/genTitle";


export async function POST({ params, locals, url }) {
	const convId = new ObjectId(params.id);
	const conversation = await collections.conversations.findOne({
		_id: convId,
		...authCondition(locals),
	});

	if (!conversation) {
		throw error(404, "Conversation not found");
	}
	const firstMessage = conversation.messages.find((m) => m.from === "user");
	const secondMessage = conversation.messages.find((m) => m.from === "assistant");
    let title = conversation.title;
    if(typeof firstMessage != 'undefined' && typeof secondMessage != 'undefined') {
        title = await genTitle(firstMessage.content, secondMessage.content);
        if (title) {
            await collections.conversations.updateOne(
                {
                    _id: convId,
                    ...authCondition(locals),
                },
                {
                    $set: { title: title },
                }
            );
        }
    
    }

    return new Response(
		JSON.stringify(
			title
				? {
						title: title,
				  }
				: {}
		),
		{ headers: { "Content-Type": "application/json" } }
	);

}