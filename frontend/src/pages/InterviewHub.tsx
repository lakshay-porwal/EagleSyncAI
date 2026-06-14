import React, { useEffect, useState } from "react";
import { interviewService } from "../services/interviewService";
import { InterviewSession } from "../types";
import { useToast } from "../context/ToastContext";
import { Shield, Sparkles, Plus, Award, ChevronRight, Play, X, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const InterviewHub: React.FC = () => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Active session simulator state
  const [activeTrack, setActiveTrack] = useState<any>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

  const fetchSessions = async () => {
    try {
      const data = await interviewService.getSessions();
      setSessions(data);
    } catch {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const tracks = [
    { title: "Technical Interview", type: "Technical", desc: "Algorithms, structures, logic loops, React frameworks, closures.", color: "from-violet-500/20 to-purple-500/20 text-violet-500" },
    { title: "HR Interview", type: "HR", desc: "Company matching, motivation, growth goals, salary expectations.", color: "from-cyan-500/20 to-teal-500/20 text-cyan-500" },
    { title: "Behavioral Interview", type: "Behavioral", desc: "STAR framework responses, conflict audits, team collaborations.", color: "from-emerald-500/20 to-green-500/20 text-emerald-500" },
    { title: "System Design", type: "System Design", desc: "Concurrency, caches, CDNs, DB partitions, replication loops.", color: "from-rose-500/20 to-orange-500/20 text-rose-500" },
  ];

  const handleStartInterview = async (track: any) => {
    toast("Generating fresh AI questions...", "info");
    try {
      const qData = await interviewService.getQuestionsByType(track.type);
      const qList = qData.map((q: any) => typeof q === "string" ? q : q.question);
      setActiveTrack({
        ...track,
        questions: qList
      });
      setCurrentQuestionIdx(0);
      setAnswers([]);
      setCurrentAnswer("");
    } catch (err) {
      toast("Failed to fetch questions details", "error");
    }
  };

  const handleNextQuestion = () => {
    if (!currentAnswer.trim()) {
      toast("Please type an answer before proceeding", "error");
      return;
    }
    setAnswers([...answers, currentAnswer]);
    setCurrentAnswer("");
    setCurrentQuestionIdx(currentQuestionIdx + 1);
  };

  const handleSubmitInterview = async () => {
    if (!currentAnswer.trim()) {
      toast("Please type an answer to submit", "error");
      return;
    }
    const finalAnswers = [...answers, currentAnswer];
    setIsSubmittingAnswer(true);

    try {
      const result = await interviewService.submitInterviewResults(
        activeTrack.type,
        activeTrack.questions,
        finalAnswers
      );
      toast(`Interview graded: Score ${result.score}%`, "success");
      setActiveTrack(null);
      fetchSessions();
    } catch {
      toast("Failed to submit interview details", "error");
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 py-6 animate-pulse text-left">
        <div className="h-8 bg-muted rounded-xl w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left py-4 relative">
      {/* Header & Avatar Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-border/20 pb-5">
        <div className="lg:col-span-8 flex flex-col text-left">
          <h1 className="text-3xl font-extrabold mb-1.5 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-500 dark:from-violet-400 dark:to-fuchsia-400">
            Interview Hub
          </h1>
          <p className="text-muted-foreground text-sm font-semibold max-w-xl leading-relaxed">
            Train on technical, STAR behavioral, and cloud layout mocks. Select an evaluation track below to spawn your interactive AI Coach and receive live scoring logs.
          </p>
        </div>

        {/* AI Hologram Coach Avatar Asset */}
        <div className="lg:col-span-4 flex justify-center">
          <div className="relative w-full max-w-xs rounded-3xl border border-violet-500/20 glass shadow-xl p-2 group hover:scale-[1.02] transition-transform duration-500">
            <div className="rounded-2xl overflow-hidden aspect-video">
              <img
                src="/interview_avatar.png"
                alt="AI Interview Coach Hologram"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none rounded-3xl" />
          </div>
        </div>
      </div>

      {/* Tracks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {tracks.map((tr) => (
          <div
            key={tr.type}
            className="glass rounded-3xl border border-border/60 p-5 flex flex-col justify-between hover:border-violet-500/15 hover:shadow-md transition-all group"
          >
            <div className="text-left mb-6">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${tr.color} flex items-center justify-center border border-border/20 mb-4`}>
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm mb-1.5 text-foreground">{tr.title}</h3>
              <p className="text-muted-foreground text-[11px] leading-relaxed">{tr.desc}</p>
            </div>
            
            <button
              onClick={() => handleStartInterview(tr)}
              className="w-full py-2.5 rounded-xl bg-secondary/80 hover:bg-violet-600 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Start Mock</span>
            </button>
          </div>
        ))}
      </div>

      {/* Previous Scores & Logs */}
      <div className="glass rounded-3xl border border-border/60 overflow-hidden flex flex-col mt-4">
        <div className="p-5 border-b border-border/40 flex items-center justify-between">
          <h3 className="font-extrabold text-base">Previous Grading Archives</h3>
          <span className="text-[10px] text-muted-foreground font-bold uppercase">Feedback Records</span>
        </div>
        <div className="divide-y divide-border/40">
          {sessions.length > 0 ? (
            sessions.map((sess) => (
              <div key={sess.id} className="p-5 flex flex-col sm:flex-row justify-between items-start gap-4 hover:bg-secondary/10 transition-colors">
                <div className="text-left flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-extrabold text-sm text-foreground">{sess.type} Mock</span>
                    <span className="text-[10px] text-muted-foreground font-semibold">{sess.date}</span>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed max-w-2xl font-medium">
                    {sess.feedback}
                  </p>
                </div>
                
                <div className="flex flex-col items-end shrink-0">
                  <span className={`text-xl font-extrabold ${
                    sess.score && sess.score >= 85
                      ? "text-emerald-500"
                      : "text-violet-600 dark:text-violet-400"
                  }`}>
                    {sess.score}%
                  </span>
                  <span className="text-[10px] text-muted-foreground font-semibold">Grade Score</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-muted-foreground text-sm">
              No interview sessions completed yet. Select a track above to train.
            </div>
          )}
        </div>
      </div>

      {/* Active Mock Modal Window */}
      <AnimatePresence>
        {activeTrack && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveTrack(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl glass-premium border-border/80 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col gap-6 z-10 pointer-events-auto"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-start pb-4 border-b border-border/40">
                <div className="text-left">
                  <span className="text-[10px] text-violet-500 font-bold uppercase tracking-wider">
                    {activeTrack.type} Practice
                  </span>
                  <h3 className="font-extrabold text-lg text-foreground mt-0.5">
                    Question {currentQuestionIdx + 1} of {activeTrack.questions.length}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTrack(null)}
                  className="p-1.5 rounded-lg border border-border/40 hover:bg-secondary/40 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Question Text block */}
              <div className="p-5 rounded-2xl bg-violet-500/5 border border-violet-500/10 text-left font-bold text-sm sm:text-base text-foreground leading-relaxed">
                {activeTrack.questions[currentQuestionIdx]}
              </div>

              {/* Answer Input Textarea */}
              <div className="flex flex-col gap-2.5 text-left">
                <label className="text-xs font-bold text-muted-foreground">Your Response</label>
                <textarea
                  placeholder="Explain your approach here. For code interviews, write generic code outlines or pseudocode..."
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  disabled={isSubmittingAnswer}
                  rows={6}
                  className="w-full bg-background/50 border border-border/85 rounded-2xl p-4 text-sm outline-none focus:border-violet-500 transition-colors resize-none leading-relaxed"
                />
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border/40">
                <span className="text-[10px] text-muted-foreground font-semibold">
                  Answers are evaluated by Gemini AI
                </span>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setActiveTrack(null)}
                    className="px-5 py-2.5 rounded-xl border border-border/80 hover:bg-secondary/40 text-xs font-bold transition-all"
                  >
                    Cancel practice
                  </button>
                  {currentQuestionIdx < activeTrack.questions.length - 1 ? (
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-all flex items-center gap-1"
                    >
                      <span>Next Question</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitInterview}
                      disabled={isSubmittingAnswer}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold text-xs transition-all flex items-center gap-2"
                    >
                      {isSubmittingAnswer ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Submitting for Grading...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Submit Interview
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
