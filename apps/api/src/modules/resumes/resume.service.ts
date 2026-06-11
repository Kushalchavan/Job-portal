import { eventEmitter } from "../../events/eventEmitter";
import { EVENTS } from "../../events/events.contants";
import { AppError } from "../../utils/AppError";
import {
  createResumeRepo,
  deleteResumeRepo,
  getResumeByIdRepo,
  getUserResumesRepo,
} from "./reume.reository";

interface CreateResumeInput {
  userId: number;
  originalName: string;
  storageKey: string;
  mimeType: string;
  size: number;
  requestId: string;
}

export const createResume = async (data: CreateResumeInput) => {
  const resume = await createResumeRepo(data);

  eventEmitter.emit(EVENTS.RESUME_UPLOADED_EVENT, {
    requestId: data.requestId,
    resumeId: resume.id,
    userId: resume.userId,
    storageKey: resume.storageKey,
  });
  return resume;
};

export const getMyResumes = async (userId: number) => {
  return getUserResumesRepo(userId);
};

export const getResumeById = async (resumeId: string) => {
  const resume = await getResumeByIdRepo(resumeId);

  if (!resume) {
    throw new AppError("Resume not found", 404);
  }

  return resume;
};

export const deleteResume = async (resumeId: string, userId: number) => {
  const resume = await getResumeByIdRepo(resumeId);

  if (!resume) {
    throw new AppError("Resume not found", 404);
  }

  if (resume.userId !== userId) {
    throw new AppError("Unauthorized", 403);
  }

  return deleteResumeRepo(resumeId);
};
