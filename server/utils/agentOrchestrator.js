const { runCapabilityAgent } = require("../agents/capabilityAgent");
const { runCareerAgent } = require("../agents/careerAgent");

/**
 * Connected Agents Closed-Loop Trigger:
 * Asynchronously triggers Capability and Career Agent evaluations in the background,
 * saving results to DB and emitting socket events to the UI.
 */
const triggerConnectedAgents = (userId, io) => {
  if (!userId) return;

  // Run in a non-blocking timeout block
  setTimeout(async () => {
    try {
      console.log(`\n🔄 [Orchestrator] Auto-triggering connected agents (Capability & Career) for user ${userId}`);
      
      // Run both agents in parallel
      await Promise.all([
        runCapabilityAgent(userId, io).catch(err => {
          console.error(`❌ [Orchestrator] Capability Agent failed:`, err.message);
        }),
        runCareerAgent(userId, io).catch(err => {
          console.error(`❌ [Orchestrator] Career Agent failed:`, err.message);
        })
      ]);

      console.log(`✅ [Orchestrator] Closed-loop execution completed successfully for user ${userId}\n`);
    } catch (err) {
      console.error(`❌ [Orchestrator] Closed-loop orchestration error:`, err.message);
    }
  }, 100);
};

module.exports = {
  triggerConnectedAgents
};
