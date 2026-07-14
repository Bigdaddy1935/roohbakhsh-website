"use client";

import { useRouter, useParams } from "next/navigation";
import type { InstructorRecord } from "@roohbakhsh/shared";
import { useInstructor, useUpdateInstructor } from "@/hooks/queries/use-instructors";
import InstructorForm, { type InstructorFormValues } from "@/components/instructors/InstructorForm";

export default function EditInstructorPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data: instructor, isLoading } = useInstructor(id);
  const updateMut = useUpdateInstructor(id);

  async function handleSubmit(values: InstructorFormValues) {
    await updateMut.mutateAsync({
      name: values.name,
      slug: values.slug,
      avatarUrl: values.avatarUrl || undefined,
      bio: values.bio,
      staffType: values.staffType,
    });
    router.push("/dashboard/instructors");
  }

  if (isLoading || !instructor) {
    return <div className="text-sm text-gray-400">در حال بارگذاری...</div>;
  }

  const initialValues: InstructorFormValues = {
    name: { ar: instructor.name.ar, ur: instructor.name.ur },
    slug: instructor.slug,
    avatarUrl: instructor.avatarUrl ?? "",
    bio: { ar: instructor.bio?.ar ?? "", ur: instructor.bio?.ur ?? "" },
    staffType: instructor.staffType,
  };

  return (
    <InstructorForm
      title="ویرایش استاد"
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isPending={updateMut.isPending}
    />
  );
}
