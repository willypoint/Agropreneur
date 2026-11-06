import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, CheckSquare, Square, Calendar, AlertCircle, Lightbulb, 
  PackageCheck, Printer, PlusCircle, Edit3, Trash2, RefreshCw, 
  Check, X, Sparkles, Sprout, ArrowRight
} from 'lucide-react';
import { SOP_COMMODITIES_MAP, getSOPForCommodity } from '../data/sopData';
import { COMMODITIES } from '../data/commodities';
import { Commodity, SOPPhase } from '../types';

interface SOPViewProps {
  customCommodities?: Commodity[];
  initialCropId?: string;
}

export const SOPView: React.FC<SOPViewProps> = ({ customCommodities = [], initialCropId }) => {
  // Combine custom manual commodities with catalog commodities
  const allCommodities = useMemo(() => {
    return [...customCommodities, ...COMMODITIES];
  }, [customCommodities]);

  // Selected Commodity ID
  const [selectedCropId, setSelectedCropId] = useState<string>(initialCropId || 'cabai-rawit-merah');

  useEffect(() => {
    if (initialCropId) {
      setSelectedCropId(initialCropId);
    }
  }, [initialCropId]);

  // Custom User SOPs Map saved in LocalStorage
  const [customSOPs, setCustomSOPs] = useState<Record<string, SOPPhase[]>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('agropreneur_custom_sops');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return {};
        }
      }
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem('agropreneur_custom_sops', JSON.stringify(customSOPs));
  }, [customSOPs]);

  // Completed Checklist Tasks State saved in LocalStorage
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('agropreneur_sop_tasks');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return { cr1: true, cr2: true };
        }
      }
    }
    return { cr1: true, cr2: true };
  });

  useEffect(() => {
    localStorage.setItem('agropreneur_sop_tasks', JSON.stringify(completedTasks));
  }, [completedTasks]);

  // Resolve Active Commodity Object
  const currentCommodity = useMemo(() => {
    return allCommodities.find((c) => c.id === selectedCropId) || allCommodities[0];
  }, [allCommodities, selectedCropId]);

  // Resolve Phases for Current Commodity
  const phases = useMemo(() => {
    return getSOPForCommodity(currentCommodity, customSOPs);
  }, [currentCommodity, customSOPs]);

  // Task Toggle Handler
  const toggleTask = (taskId: string) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  // Progress Calculation
  const totalTasks = phases.reduce((acc, p) => acc + p.tasks.length, 0);
  const doneCount = phases.reduce((acc, p) => acc + p.tasks.filter((t) => completedTasks[t.id]).length, 0);
  const progressPct = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;

  // Manual SOP Editor State
  const [isEditorModalOpen, setIsEditorModalOpen] = useState<boolean>(false);
  const [editablePhases, setEditablePhases] = useState<SOPPhase[]>([]);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<boolean>(false);

  // Open Editor
  const handleOpenEditor = () => {
    // Clone current phases for in-place editing
    setEditablePhases(JSON.parse(JSON.stringify(phases)));
    setIsEditorModalOpen(true);
  };

  // Add New Phase
  const handleAddPhase = () => {
    const newPhaseNumber = editablePhases.length + 1;
    const newPhase: SOPPhase = {
      week: `Tahap ${newPhaseNumber}`,
      title: 'Judul Tahapan Baru',
      description: 'Deskripsi teknis pengerjaan di lahan...',
      tasks: [
        { id: `custom-task-${Date.now()}-1`, text: 'Pekerjaan teknis tahap pertama' },
        { id: `custom-task-${Date.now()}-2`, text: 'Pekerjaan teknis tahap kedua' },
      ],
      tips: 'Tips khusus agronom lapangan...',
      keyInputs: 'Kebutuhan pupuk, benih, atau alat...',
    };
    setEditablePhases([...editablePhases, newPhase]);
  };

  // Update Phase Field
  const handleUpdatePhaseField = (index: number, field: keyof SOPPhase, val: any) => {
    const updated = [...editablePhases];
    updated[index] = { ...updated[index], [field]: val };
    setEditablePhases(updated);
  };

  // Add Task to Phase
  const handleAddTaskToPhase = (phaseIndex: number) => {
    const updated = [...editablePhases];
    const newTaskId = `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    updated[phaseIndex].tasks.push({ id: newTaskId, text: 'Tugas checklist baru' });
    setEditablePhases(updated);
  };

  // Update Task Text
  const handleUpdateTaskText = (phaseIndex: number, taskIndex: number, text: string) => {
    const updated = [...editablePhases];
    updated[phaseIndex].tasks[taskIndex].text = text;
    setEditablePhases(updated);
  };

  // Delete Task
  const handleDeleteTask = (phaseIndex: number, taskIndex: number) => {
    const updated = [...editablePhases];
    updated[phaseIndex].tasks.splice(taskIndex, 1);
    setEditablePhases(updated);
  };

  // Delete Entire Phase
  const handleDeletePhase = (phaseIndex: number) => {
    const updated = editablePhases.filter((_, idx) => idx !== phaseIndex);
    setEditablePhases(updated);
  };

  // Save Custom SOP
  const handleSaveCustomSOP = () => {
    setCustomSOPs((prev) => ({
      ...prev,
      [currentCommodity.id]: editablePhases,
    }));
    setIsEditorModalOpen(false);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  // Reset Custom SOP back to default
  const handleResetSOP = () => {
    if (window.confirm(`Kembalikan SOP ${currentCommodity.name} ke template standar acuan?`)) {
      setCustomSOPs((prev) => {
        const next = { ...prev };
        delete next[currentCommodity.id];
        return next;
      });
      setSaveSuccessMsg(true);
      setTimeout(() => setSaveSuccessMsg(false), 2000);
    }
  };

  const isCustomized = Boolean(customSOPs[currentCommodity.id]);

  // Quick preset commodity shortcuts
  const quickCrops = [
    { id: 'cabai-rawit-merah', label: '🌶️ Cabai Rawit Merah' },
    { id: 'pakcoy-hidroponik-nft', label: '🥬 Pakcoy NFT' },
    { id: 'bawang-merah-brebes', label: '🧅 Bawang Merah' },
    { id: 'melon-golden-greenhouse', label: '🍈 Melon Golden' },
    { id: 'tomat-servo-f1', label: '🍅 Tomat Servo' },
    { id: 'padi-sawah-irigasi', label: '🌾 Padi Sawah' },
    { id: 'jagung-hibrida-pipil', label: '🌽 Jagung Pipil' },
    { id: 'kangkung-darat-cabut', label: '🌱 Kangkung Darat' },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#1E6B45]" />
            <span>SOP Budidaya & Kalender Tanam Agribisnis</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Panduan agronomi mingguan, jadwal rotasi pemupukan berimbang, checklist mandor, dan kustomisasi SOP manual.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleOpenEditor}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#1E6B45] hover:bg-[#165235] text-white transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Edit3 className="w-4 h-4" />
            <span>Sesuaikan / Edit SOP Manual</span>
          </button>

          <button
            onClick={() => window.print()}
            className="p-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Cetak SOP Checklist Lapangan"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Commodity Selector Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Main Dropdown */}
          <div className="flex-1 max-w-md">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Pilih Komoditas Tanaman ({allCommodities.length} Pilihan):
            </label>
            <select
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
              className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#1E6B45]"
            >
              {allCommodities.map((crop) => (
                <option key={crop.id} value={crop.id}>
                  {crop.isCustom ? '⭐ [Manual] ' : ''}{crop.name} — ({crop.cycleDays} HST / {crop.categoryLabel})
                </option>
              ))}
            </select>
          </div>

          {/* Checklist Progress Tracker */}
          <div className="w-full md:max-w-xs p-3.5 rounded-xl bg-[#E8F3E8] dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-700 dark:text-emerald-200 font-semibold">Checklist Mandor:</span>
              <span className="font-extrabold text-[#2E7D32] dark:text-emerald-400 tabular-nums">
                {doneCount} / {totalTasks} Tugas ({progressPct}%)
              </span>
            </div>
            <div className="w-full h-2 bg-white/80 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${progressPct}%` }}
                className="h-full bg-[#1E6B45] rounded-full transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Quick Crop Shortcuts */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
            Akses Cepat Komoditas Unggulan:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {quickCrops.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCropId(c.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  selectedCropId === c.id
                    ? 'bg-[#1E6B45] text-white shadow-xs font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Customized Status Banner */}
        {isCustomized && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-xs flex items-center justify-between gap-2 text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F4B544] shrink-0" />
              <span>SOP ini telah disesuaikan secara manual khusus untuk kebun Anda.</span>
            </div>
            <button
              onClick={handleResetSOP}
              className="text-xs font-semibold underline text-amber-800 dark:text-amber-300 hover:text-amber-900 shrink-0"
            >
              Reset ke Standar
            </button>
          </div>
        )}
      </div>

      {saveSuccessMsg && (
        <div className="p-3 rounded-xl bg-emerald-600 text-white text-xs font-semibold flex items-center gap-2 shadow-md animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>SOP budidaya manual berhasil diperbarui!</span>
        </div>
      )}

      {/* Timeline Phases View */}
      <div className="space-y-6">
        {phases.map((phase, index) => (
          <div
            key={`${phase.week}-${index}`}
            className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            {/* Phase Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-[#E8F3E8] dark:bg-emerald-950/60 text-[#1E6B45] dark:text-emerald-300 font-extrabold text-xs flex items-center justify-center shrink-0">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="text-base font-bold text-[#26372B] dark:text-white">{phase.title}</h3>
                  <span className="text-xs font-bold text-[#1E6B45] dark:text-emerald-400">
                    {phase.week}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {phase.description}
            </p>

            {/* Checklist Tasks */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                Checklist Mandor / Pekerja Lapangan:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {phase.tasks.map((task) => {
                  const isDone = Boolean(completedTasks[task.id]);
                  return (
                    <button
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`p-3 rounded-xl border text-left text-xs flex items-start gap-2.5 transition-colors ${
                        isDone
                          ? 'bg-[#E8F3E8] dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-slate-800 dark:text-white line-through opacity-75'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 hover:border-[#1E6B45]'
                      }`}
                    >
                      {isDone ? (
                        <CheckSquare className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      )}
                      <span className="leading-snug">{task.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tips & Key Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 text-xs flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-[#F4B544] shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-amber-900 dark:text-amber-200 block">Tips Kunci Agronom:</strong>
                  <span className="text-amber-950 dark:text-amber-100 leading-relaxed">{phase.tips}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs flex items-start gap-2.5">
                <PackageCheck className="w-4 h-4 text-[#1E6B45] shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-[#26372B] dark:text-slate-200 block">Kebutuhan Saprotan & Input:</strong>
                  <span className="text-slate-600 dark:text-slate-400 leading-relaxed">{phase.keyInputs}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: EDITOR & ISIAN MANUAL SOP BUDIDAYA                                */}
      {/* ========================================================================= */}
      {isEditorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-[#1E6B45] dark:text-emerald-400">
                  Kustomisasi Kalender Tanam
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#26372B] dark:text-white mt-0.5">
                  Sesuaikan / Edit SOP: {currentCommodity.name}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Ubah tahapan mingguan, checklist pekerjaan lapangan, dan kebutuhan pupuk sesuai teknik budidaya spesifik lahan Anda.
                </p>
              </div>
              <button
                onClick={() => setIsEditorModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Editable Phases List */}
            <div className="space-y-6 text-xs">
              {editablePhases.map((phase, pIndex) => (
                <div
                  key={pIndex}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[#1E6B45] dark:text-emerald-400 uppercase tracking-wide">
                      Tahapan #{pIndex + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeletePhase(pIndex)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Hapus tahapan ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Rentang Waktu / Minggu
                      </label>
                      <input
                        type="text"
                        value={phase.week}
                        onChange={(e) => handleUpdatePhaseField(pIndex, 'week', e.target.value)}
                        placeholder="Contoh: Minggu 1 - 3 (HST 1 - 20)"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Judul Tahapan
                      </label>
                      <input
                        type="text"
                        value={phase.title}
                        onChange={(e) => handleUpdatePhaseField(pIndex, 'title', e.target.value)}
                        placeholder="Contoh: Penanaman Bibit & Pemasangan Ajir"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Deskripsi Teknis Pengerjaan
                    </label>
                    <textarea
                      rows={2}
                      value={phase.description}
                      onChange={(e) => handleUpdatePhaseField(pIndex, 'description', e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Tasks List */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-800 dark:text-slate-200">
                        Checklist Pekerjaan Mandor:
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAddTaskToPhase(pIndex)}
                        className="text-[11px] font-semibold text-[#1E6B45] hover:underline flex items-center gap-1"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Tambah Butir Tugas</span>
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {phase.tasks.map((task, tIndex) => (
                        <div key={task.id} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={task.text}
                            onChange={(e) => handleUpdateTaskText(pIndex, tIndex, e.target.value)}
                            className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteTask(pIndex, tIndex)}
                            className="p-1 text-slate-400 hover:text-rose-500"
                            title="Hapus tugas"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tips & Key Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Tips Kunci Agronomi
                      </label>
                      <input
                        type="text"
                        value={phase.tips}
                        onChange={(e) => handleUpdatePhaseField(pIndex, 'tips', e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Kebutuhan Sarana / Input
                      </label>
                      <input
                        type="text"
                        value={phase.keyInputs}
                        onChange={(e) => handleUpdatePhaseField(pIndex, 'keyInputs', e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Add New Phase Button */}
              <button
                type="button"
                onClick={handleAddPhase}
                className="w-full py-2.5 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#1E6B45] text-slate-700 dark:text-slate-300 rounded-2xl flex items-center justify-center gap-1.5 font-bold transition-colors"
              >
                <PlusCircle className="w-4 h-4 text-[#1E6B45]" />
                <span>+ Tambah Tahapan Baru</span>
              </button>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditorModalOpen(false)}
                className="px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveCustomSOP}
                className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-[#1E6B45] hover:bg-[#165235] text-white shadow-md flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Perubahan SOP</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
