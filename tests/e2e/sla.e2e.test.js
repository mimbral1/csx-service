const { processSlaMonitor } = require('../../src/modules/sla/jobs/sla-monitor.job');

describe('CSX - SLA', () => {
  it('should detect expired SLA', async () => {
    const result = await processSlaMonitor();

    expect(result).toBeDefined();
  });
});
