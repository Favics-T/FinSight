import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { CiSearch } from 'react-icons/ci';
import { globalAssetSearch } from '../../services/search.service';
import { useDebounce } from '../../hooks/useDebounce';

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function HighlightText({ text, query }) {
  if (!query.trim()) return <>{text}</>;
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'ig');
  const parts = String(text).split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark key={index} className="bg-blue-500/40 text-white rounded px-0.5">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}

export function GlobalSearchModal() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const debouncedInput = useDebounce(input, 300);
  const inputRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const onHotkey = (event) => {
      const isCmdK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      if (!isCmdK) return;
      event.preventDefault();
      setOpen(true);
    };

    window.addEventListener('keydown', onHotkey);
    return () => window.removeEventListener('keydown', onHotkey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 10);
    return () => clearTimeout(timer);
  }, [open]);

  const { data, isFetching } = useQuery({
    queryKey: ['global-asset-search', debouncedInput],
    queryFn: () => globalAssetSearch(debouncedInput),
    enabled: open && debouncedInput.trim().length >= 2,
    staleTime: 10_000,
  });

  const groupedResults = useMemo(
    () => data || { stocks: [], crypto: [] },
    [data]
  );

  const flatResults = useMemo(
    () => [...groupedResults.stocks, ...groupedResults.crypto],
    [groupedResults]
  );

  useEffect(() => {
    setActiveIndex(flatResults.length ? 0 : -1);
  }, [debouncedInput, flatResults.length]);

  const activeItem = activeIndex >= 0 ? flatResults[activeIndex] : null;

  const closeModal = () => {
    setOpen(false);
    setInput('');
    setActiveIndex(-1);
  };

  const selectItem = (item) => {
    if (!item) return;
    navigate(item.href);
    closeModal();
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal();
      return;
    }

    if (!flatResults.length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % flatResults.length);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) => (prev - 1 + flatResults.length) % flatResults.length);
      return;
    }

    if (event.key === 'Enter' && activeItem) {
      event.preventDefault();
      selectItem(activeItem);
    }
  };

  const renderSection = (title, items, offset) => (
    <section aria-label={title}>
      <p className="text-xs uppercase tracking-wider text-muted px-3 py-2">{title}</p>
      <ul role="group" className="space-y-1">
        {items.map((item, index) => {
          const absoluteIndex = offset + index;
          const isActive = absoluteIndex === activeIndex;
          return (
            <li key={item.id} role="none">
              <button
                type="button"
                id={`global-search-option-${absoluteIndex}`}
                role="option"
                aria-selected={isActive}
                className={`w-full text-left px-3 py-2 rounded-lg border transition ${
                  isActive
                    ? 'bg-blue-500/20 border-blue-400/40'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
                onMouseEnter={() => setActiveIndex(absoluteIndex)}
                onClick={() => selectItem(item)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    {item.thumb ? (
                      <img src={item.thumb} alt={item.title} className="w-5 h-5 rounded-full" />
                    ) : (
                      <span className="h-5 w-5 rounded-full bg-blue-500/30" />
                    )}
                    <div className="min-w-0">
                      <p className="font-medium truncate">
                        <HighlightText text={item.title} query={debouncedInput} />
                      </p>
                      <p className="text-xs text-muted truncate">
                        <HighlightText text={item.symbol} query={debouncedInput} />
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted">{item.subtitle}</span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 px-2.5 md:px-3 py-1.5 text-xs"
        aria-label="Open global search"
      >
        <CiSearch className="text-base" />
        <span className="hidden md:inline">Search</span>
        <kbd className="hidden md:inline text-[10px] text-muted">Ctrl+K</kbd>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            aria-hidden="true"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="global-search-title"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.16 }}
              className="max-w-2xl w-[92%] mx-auto mt-[10vh] glass rounded-2xl border border-white/15 p-3"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 id="global-search-title" className="sr-only">Global asset search</h2>

              <div className="relative mb-3">
                <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-blue-200" />
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded={flatResults.length > 0}
                  aria-controls="global-search-results"
                  aria-activedescendant={
                    activeIndex >= 0 ? `global-search-option-${activeIndex}` : undefined
                  }
                  placeholder="Search stocks and crypto..."
                  className="w-full rounded-xl border border-white/15 bg-white/5 pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div
                id="global-search-results"
                role="listbox"
                aria-label="Search results"
                className="max-h-[55vh] overflow-y-auto pr-1 space-y-2"
              >
                {debouncedInput.trim().length < 2 ? (
                  <p className="text-sm text-muted px-2 py-3">Type at least 2 characters...</p>
                ) : isFetching ? (
                  <p className="text-sm text-muted px-2 py-3">Searching markets...</p>
                ) : flatResults.length === 0 ? (
                  <p className="text-sm text-muted px-2 py-3">No assets found.</p>
                ) : (
                  <>
                    {groupedResults.stocks.length
                      ? renderSection('Stocks', groupedResults.stocks, 0)
                      : null}
                    {groupedResults.crypto.length
                      ? renderSection('Crypto', groupedResults.crypto, groupedResults.stocks.length)
                      : null}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default GlobalSearchModal;
