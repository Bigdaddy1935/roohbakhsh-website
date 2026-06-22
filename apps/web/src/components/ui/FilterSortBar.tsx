"use client";

import { useState } from "react";
import { Modal, Checkbox, RadioGroup, Radio } from "@heroui/react";
import { RiFilterLine, RiArrowUpDownLine, RiCloseLine } from "react-icons/ri";

export type FilterCategory = { value: string; label: string };
export type SortOption = { value: string; label: string };

export type FilterSortBarProps = {
  categories: FilterCategory[];
  selectedCategories: string[];
  onCategoryToggle: (value: string) => void;
  sortOptions: SortOption[];
  sortValue: string;
  onSortChange: (value: string) => void;
  labels: {
    filterBtn: string;
    sortModalTitle: string;
    filterModalTitle: string;
    applyBtn: string;
  };
};

export default function FilterSortBar({
  categories,
  selectedCategories,
  onCategoryToggle,
  sortOptions,
  sortValue,
  onSortChange,
  labels,
}: FilterSortBarProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const currentSortLabel =
    sortOptions.find((o) => o.value === sortValue)?.label ?? sortOptions[0]?.label;

  return (
    <>
      {/* Mobile-only buttons */}
      <div className="flex gap-3 lg:hidden mt-5">
        <button
          type="button"
          onClick={() => setFilterOpen(true)}
          className="flex-1 flex items-center justify-center gap-x-2 h-11 rounded-xl border-2 border-gray-200 text-[var(--ink)] font-semibold text-sm hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors cursor-pointer relative"
        >
          <RiFilterLine size={17} />
          {labels.filterBtn}
          {selectedCategories.length > 0 && (
            <span className="absolute top-1.5 end-2.5 size-4 rounded-full bg-[var(--brand)] text-white text-[10px] flex items-center justify-center">
              {selectedCategories.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setSortOpen(true)}
          className="flex-1 flex items-center justify-center gap-x-2 h-11 rounded-xl border-2 border-[var(--brand)] text-[var(--brand)] font-semibold text-sm hover:bg-[var(--brand)] hover:text-white transition-all cursor-pointer"
        >
          <RiArrowUpDownLine size={17} />
          {currentSortLabel}
        </button>
      </div>

      {/* Filter Modal */}
      <Modal isOpen={filterOpen} onOpenChange={setFilterOpen}>
        <Modal.Backdrop>
          <Modal.Container placement="bottom">
            <Modal.Dialog className="rounded-t-2xl bg-white">
              <Modal.Header className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <Modal.Heading className="text-[var(--ink)] font-extrabold text-base">
                  {labels.filterModalTitle}
                </Modal.Heading>
                <Modal.CloseTrigger className="size-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                  <RiCloseLine size={18} />
                </Modal.CloseTrigger>
              </Modal.Header>
              <Modal.Body className="flex flex-col gap-3 px-5 py-4">
                {categories.map((cat) => (
                  <Checkbox
                    key={cat.value}
                    isSelected={selectedCategories.includes(cat.value)}
                    onChange={() => onCategoryToggle(cat.value)}
                  >
                    <Checkbox.Content>
                      <Checkbox.Control>
                        <Checkbox.Indicator />
                      </Checkbox.Control>
                      <span className="text-sm text-[var(--ink)]">{cat.label}</span>
                    </Checkbox.Content>
                  </Checkbox>
                ))}
              </Modal.Body>
              <Modal.Footer className="px-5 py-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setFilterOpen(false)}
                  className="w-full h-11 rounded-xl bg-[var(--brand)] text-white font-bold text-sm hover:opacity-90 transition-opacity"
                >
                  {labels.applyBtn}
                </button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      {/* Sort Modal */}
      <Modal isOpen={sortOpen} onOpenChange={setSortOpen}>
        <Modal.Backdrop>
          <Modal.Container placement="bottom">
            <Modal.Dialog className="rounded-t-2xl bg-white">
              <Modal.Header className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <Modal.Heading className="text-[var(--ink)] font-extrabold text-base">
                  {labels.sortModalTitle}
                </Modal.Heading>
                <Modal.CloseTrigger className="size-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                  <RiCloseLine size={18} />
                </Modal.CloseTrigger>
              </Modal.Header>
              <Modal.Body className="px-5 py-4">
                <RadioGroup
                  value={sortValue}
                  onChange={(val) => {
                    onSortChange(val);
                    setSortOpen(false);
                  }}
                  className="flex flex-col gap-3"
                >
                  {sortOptions.map((opt) => (
                    <Radio key={opt.value} value={opt.value}>
                      <Radio.Content>
                        <Radio.Control>
                          <Radio.Indicator />
                        </Radio.Control>
                        <span className="text-sm text-[var(--ink)]">{opt.label}</span>
                      </Radio.Content>
                    </Radio>
                  ))}
                </RadioGroup>
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}
