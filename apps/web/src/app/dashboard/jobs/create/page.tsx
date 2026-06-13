import CreateJobForm from "@/components/job/CreateJobForm";

export default function CreateJobPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">Create Job</h1>
      
      <CreateJobForm />
    </div>
  );
}
