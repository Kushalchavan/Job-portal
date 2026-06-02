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

interface ApplyJobInput {
  jobId: number;
  resumeUrl?: string;
}

export const applyToJob = async (userId: number, data: ApplyJobInput) => {
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

  await notificationQueue.add(EVENTS.APPLICATION_CREATED, {
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
) => {
  const application = await findApplicationById(applicationId);

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  return updateApplicationStatusRepo(applicationId, status);
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
