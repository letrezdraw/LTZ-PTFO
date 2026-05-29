import { useState, useEffect } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

const randomChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

export const useTextScramble = (text, enabled = false, duration = 200) => {
  const [displayedText, setDisplayedText] = useState(text);

  useEffect(() => {
    if (!enabled) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayedText(text);
      return;
    }

    let frame = 0;
    const frames = Math.ceil(duration / 16); // ~60fps

    const interval = setInterval(() => {
      if (frame < frames) {
        const scrambled = text
          .split('')
          .map((char, index) => {
            const charIndex = Math.floor(index * (frames - frame) / frames);
            return charIndex > 0 ? randomChar() : char;
          })
          .join('');
        setDisplayedText(scrambled);
        frame++;
      } else {
        setDisplayedText(text);
        clearInterval(interval);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [enabled, text, duration]);

  return displayedText;
};
