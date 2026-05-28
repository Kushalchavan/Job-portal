import { prisma } from "../../config/prisma";
import { eventEmitter } from "../../events/eventEmitter";
import { EVENTS } from "../../events/events.contants";

interface CreateResumeInput {
  userId: number;
  originalName: string;
  storageKey: string;
  mimeType: string;
  size: number;
}

export const createResume = async (data: CreateResumeInput) => {
  const resume = await prisma.resume.create({
    data: {
      userId: data.userId,
      originalName: data.originalName,
      storageKey: data.storageKey,
      mimeType: data.mimeType,
      size: data.size,
    },
  });
  
  eventEmitter.emit(EVENTS.RESUME_UPLOADED_EVENT, {
    resumeId: resume.id,
    userId: resume.userId,
    storageKey: resume.storageKey,
  });
  return resume;
};
