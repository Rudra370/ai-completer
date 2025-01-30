import { useRef } from "react";
import Collapsable from "../collapsable/collapsable";
import "./settings.css";
import { useQueryParams } from "../../hooks/params";
import { GeminiSingleton } from "../../services/gemini";

export default function SettingDialog() {
    const { get, remove, navigate } = useQueryParams();
    const apiKeyref = useRef<HTMLInputElement>(null);
    const promptref = useRef<HTMLTextAreaElement>(null);

    const onAPIKeySave = () => {
        if (!apiKeyref.current) return;
        if (apiKeyref.current.value === "") return;
        GeminiSingleton.setApiKey(apiKeyref.current.value);
        navigate("/");
    }

    const onPromptSave = () => {
        if (!promptref.current) return;
        GeminiSingleton.setCustomPrompt(promptref.current.value);
        navigate("/");
    }

    const onClearPrompt = () => {
        GeminiSingleton.clearCustomPrompt();
        navigate("/");
    }

    if (get("settings") !== "1") return null;
    return (
        <>
            <div className="bg" onClick={() => remove("settings")}>
            </div>
            <div className="content">
                <Collapsable title="GEMINI API Key" tabNumber={1}>
                    <div>
                        <p className="subtitle">
                            {"->"} <strong>To use the Application you need to provide your Gemini API Key.</strong>
                        </p>
                        <p className="subtitle">
                            {"->"} Your API Key is <strong>stored securely on your device</strong> in local storage. You can delete it at any time.
                        </p>
                        <p className="subtitle">
                            {"->"} Gemini offers <strong>free API keys</strong> for personal use. You can create one from <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer">here</a>.
                        </p>
                        <p className="subtitle">
                            {"->"} You might see error details in the console if the API Key is incorrect.
                        </p>
                        <div className="row">
                            <input
                                defaultValue={GeminiSingleton.getInstance()?.apiKey}
                                ref={apiKeyref}
                                type="password"
                                placeholder="GEMINI API Key"
                            />
                            <button onClick={onAPIKeySave}>Save</button>
                        </div>
                    </div>
                </Collapsable>
                <Collapsable title="Custom Prompt" tabNumber={2}>
                    <div>
                        <p className="subtitle">
                            {"->"} <strong>Customize the prompt</strong> that the AI uses to generate text.
                        </p>
                        <p className="subtitle">
                            {"->"} Your input text will be inserted at the end of the prompt.
                        </p>
                        <textarea
                            ref={promptref}
                            className="prompt_textarea"
                            defaultValue={GeminiSingleton.getPrompt()}
                            placeholder="Custom Prompt"
                        />
                        <div className="prompt_buttons">
                            <button onClick={onPromptSave}>Save</button>
                            <button className="reset" onClick={onClearPrompt}>Reset</button>
                        </div>
                    </div>
                </Collapsable>
            </div>
        </>
    )
}
