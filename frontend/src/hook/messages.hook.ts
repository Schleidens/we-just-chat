import { useState, useEffect } from 'react';

const useMessagesScroll = (
  scrollableNodeRef: any,
  messages: any,
  wrapperClassName = '.simplebar-content-wrapper',
  contentClassName = '.simplebar-content'
) => {
  const [lockAutoScroll, setLockAutoScroll] = useState(false);
  const [scrollMax, setScrollMax] = useState(true);

  const scrollToBottom = () => {
    if (scrollMax || lockAutoScroll) {
      if (scrollableNodeRef.current) {
        const scrollerWrapper =
          scrollableNodeRef.current.querySelector(wrapperClassName);
        const simpleBarContent =
          scrollerWrapper.querySelector(contentClassName);
        if (simpleBarContent) {
          scrollerWrapper.scrollTop =
            simpleBarContent.getBoundingClientRect?.()?.height;
        }
      }
    }
  };

  useEffect(() => {
    if (scrollableNodeRef.current && !lockAutoScroll) {
      const scrollerWrapper =
        scrollableNodeRef.current.querySelector(wrapperClassName);
      if (!scrollerWrapper) return;

      const onScroll = () => {
        const chatLog = scrollerWrapper as HTMLDivElement;
        const maxScroll = chatLog.scrollHeight - chatLog.clientHeight;
        const scrollTop = chatLog.scrollTop;
        setScrollMax(Math.round(scrollTop) >= maxScroll - 8);
      };

      scrollerWrapper?.addEventListener?.('wheel', onScroll);
      scrollerWrapper?.addEventListener?.('scroll', onScroll);
      scrollToBottom();

      return () => {
        scrollerWrapper?.removeEventListener?.('wheel', onScroll);
        scrollerWrapper?.removeEventListener?.('scroll', onScroll);
      };
    } else {
      scrollToBottom();
    }
  }, [scrollableNodeRef.current, messages, scrollMax, lockAutoScroll]);

  return {
    lockAutoScroll,
    setLockAutoScroll,
    scrollMax,
  };
};

export default {
  useMessagesScroll,
};
