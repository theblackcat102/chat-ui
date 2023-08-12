import { HF_ACCESS_TOKEN } from "$env/static/private";
import { HfInference } from "@huggingface/inference";
import { generateFromDefaultEndpoint } from "../generateFromDefaultEndpoint";
import { defaultModel } from "$lib/server/models";

export async function genTitle(question: string, answer: string) {
	// if HF_ACCESS_TOKEN is set, we use a HF dedicated endpoint for summarization
	try {
		if (HF_ACCESS_TOKEN) {
            console.log('use hf');
			const title = (
				await new HfInference(HF_ACCESS_TOKEN).textGeneration({
					model: "theblackcat102/alpaca-title-generator-mt0-large",
					inputs: question+'\n'+answer,
					parameters: {
						max_new_tokens: 128,
					},
				})
			).generated_text;
			return title;
		}
	} catch (e) {
		console.log(e);
	}
    const model = defaultModel;
	// else we use the LLM to generate a summary
	const titlePrompt =
		model.userMessageToken +
		question+'\n'+answer +
		model.userMessageEndToken +
		model.userMessageToken +
		`Generate a title for the above conversation the title should not be more than 10 words` +
		model.userMessageEndToken +
		model.assistantMessageToken +
		"Title: ";

	const title = await generateFromDefaultEndpoint(titlePrompt).then((txt: string) =>
		txt.trim()
	);

	return title;
}
