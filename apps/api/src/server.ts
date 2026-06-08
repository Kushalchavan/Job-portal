import { env } from "./config/env";
import logger from "./config/logger";
import app from "./app";

// Import listeners and workers
import "./listeners/notification.listener";
import "./listeners/resume.listener";
import "./listeners/job.listener";
import "./listeners/matching.listener";

import "./workers/notification.worker";
import "./workers/email.worker";

// Start the server
app.listen(env.port, () => {
  logger.info(`Server is running on port ${env.port}`);
  logger.info("Press Ctrl+C to stop the server");
});
