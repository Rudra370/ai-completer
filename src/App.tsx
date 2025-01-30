/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import Settings from './assets/settings.svg';
import SettingDialog from './components/dialog/settings';
import { useQueryParams } from './hooks/params';
import { GeminiSingleton } from './services/gemini';


function App() {
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState('');
  const [suggestion, setSuggestion] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { set } = useQueryParams();


  // Handle key events for accepting suggestion
  const handleKeyDown = (e: any) => {
    if ((e.ctrlKey || e.metaKey) && e.key === ".") {
      // accpet next word from suggestion
      e.preventDefault();
      let updatedValue = value;
      let updatedSuggestion = suggestion;
      for (let i = 0; i < suggestion.length; i++) {
        if (suggestion.charAt(i) === ' ' && i !== 0) {
          break;
        }
        updatedValue += suggestion.charAt(i);
        updatedSuggestion = suggestion.slice(i + 1);
      }
      setValue(updatedValue);
      setSuggestion(updatedSuggestion);
    }


    if (e.shiftKey && e.key === "Tab") {
      e.preventDefault();
      setSuggestion("");
      updateSuggestion(debouncedValue);
      return;
    }

    if (e.key === "Tab" && suggestion) {
      e.preventDefault(); // Prevent default tab behavior
      setValue(value + suggestion);
      setSuggestion(""); // Clear suggestion
      return;
    }

  };

  const onChange = async (e: any) => {
    setSuggestion("");
    setValue(e.target.value);
  }

  const updateSuggestion = async (text: string) => {
    if (debouncedValue.length < 3) return;

    let suggestion = await GeminiSingleton.getAutcomplete(text);
    if (!suggestion) return;
    if (debouncedValue.endsWith(" ") && suggestion.startsWith(" ")) {
      suggestion = suggestion.trimStart();
    }
    if (suggestion.endsWith("\n")) {
      // Check if the suggestion contains multiple lines. If not, remove the trailing newline.
      if (!suggestion.trim().includes("\n")) {
        suggestion = suggestion.trimEnd();
      }
    }
    if (suggestion.endsWith(".")) {
      suggestion = suggestion + " ";
    }
    setSuggestion(suggestion);
  };

  useEffect(() => {
    if (suggestion !== "") return;
    updateSuggestion(debouncedValue);
  }, [debouncedValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value); // Update debounced query after delay
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer); // Cleanup the timeout on each change
  }, [value]);

  return (
    <div
      style={{
        width: "90%",
        height: "90%",
        position: "relative",
      }}
    >
      <div className='row'>
        <div className='suggestion'>
          <p className='text'>
            {suggestion}
          </p>
          <p className='help'>
            {"tab -> accept"} <br /> {"ctrl + . -> accept next word"} <br /> {"shift + tab -> refresh suggestion"}
          </p>
        </div>
        <img
          className='settings' src={Settings}
          alt="settings"
          onClick={() => set("settings", "1")} />
      </div>
      <div style={{ height: "10px" }}></div>
      <textarea
        placeholder='Start typing...'
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        style={{
          padding: "8px",
          width: "100%",
          height: "90%",
        }}
      ></textarea>
      <SettingDialog />
    </div>
  );
};

export default App;
