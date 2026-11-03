"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Check,
  X,
  Hash,
} from "lucide-react";
import {
  MOCK_CATEGORIES,
  MockCategory,
} from "@/features/categories/mocks/mock-categories";
import { CategoryBadge } from "@/components/shared/category-badge";

export default function CategoriesPage() {
  const [categories, setCategories] =
    useState<MockCategory[]>(MOCK_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeAddModal, setActiveAddModal] = useState<MockCategory | null>(
    null
  );
  const [newKeyword, setNewKeyword] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredCategories = categories.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const matchName = c.name.toLowerCase().includes(q);
    const matchDesc = c.description.toLowerCase().includes(q);
    const matchKeywords = c.keywords.some((k) =>
      k.toLowerCase().includes(q)
    );
    return matchName || matchDesc || matchKeywords;
  });

  const handleAddKeywordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAddModal || !newKeyword.trim()) return;

    const trimmed = newKeyword.trim().toLowerCase();
    if (activeAddModal.keywords.includes(trimmed)) {
      alert("Kata kunci tersebut sudah ada dalam kategori ini.");
      return;
    }

    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === activeAddModal.id) {
          return {
            ...c,
            keywords: [...c.keywords, trimmed],
          };
        }
        return c;
      })
    );

    showNotification(
      `Kata kunci "${trimmed}" ditambahkan ke "${activeAddModal.name}".`
    );
    setNewKeyword("");
    setActiveAddModal(null);
  };

  const handleRemoveKeyword = (catId: string, keyword: string) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === catId) {
          return {
            ...c,
            keywords: c.keywords.filter((k) => k !== keyword),
          };
        }
        return c;
      })
    );
    showNotification(`Kata kunci "${keyword}" dihapus.`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs text-white shadow-lg dark:bg-white dark:text-slate-900 animate-in fade-in slide-in-from-bottom-2">
          <Check className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Kategori Fenomena & Kata Kunci"
        description="Konfigurasi 8 taksonomi kemiskinan dan kata kunci (keywords) yang digunakan algoritma pencocokan berita."
      />

      {/* Search Bar */}
      <Card className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kategori atau kata kunci spesifik (misal: 'stunting', 'bansos', 'bedah rumah')..."
            className="pl-9 text-xs"
          />
        </div>
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {filteredCategories.map((category) => (
          <Card
            key={category.id}
            className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              <div className="flex items-center justify-between gap-2 pb-2">
                <CategoryBadge
                  name={category.name}
                  slug={category.slug}
                  className="text-xs"
                />
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {category.count} Artikel
                </span>
              </div>

              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                {category.description}
              </p>

              {/* Keywords Tag List */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">
                    Kata Kunci Relevansi ({category.keywords.length})
                  </span>
                  <button
                    onClick={() => setActiveAddModal(category)}
                    className="text-[11px] font-medium text-teal-700 hover:underline flex items-center gap-1 dark:text-teal-400"
                  >
                    <Plus className="h-3 w-3" />
                    Tambah
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {category.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="group inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      <Hash className="h-2.5 w-2.5 text-slate-400" />
                      {kw}
                      <button
                        onClick={() => handleRemoveKeyword(category.id, kw)}
                        className="opacity-0 group-hover:opacity-100 transition hover:text-rose-600"
                        title="Hapus kata kunci"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Keyword Modal */}
      {activeAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Tambah Kata Kunci ke &quot;{activeAddModal.name}&quot;
              </h2>
              <button
                onClick={() => setActiveAddModal(null)}
                className="rounded-md p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddKeywordSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1 dark:text-slate-300">
                  Kata Kunci Baru:
                </label>
                <Input
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Contoh: posko pengungsian, beras bansos"
                  className="text-xs"
                  autoFocus
                />
                <p className="mt-1.5 text-[11px] text-slate-500">
                  Artikel berita yang memuat kata kunci ini dalam judul atau naskah
                  akan otomatis dipetakan ke kategori ini.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveAddModal(null)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                >
                  Simpan Kata Kunci
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
