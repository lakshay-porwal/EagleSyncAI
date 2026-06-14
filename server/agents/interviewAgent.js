const { runAgent } = require("./agentEngine");
const { saveInterviewSession } = require("../tools/databaseTools");

const SYSTEM_PROMPT = `You are a strict but fair SDE interviewer for EagleSyncAI.
Your job is to evaluate interview answers and provide honest, detailed feedback.
Be specific in your feedback — reference actual content from the answers.
Score fairly: a mediocre answer should score 50-65, a good answer 70-85, excellent 86-100.`;

const runInterviewAgent = async (userId, type, questions, answers, io) => {
  const toolFunctions = {
    saveInterviewSession,
  };

  const answersText = questions.map((q, i) =>
    `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i] || "(no answer provided)"}`
  ).join("\n\n");

  const goal = `Grade this ${type} interview for user ${userId}.

Interview Type: ${type}
Questions and Answers:
${answersText}

Follow these steps:
1. Evaluate each answer for: technical accuracy, completeness, and clarity of communication
2. Calculate an overall score (0-100) weighted appropriately for ${type} interviews
3. Write a 2-3 sentence overall feedback summary
4. Write specific per-answer feedback (one sentence per answer)
5. Write 3 concrete improvement tips
6. Call saveInterviewSession with all the results
7. Say TASK_COMPLETE

Before calling saveInterviewSession, prepare this exact JSON:
{
  "type": "${type}",
  "questions": ${JSON.stringify(questions)},
  "answers": ${JSON.stringify(answers)},
  "score": <0-100>,
  "feedback": "<overall 2-3 sentence feedback>",
  "perAnswerFeedback": ["<feedback for answer 1>", "<feedback for answer 2>", ...],
  "improvementTips": ["<tip 1>", "<tip 2>", "<tip 3>"]
}`;

  const steps = await runAgent(
    "Interview Agent",
    SYSTEM_PROMPT,
    goal,
    toolFunctions,
    userId,
    io,
    8
  );

  // Extract result from steps
  let result = null;
  for (let i = steps.length - 1; i >= 0; i--) {
    const content = steps[i].content;
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) ||
                      content.match(/(\{[\s\S]*"score"[\s\S]*\})/);
    if (jsonMatch) {
      try {
        result = JSON.parse(jsonMatch[1]);
        break;
      } catch {
        // continue
      }
    }
  }

  // Fallback result
  if (!result) {
    const avgLen = answers.reduce((acc, a) => acc + (a?.length || 0), 0) / answers.length;
    const score = Math.min(85, Math.max(40, Math.round(avgLen / 3)));
    result = {
      type,
      questions,
      answers,
      score,
      feedback: `Your ${type} interview showed some understanding of the concepts. Focus on providing more specific examples and structuring your answers clearly.`,
      perAnswerFeedback: answers.map((_, i) => `Answer ${i + 1}: Could be more detailed and specific.`),
      improvementTips: [
        "Use the STAR method (Situation, Task, Action, Result) for behavioral questions.",
        "Always explain your thought process before jumping to the solution.",
        "Practice more problems on LeetCode to improve response speed and accuracy.",
      ],
    };
  }

  return { steps, result };
};

module.exports = { runInterviewAgent };
