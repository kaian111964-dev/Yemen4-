import React, { useState } from 'react';
import { X, CheckCircle, BarChart3, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PollsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { poll, votePoll, triggerToast } = useApp();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [voted, setVoted] = useState(false);

  const pollData = poll || {
    question: 'كيف تقيم تغطية قناة يمن 4 HD للأحداث والتطورات الوطنية والإقليمية؟',
    totalVotes: 18420,
    options: [
      { id: 0, label: 'ممتازة واحترافية جداً', votes: 12150, percent: 66 },
      { id: 1, label: 'جيدة جداً ومتابعة أولاً بأول', votes: 4230, percent: 23 },
      { id: 2, label: 'متوسطة وتحتاج للمزيد من الميدانيات', votes: 1420, percent: 8 },
      { id: 3, label: 'ضعيفة', votes: 620, percent: 3 },
    ]
  };

  const handleVote = () => {
    if (selectedOption === null) return;
    votePoll(selectedOption);
    setVoted(true);
    triggerToast('تم تسجيل صوتك بنجاح', 'شكراً لمشاركتك في استطلاع رأي قناة يمن 4 HD.', 'system');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#0e1726] border border-slate-700/90 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-right">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-4 text-pink-400 font-extrabold text-sm border-b border-slate-800 pb-3">
          <MessageSquare className="w-5 h-5" />
          <span>استطلاع رأي الجمهور</span>
        </div>

        <h3 className="text-base font-black text-slate-100 leading-snug mb-5">
          {pollData.question}
        </h3>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {pollData.options.map((opt) => (
            <div
              key={opt.id}
              onClick={() => !voted && setSelectedOption(opt.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                selectedOption === opt.id
                  ? 'border-pink-500 bg-pink-950/30'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              {voted && (
                <div
                  className="absolute inset-y-0 right-0 bg-pink-600/20 transition-all duration-1000 rounded-xl"
                  style={{ width: `${opt.percent}%` }}
                ></div>
              )}

              <div className="relative flex items-center justify-between text-xs font-bold text-slate-200">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedOption === opt.id ? 'border-pink-500 bg-pink-500 text-white' : 'border-slate-600'
                  }`}>
                    {selectedOption === opt.id && <CheckCircle className="w-3 h-3" />}
                  </div>
                  <span>{opt.label}</span>
                </div>

                {voted && (
                  <span className="text-pink-400 font-mono text-sm">{opt.percent}%</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        {!voted ? (
          <button
            onClick={handleVote}
            disabled={selectedOption === null}
            className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all disabled:opacity-50"
          >
            تصويت الآن
          </button>
        ) : (
          <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-2 bg-slate-900 p-3 rounded-xl border border-slate-800">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>إجمالي الأصوات: {pollData.totalVotes.toLocaleString('ar-YE')} صوت</span>
          </div>
        )}
      </div>
    </div>
  );
};
