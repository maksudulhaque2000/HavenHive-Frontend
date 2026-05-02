"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./Button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisible?: number;
}

export default function Pagination({ currentPage, totalPages, onPageChange, maxVisible = 5 }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const start = Math.max(Math.min(currentPage - 2, totalPages - maxVisible), 0);
  const visiblePages = pages.slice(start, start + maxVisible);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button variant="outline" size="sm" onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} leftIcon={<ChevronLeft className="h-4 w-4" />}>
        Prev
      </Button>
      {visiblePages[0] > 1 && <span className="px-2 text-slate-500">...</span>}
      {visiblePages.map((page) => (
        <button key={page} onClick={() => onPageChange(page)} className={cn("min-w-10 rounded-xl px-4 py-2 text-sm font-semibold transition", page === currentPage ? "bg-primary text-white" : "bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800")}>
          {page}
        </button>
      ))}
      {visiblePages[visiblePages.length - 1] < totalPages && <span className="px-2 text-slate-500">...</span>}
      <Button variant="outline" size="sm" onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} rightIcon={<ChevronRight className="h-4 w-4" />}>
        Next
      </Button>
    </div>
  );
}