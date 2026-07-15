"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateInstructor } from "@/hooks/queries/use-instructors";
import InstructorForm, { type InstructorFormValues } from "@/components/instructors/InstructorForm";

const emptyForm: InstructorFormValues = {
  name: { ar: "", ur: "" },
  slug: "",
  avatarUrl: "",
  bio: { ar: "", ur: "" },
  staffType: "instructor",
};

export default function NewInstructorPage() {
  const router = useRouter();
  const createMut = useCreateInstructor();

  async function handleSubmit(values: InstructorFormValues) {
    await createMut.mutateAsync({
      name: values.name,
      slug: values.slug,
      avatarUrl: values.avatarUrl || undefined,
      bio: values.bio,
      staffType: values.staffType,
    });
    toast.success("استاد با موفقیت ایجاد شد.");
    router.push("/dashboard/instructors");
  }

  return (
    <InstructorForm
      title="استاد جدید"
      initialValues={emptyForm}
      onSubmit={handleSubmit}
      isPending={createMut.isPending}
    />
  );
}
