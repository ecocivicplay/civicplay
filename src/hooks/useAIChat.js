import { useCallback, useState } from 'react';
import { askAIHelp } from '../utils/groqClient';

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: "Hi! I'm the CivicPlay Assistant 👋 Ask me to compare challenges, explain rewards, or anything else about the app.",
};

export function useAIChat() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const historyForApi = messages
        .filter((m) => m !== WELCOME_MESSAGE)
        .slice(-6);

      setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
      setIsLoading(true);

      try {
        const reply = await askAIHelp(trimmed, historyForApi);
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      } catch (err) {
        const fallback =
          err.message === 'MISSING_KEY'
            ? "I can't reach my AI brain yet — add VITE_GROQ_API_KEY to a .env.local file and restart the dev server."
            : "Sorry, I'm having trouble connecting right now. Please try again in a moment.";
        setMessages((prev) => [...prev, { role: 'assistant', content: fallback }]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading]
  );

  return { messages, sendMessage, isLoading };
}