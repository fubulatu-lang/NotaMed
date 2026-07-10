import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

interface UseClipboardReturn {
  copyToClipboard: (text: string, label?: string) => Promise<void>;
  isCopied: boolean;
}

export function useClipboard(): UseClipboardReturn {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string, label?: string) => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }

      setIsCopied(true);
      toast.success(`${label || 'Text'} copied to clipboard!`);
      
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
      console.error('Clipboard error:', error);
    }
  }, []);

  return { copyToClipboard, isCopied };
}
