const LoadingSurahPage = () => {
  return (
    <div className="space-y-6">
      <div className="glass-card h-52 animate-pulse-glass p-6 sm:p-8" />
      <div className="glass-card h-28 animate-pulse-glass p-6" />
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`loading-verse-${index}`}
            className="glass-card h-44 animate-pulse-glass p-4 sm:p-6"
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingSurahPage;
