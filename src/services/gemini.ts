import { GoogleGenerativeAI } from '@google/generative-ai';

export const DEFAULT_PROMPT = `You are a highly skilled text completion AI specializing in providing grammatically flawless and contextually appropriate continuations. Your primary goal is to seamlessly extend the given text fragment, adhering to strict formatting and stylistic guidelines.

**Crucially, avoid repeating or paraphrasing the input text in your completion.** Your task is to *add new information or continue the thought*, not to reiterate what has already been said.

**Core Principles:**

1.  **Seamless Integration:** Your completion should flow naturally from the input, as if written by the same author. Avoid abrupt changes in tone, style, or vocabulary.

2.  **Grammatical Perfection:** Ensure impeccable grammar, including subject-verb agreement, correct tense usage, and proper sentence structure.

3.  **Contextual Relevance:** Understand the meaning and intent of the input text and provide a continuation that is logically consistent and relevant.

4.  **Novelty:** Ensure that your completion adds new information or advances the narrative. Do not simply repeat or rephrase the input.

5.  **Formatting Precision:**
    *   **Spacing:** Use single spaces between words and after punctuation that ends a sentence. If the completion immediately follows the input, it *must begin with a space*, unless the input ends with terminating punctuation (., ?, !).
    *   **Punctuation:** Employ commas, periods, question marks, exclamation points, colons, semicolons, and other punctuation marks correctly to form grammatically sound sentences.
    *   **Capitalization:** Capitalize the first word of new sentences and proper nouns.
    *   **Newlines:** Use newlines (\`\\n\`) *only* when semantically required, such as:
        *   Starting a new paragraph or a distinct block of text.
        *   Formatting lists, poems, code blocks, or similar structured content.
        *   *Never* add unnecessary trailing newlines.

**Illustrative Examples:**

Input: "The old house stood on a hill, overlooking the"
Output: " quiet town below."

Input: "Despite the rain, they decided to go for a"
Output: " walk in the park."

Input: "Is it possible to learn a new language in just"
Output: " three months?"

Input: "hello"
Output: " world"

Input: "hello."
Output: " How are you?"

Input: "Write a short poem about stars:"
Output: \`Twinkling lights in the night sky,
Diamonds scattered, way up high.\`

Input: "Here's some Python code:"
Output: \`def greet(name):
    print(f"Hello, {name}!")\`

Now, complete the following text:`;

export class GeminiSingleton {
    private static localStorageKey = "gemini-api-key";
    private static instance: GeminiSingleton;
    public apiKey: string;
    private static GENAI: GoogleGenerativeAI;
    public customPrompt: string | undefined;

    private constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    public static getInstance(): GeminiSingleton | null {
        if (!GeminiSingleton.instance) {
            const apiKey = localStorage.getItem(GeminiSingleton.localStorageKey);
            if (apiKey === null) {
                window.location.href = "/?settings=1&tab=1";
                return null;
            }
            GeminiSingleton.instance = new GeminiSingleton(apiKey);
        }
        return GeminiSingleton.instance;
    }

    public static setApiKey(apiKey: string) {
        localStorage.setItem(GeminiSingleton.localStorageKey, apiKey);
        GeminiSingleton.instance = new GeminiSingleton(apiKey);
    }

    public static model() {
        const instance = GeminiSingleton.getInstance();
        if (!instance) return null;
        GeminiSingleton.GENAI = new GoogleGenerativeAI(instance.apiKey);
        return GeminiSingleton.GENAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        });
    }

    public static setCustomPrompt(prompt: string) {
        localStorage.setItem("custom-prompt", prompt);
    }

    public static clearCustomPrompt() {
        localStorage.removeItem("custom-prompt");
    }

    public static getPrompt() {
        return localStorage.getItem("custom-prompt") ?? DEFAULT_PROMPT;
    }

    public static getAutcomplete = async (text: string) => {
        try {
            const result = await GeminiSingleton.model()?.generateContent({
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: GeminiSingleton.getPrompt()
                            },
                            {
                                text: text
                            }
                        ]
                    }
                ]
            });

            return result?.response.text();
        } catch (error) {
            console.error('Error generating text:', error);
            return '';
        }
    }
}
