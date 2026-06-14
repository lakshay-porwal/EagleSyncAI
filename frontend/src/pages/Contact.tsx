import React, { useState } from "react";
import { useToast } from "../context/ToastContext";
import { Mail, Clock, MessageSquare, Send, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Contact: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast("Please fill out all fields", "error");
      return;
    }
    setIsSubmitting(true);

    // Mock Send
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      toast("Message sent successfully!", "success");
      setFormData({ name: "", email: "", message: "" });
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-16 sm:py-24 max-w-4xl text-left">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Contact AI Support</h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-medium">
          Have an issue with credential verification or API syncs? Drop our technical team a message.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Support UI sidebar */}
        <div className="md:col-span-5 flex flex-col gap-6">
          <div className="glass p-6 rounded-3xl border border-border/60">
            <h3 className="font-extrabold text-base mb-4">Support Channels</h3>
            
            <div className="space-y-4 text-xs font-semibold">
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-muted-foreground font-medium mb-0.5">Email Support</p>
                  <p className="text-foreground">support@eaglesync.ai</p>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-500 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-muted-foreground font-medium mb-0.5">Response Rate</p>
                  <p className="text-foreground">Average 1.5 hours confirmations</p>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-500 shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-muted-foreground font-medium mb-0.5">Developer Hub</p>
                  <p className="text-foreground">Community Discord channel active</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form panel */}
        <div className="md:col-span-7 w-full">
          <div className="glass-premium border-border/80 rounded-3xl p-6 sm:p-8 shadow-xl">
            <AnimatePresence mode="wait">
              {!isSent ? (
                <motion.form
                  key="contact-form"
                  onSubmit={handleSubmit}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-5 flex flex-col"
                >
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-foreground">Full Name</label>
                    <input
                      type="text"
                      placeholder="Alex Mercer"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={isSubmitting}
                      className="bg-background/50 border border-border/85 rounded-2xl px-4 py-3.5 text-sm outline-none focus:border-violet-500 transition-colors"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-foreground">Email Address</label>
                    <input
                      type="email"
                      placeholder="alex.mercer@stanford.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={isSubmitting}
                      className="bg-background/50 border border-border/85 rounded-2xl px-4 py-3.5 text-sm outline-none focus:border-violet-500 transition-colors"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-foreground">Message</label>
                    <textarea
                      placeholder="Explain your issue in detail..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      disabled={isSubmitting}
                      rows={4}
                      className="bg-background/50 border border-border/85 rounded-2xl p-4 text-sm outline-none focus:border-violet-500 transition-colors resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 w-full py-4.5 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-colors shadow-lg shadow-violet-500/10 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      "Sending Message..."
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Support Ticket
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="contact-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 flex flex-col items-center justify-center text-center gap-5"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-2xl mb-2 text-foreground">Message Received!</h3>
                    <p className="text-muted-foreground text-sm max-w-sm">
                      Thank you for contacting us. A technical support agent will review your inquiry and follow up shortly.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsSent(false)}
                    className="mt-2 px-6 py-2.5 rounded-xl border border-border/80 hover:bg-secondary/40 text-xs font-bold transition-all"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
