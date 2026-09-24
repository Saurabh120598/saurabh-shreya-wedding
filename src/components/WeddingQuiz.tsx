import { useState } from 'react';
import confetti from 'canvas-confetti';
import { HelpCircle, CheckCircle, RefreshCw, Trophy } from 'lucide-react';
import { weddingAudio } from '../utils/audioPlayer';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'Who made the first move to ask for coffee?',
    options: [
      'Saurabh (after 3 drafts of the message!)',
      'Shreya made the surprise bold move',
      'They texted "Coffee?" at the exact same minute',
    ],
    correctIndex: 0,
    explanation:
      'Saurabh took 3 days and consulted two of his best friends before finally pressing send on that first coffee text!',
  },
  {
    id: 2,
    question: "What is Saurabh & Shreya's ultimate comfort food?",
    options: [
      'Late-night street Kulhad Chai & Bun Makkhan',
      'Authentic Awadhi Dum Biryani',
      'Spicy Momos & Cold Coffee',
    ],
    correctIndex: 0,
    explanation:
      'Roadside Hazratganj Kulhad Chai with extra malai Bun Makkhan is their undisputed romantic midnight tradition.',
  },
  {
    id: 3,
    question: 'Who is most likely to cry first during the sacred Pheras?',
    options: [
      'Saurabh (He gets secretly emotional!)',
      'Shreya (She loves romantic Bollywood moments)',
      'Both of them will be tearing up together in joy',
    ],
    correctIndex: 2,
    explanation:
      'Everyone in the family agrees: both Saurabh & Shreya will definitely shed happy tears during the Jaimala and Pheras!',
  },
];

export function WeddingQuiz() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];
  const hasAnsweredCurrent = selectedAnswers[currentIdx] !== undefined;

  const handleSelectOption = (optIndex: number) => {
    if (hasAnsweredCurrent) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIdx]: optIndex,
    }));

    if (optIndex === currentQ.correctIndex) {
      setScore((s) => s + 1);
      weddingAudio.playChime();
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#FFB6C1', '#FF69B4', '#F59E0B'],
      });
    } else {
      weddingAudio.playPluck(300, 0.2);
    }
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      if (score >= 2) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
        });
      }
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswers({});
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <section className="py-16 md:py-20 bg-[#FFF9F6] border-y border-rose-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-rose-200 rounded-full text-rose-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            Guest Fun &amp; Trivia
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 font-medium">
            How Well Do You Know Saurabh &amp; Shreya?
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Test your couple trivia knowledge before hitting the wedding dance floor!
          </p>
        </div>

        {/* Quiz Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm relative">
          {!quizFinished ? (
            <div className="space-y-6">
              
              {/* Progress counter */}
              <div className="flex items-center justify-between text-xs text-stone-500 pb-3 border-b border-rose-50">
                <span className="font-semibold text-rose-600">
                  Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}
                </span>
                <span className="font-mono text-stone-400">Score: {score}</span>
              </div>

              {/* Question Text */}
              <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900">
                {currentQ.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedAnswers[currentIdx] === idx;
                  const isCorrect = idx === currentQ.correctIndex;
                  const showResult = hasAnsweredCurrent;

                  let optionStyle =
                    'bg-stone-50 hover:bg-rose-50/70 border-stone-200 text-stone-800';

                  if (showResult) {
                    if (isCorrect) {
                      optionStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-medium';
                    } else if (isSelected) {
                      optionStyle = 'bg-red-50 border-red-200 text-red-800';
                    } else {
                      optionStyle = 'bg-stone-50/50 border-stone-100 text-stone-400';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={hasAnsweredCurrent}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${optionStyle}`}
                    >
                      <span>{option}</span>
                      {showResult && isCorrect && (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Answer Explanation & Next Button */}
              {hasAnsweredCurrent && (
                <div className="pt-4 border-t border-stone-100 space-y-3">
                  <div className="p-3 bg-rose-50/70 rounded-xl text-xs text-stone-700 leading-relaxed border border-rose-100">
                    <strong className="text-rose-700">Fun Fact: </strong>
                    {currentQ.explanation}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-medium transition-colors"
                    >
                      {currentIdx < QUIZ_QUESTIONS.length - 1 ? 'Next Question →' : 'See Final Score 🏆'}
                    </button>
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* Finished Card */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                <Trophy className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-serif font-bold text-stone-900">
                  {score === 3
                    ? 'Couple Trivia Champion! 🥇'
                    : score >= 2
                    ? 'Honorary Squad Member! 💖'
                    : 'A Sweet Effort! 🌸'}
                </h3>
                <p className="text-stone-600 text-sm mt-1">
                  You scored <strong className="text-rose-600 font-mono text-base">{score} / {QUIZ_QUESTIONS.length}</strong>! You clearly know Saurabh &amp; Shreya well!
                </p>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-xs font-medium transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Play Again</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
