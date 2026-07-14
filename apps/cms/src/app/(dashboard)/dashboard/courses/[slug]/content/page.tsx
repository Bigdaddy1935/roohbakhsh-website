"use client";

import { useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Localized, SectionRecord, Lesson } from "@roohbakhsh/shared";
import {
  useCourse,
  useCourseSections,
  useCreateSection,
  useUpdateSection,
  useDeleteSection,
  useCreateLesson,
  useUpdateLesson,
  useDeleteLesson,
} from "@/hooks/queries/use-courses";
import FormModal from "@/components/ui/FormModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import LocalizedInput from "@/components/ui/LocalizedInput";
import FormField from "@/components/ui/FormField";
import SwitchField from "@/components/ui/SwitchField";
import {
  RiArrowRightLine, RiAddLine, RiEditLine, RiDeleteBinLine,
  RiPlayCircleLine, RiLockLine,
} from "react-icons/ri";

const emptySectionForm = { title: { ar: "", ur: "" } as Localized, order: "" };
const emptyLessonForm = {
  title: { ar: "", ur: "" } as Localized,
  videoAr: "",
  videoUr: "",
  order: "",
  durationMinutes: "",
  isFreePreview: false,
};

function SectionCard({ section, courseSlug }: { section: SectionRecord; courseSlug: string }) {
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [deleteSectionTarget, setDeleteSectionTarget] = useState(false);
  const [sectionForm, setSectionForm] = useState(emptySectionForm);

  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lessonForm, setLessonForm] = useState(emptyLessonForm);
  const [deleteLessonTarget, setDeleteLessonTarget] = useState<Lesson | null>(null);

  const updateSectionMut = useUpdateSection(courseSlug, section.id);
  const deleteSectionMut = useDeleteSection(courseSlug);
  const createLessonMut = useCreateLesson(courseSlug, section.id);
  const updateLessonMut = useUpdateLesson(courseSlug, section.id);
  const deleteLessonMut = useDeleteLesson(courseSlug, section.id);

  function openEditSection() {
    setSectionForm({ title: { ar: section.title.ar, ur: section.title.ur }, order: String(section.order) });
    setSectionModalOpen(true);
  }

  async function handleSectionSubmit(e: FormEvent) {
    e.preventDefault();
    await updateSectionMut.mutateAsync({
      title: sectionForm.title,
      order: sectionForm.order ? Number(sectionForm.order) : undefined,
    });
    setSectionModalOpen(false);
  }

  function openCreateLesson() {
    setEditingLesson(null);
    setLessonForm(emptyLessonForm);
    setLessonModalOpen(true);
  }

  function openEditLesson(lesson: Lesson) {
    setEditingLesson(lesson);
    setLessonForm({
      title: { ar: lesson.title.ar, ur: lesson.title.ur },
      videoAr: lesson.videoUrl?.ar ?? "",
      videoUr: lesson.videoUrl?.ur ?? "",
      order: String(lesson.order),
      durationMinutes: String(lesson.durationMinutes),
      isFreePreview: lesson.isFreePreview,
    });
    setLessonModalOpen(true);
  }

  async function handleLessonSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = {
      title: lessonForm.title,
      videoUrl: { ar: lessonForm.videoAr || null, ur: lessonForm.videoUr || null },
      order: lessonForm.order ? Number(lessonForm.order) : undefined,
      durationMinutes: Number(lessonForm.durationMinutes) || 0,
      isFreePreview: lessonForm.isFreePreview,
    };
    if (editingLesson) await updateLessonMut.mutateAsync({ ...payload, lessonId: editingLesson.id });
    else await createLessonMut.mutateAsync(payload);
    setLessonModalOpen(false);
  }

  return (
    <div className="bg-white border border-gray-100 rounded-[20px] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="size-6 rounded-full bg-gray-100 text-xs font-bold text-gray-500 flex items-center justify-center shrink-0">{section.order}</span>
          <h3 className="font-bold text-[var(--ink)]">{section.title.ar}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={openCreateLesson} className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            <RiAddLine size={16} />
            درس جدید
          </button>
          <button onClick={openEditSection} className="p-2 rounded-md text-gray-500 hover:text-[var(--brand)] hover:bg-gray-100 transition-colors"><RiEditLine size={18} /></button>
          <button onClick={() => setDeleteSectionTarget(true)} className="p-2 rounded-md text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"><RiDeleteBinLine size={18} /></button>
        </div>
      </div>

      {section.lessons.length === 0 ? (
        <p className="text-xs text-gray-400 py-2">هنوز درسی اضافه نشده.</p>
      ) : (
        <div className="flex flex-col divide-y divide-gray-50">
          {section.lessons.map((lesson) => (
            <div key={lesson.id} className="py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                {lesson.isFreePreview ? <RiPlayCircleLine size={17} className="text-[var(--brand)] shrink-0" /> : <RiLockLine size={17} className="text-gray-300 shrink-0" />}
                <span className="text-sm text-[var(--ink)] truncate">{lesson.title.ar}</span>
                <span className="text-xs text-gray-400 shrink-0">{lesson.durationMinutes} دقیقه</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={() => openEditLesson(lesson)} className="p-2 rounded-md text-gray-500 hover:text-[var(--brand)] hover:bg-gray-100 transition-colors"><RiEditLine size={18} /></button>
                <button onClick={() => setDeleteLessonTarget(lesson)} className="p-2 rounded-md text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"><RiDeleteBinLine size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <FormModal
        isOpen={sectionModalOpen} onClose={() => setSectionModalOpen(false)}
        title="ویرایش سرفصل" onSubmit={handleSectionSubmit} isPending={updateSectionMut.isPending}
      >
        <LocalizedInput label="عنوان سرفصل" value={sectionForm.title} onChange={(v) => setSectionForm((f) => ({ ...f, title: v }))} required />
        <FormField label="ترتیب" type="number" value={sectionForm.order} onChange={(e) => setSectionForm((f) => ({ ...f, order: e.target.value }))} dir="ltr" />
      </FormModal>

      <ConfirmModal
        isOpen={deleteSectionTarget} onClose={() => setDeleteSectionTarget(false)}
        onConfirm={async () => { await deleteSectionMut.mutateAsync(section.id); setDeleteSectionTarget(false); }}
        isPending={deleteSectionMut.isPending} title="حذف سرفصل"
        description={`آیا از حذف سرفصل "${section.title.ar}" و همه‌ی درس‌های آن مطمئن هستید؟`}
      />

      <FormModal
        isOpen={lessonModalOpen} onClose={() => setLessonModalOpen(false)}
        title={editingLesson ? "ویرایش درس" : "درس جدید"} onSubmit={handleLessonSubmit}
        isPending={createLessonMut.isPending || updateLessonMut.isPending}
      >
        <LocalizedInput label="عنوان درس" value={lessonForm.title} onChange={(v) => setLessonForm((f) => ({ ...f, title: v }))} required />
        <FormField label="لینک ویدیو — عربی" value={lessonForm.videoAr} onChange={(e) => setLessonForm((f) => ({ ...f, videoAr: e.target.value }))} dir="ltr" />
        <FormField label="لینک ویدیو — اردو" value={lessonForm.videoUr} onChange={(e) => setLessonForm((f) => ({ ...f, videoUr: e.target.value }))} dir="ltr" />
        <FormField label="مدت زمان (دقیقه)" type="number" value={lessonForm.durationMinutes} onChange={(e) => setLessonForm((f) => ({ ...f, durationMinutes: e.target.value }))} required dir="ltr" />
        <FormField label="ترتیب" type="number" value={lessonForm.order} onChange={(e) => setLessonForm((f) => ({ ...f, order: e.target.value }))} dir="ltr" />
        <SwitchField
          label="پیش‌نمایش رایگان"
          checked={lessonForm.isFreePreview}
          onChange={(checked) => setLessonForm((f) => ({ ...f, isFreePreview: checked }))}
        />
      </FormModal>

      <ConfirmModal
        isOpen={!!deleteLessonTarget} onClose={() => setDeleteLessonTarget(null)}
        onConfirm={async () => { if (deleteLessonTarget) { await deleteLessonMut.mutateAsync(deleteLessonTarget.id); setDeleteLessonTarget(null); } }}
        isPending={deleteLessonMut.isPending} title="حذف درس"
        description={`آیا از حذف درس "${deleteLessonTarget?.title.ar}" مطمئن هستید؟`}
      />
    </div>
  );
}

export default function CourseContentPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const courseSlug = params.slug;

  const { data: course } = useCourse(courseSlug);
  const { data: sections, isLoading } = useCourseSections(courseSlug);
  const createSectionMut = useCreateSection(courseSlug);

  const [createSectionOpen, setCreateSectionOpen] = useState(false);
  const [sectionForm, setSectionForm] = useState(emptySectionForm);

  async function handleCreateSection(e: FormEvent) {
    e.preventDefault();
    await createSectionMut.mutateAsync({
      title: sectionForm.title,
      order: sectionForm.order ? Number(sectionForm.order) : undefined,
    });
    setSectionForm(emptySectionForm);
    setCreateSectionOpen(false);
  }

  const sortedSections = [...(sections ?? [])].sort((a, b) => a.order - b.order);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 bg-white border border-gray-100 rounded-[20px] px-5 h-[105px]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard/courses")}
            className="p-2 rounded-md text-gray-500 hover:text-[var(--brand)] hover:bg-gray-100 transition-colors"
          >
            <RiArrowRightLine size={18} />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-[var(--ink)]">مدیریت محتوا</h1>
            <p className="text-sm text-gray-400 mt-1">{course?.title.ar ?? courseSlug}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => { setSectionForm(emptySectionForm); setCreateSectionOpen(true); }}
          className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-md bg-[var(--brand)] text-white hover:opacity-90"
        >
          <RiAddLine className="text-base" />
          سرفصل جدید
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-400">در حال بارگذاری...</p>
      ) : sortedSections.length === 0 ? (
        <p className="text-sm text-gray-400">هنوز سرفصلی برای این دوره ثبت نشده.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {sortedSections.map((section) => (
            <SectionCard key={section.id} section={section} courseSlug={courseSlug} />
          ))}
        </div>
      )}

      <FormModal
        isOpen={createSectionOpen} onClose={() => setCreateSectionOpen(false)}
        title="سرفصل جدید" onSubmit={handleCreateSection} isPending={createSectionMut.isPending}
      >
        <LocalizedInput label="عنوان سرفصل" value={sectionForm.title} onChange={(v) => setSectionForm((f) => ({ ...f, title: v }))} required />
        <FormField label="ترتیب" type="number" value={sectionForm.order} onChange={(e) => setSectionForm((f) => ({ ...f, order: e.target.value }))} dir="ltr" />
      </FormModal>
    </div>
  );
}
