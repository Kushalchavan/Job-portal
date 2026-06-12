import { ApplicationStatus } from "@prisma/client";
import { AppError } from "../../utils/AppError";
import {
  createApplicationRepo,
  deleteApplicationRepo,
  findApplicationById,
  findExistingApplication,
  findJobById,
  getJobApplicantsRepo,
  getUserApplicationsRepo,
  updateApplicationStatusRepo,
} from "./application.repository";
import { notificationQueue } from "../../queues/notification.queue";
import { EVENTS } from "../../events/events.contants";
import { applicationCreatedCounter } from "../../metrics/app.metrics";

interface ApplyJobInput {
  jobId: number;
  resumeUrl?: string;
  requestId: string;
}

export const applyToJob = async (
  userId: number,
  data: ApplyJobInput,
  requestId: string,
) => {
  const { jobId, resumeUrl } = data;

  const job = await findJobById(jobId);

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  const existingApplication = await findExistingApplication(userId, jobId);

  if (existingApplication) {
    throw new AppError("You have already applied to this job", 400);
  }

  const application = await createApplicationRepo(userId, jobId, resumeUrl);

  // Increment the application creation counter for Prometheus metrics
  applicationCreatedCounter.inc();

  await notificationQueue.add(EVENTS.APPLICATION_CREATED, {
    requestId,
    userId,
    type: "APPLICATION_CREATED",
    message: `Your application for ${job.title} has been received.`,
  });

  return application;
};

export const getMyApplications = async (userId: number) => {
  return getUserApplicationsRepo(userId);
};

export const getApplicantsByJob = async (jobId: number) => {
  return getJobApplicantsRepo(jobId);
};

export const updateApplicationStatus = async (
  applicationId: number,
  status: ApplicationStatus,
  requestId: string,
) => {
  const application = await findApplicationById(applicationId);

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  const updatedApplication = await updateApplicationStatusRepo(
    applicationId,
    status,
  );

  let message = "";

  switch (status) {
    case "SHORTLISTED":
      message = `Your application for ${application.job.title} has been shortlisted.`;
      break;

    case "REJECTED":
      message = `Your application for ${application.job.title} has been rejected.`;
      break;

    case "HIRED":
      message = `Congratulations! You have been hired for ${application.job.title}.`;
      break;

    case "REVIEWED":
      message = `Your application for ${application.job.title} is under review.`;
      break;

    default:
      message = `Your application status has been updated.`;
  }

  await notificationQueue.add(EVENTS.APPLICATION_STATUS_UPDATED, {
    requestId,
    userId: application.userId,
    type: "JOB_ALERT",
    message,
  });

  return updatedApplication;
};

export const withdrawApplication = async (
  applicationId: number,
  userId: number,
) => {
  const application = await findApplicationById(applicationId);

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  if (application.userId !== userId) {
    throw new AppError("Unauthorized", 403);
  }

  return deleteApplicationRepo(applicationId);
};
