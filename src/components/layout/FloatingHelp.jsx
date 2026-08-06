import { useEffect, useRef, useState } from 'react';
import { FiX, FiSend, FiCpu } from 'react-icons/fi';
import { Bot } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAIChat } from '../../hooks/useAIChat';
import './FloatingHelp.css';
import { useHideOnFooter } from '../../hooks/useHideOnFooter';

const SUGGESTIONS = [
  'Compare the challenges',
  'Which reward is cheapest?',
  'How do I earn points?',
];

export default function FloatingHelp() {
  const [open, setOpen] = useState(false);
  const chatRef = useRef(null);
  const [input, setInput] = useState('');
  const { messages, sendMessage, isLoading } = useAIChat();
  const listRef = useRef(null);
  const footerVisible = useHideOnFooter();

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    function handleOutsideClick(e) {
      if (
        chatRef.current &&
        !chatRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  }

  return (
    <div
      ref={chatRef}
      className={`fhelp ${footerVisible && !open ? 'fhelp--hidden' : ''}`}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            className="fhelp__panel glass"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
          >
            <div className="fhelp__head">
              <span className="fhelp__badge"><FiCpu /></span>
              <div>
                <h4>CivicPlay Assistant</h4>
                <p className="fhelp__sub">Ask about challenges &amp; rewards</p>
              </div>
            </div>

            <div className="fhelp__messages" ref={listRef}>
              {messages.map((m, i) => (
                <div key={i} className={`fhelp__msg fhelp__msg--${m.role}`}>
                  {m.content}
                </div>
              ))}
              {isLoading && (
                <div className="fhelp__msg fhelp__msg--assistant fhelp__typing">
                  <span></span><span></span><span></span>
                </div>
              )}
            </div>

            {messages.length < 2 && (
              <div className="fhelp__suggestions">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => sendMessage(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form className="fhelp__form" onSubmit={handleSubmit}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                aria-label="Ask the CivicPlay Assistant"
              />
              <button type="submit" aria-label="Send" disabled={isLoading || !input.trim()}>
                <FiSend />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <button className="fhelp__btn" onClick={() => setOpen((o) => !o)} aria-label="Help">
        {open ? <FiX /> : <Bot />}
      </button>
    </div>
  );
}