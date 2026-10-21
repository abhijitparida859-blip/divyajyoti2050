/**
 * ============================================================================
 *  MANTRA AUDIO CUTTER & 108× LOOPER MODAL
 * ============================================================================
 *  Enables devotees to attach high-clarity YouTube/temple recordings to any
 *  mantra in the 108 Japa Mala. Users select a local audio file, preview it,
 *  set precise start/end markers for ONE recitation cycle, test the loop, and
 *  save it directly to IndexedDB.
 * ============================================================================
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useI18n } from '../../localization/i18n';
import {
  X, Upload, Play, Pause, RotateCcw, Check, Trash2,
  Volume2, Music, Scissors, Sparkles, AlertCircle
} from 'lucide-react';
import type { Mantra } from '../../core/japa/mantra_types';
import {
  saveCustomAudio,
  deleteCustomAudio,
  type CustomAudioLoaded
} from '../../core/japa/custom_audio_storage';

export interface MantraAudioCutterModalProps {
  isOpen: boolean;
  onClose: () => void;
  mantra: Mantra;
  currentCustomAudio: CustomAudioLoaded | null;
  onAudioSaved: (saved: CustomAudioLoaded) => void;
  onAudioDeleted: () => void;
}

function fmtSec(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '00:00.0';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  const ms = Math.floor((sec % 1) * 10);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${ms}`;
}

export const MantraAudioCutterModal: React.FC<MantraAudioCutterModalProps> = ({
  isOpen,
  onClose,
  mantra,
  currentCustomAudio,
  onAudioSaved,
  onAudioDeleted,
}) => {
  const { language } = useI18n();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Cut points (seconds)
  const [cutStart, setCutStart] = useState<number>(0);
  const [cutEnd, setCutEnd] = useState<number>(4.0);

  // Testing cycle loop mode
  const [isTestingCycle, setIsTestingCycle] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const testLoopTimerRef = useRef<number | null>(null);

  // Initialize or reset when modal opens
  useEffect(() => {
    if (!isOpen) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      setIsPlaying(false);
      setIsTestingCycle(false);
      return;
    }

    if (currentCustomAudio) {
      setAudioUrl(currentCustomAudio.url);
      setCutStart(currentCustomAudio.start);
      setCutEnd(currentCustomAudio.end);
      setSelectedFile(null);
    } else {
      setCutStart(0);
      setCutEnd(4.0);
      setAudioUrl(null);
      setSelectedFile(null);
    }
    setStatusMsg(null);
  }, [isOpen, currentCustomAudio]);

  // Handle local audio file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/') && !/\.(mp3|wav|m4a|aac|ogg|opus)$/i.test(file.name)) {
      setStatusMsg(
        language === 'or'
          ? 'ଅମାନ୍ୟ ଅଡିଓ ଫାଇଲ୍! ଦୟାକରି MP3, WAV କିମ୍ବା M4A ଫାଇଲ୍ ବାଛନ୍ତୁ।'
          : language === 'hi'
          ? 'अमान्य ऑडियो फ़ाइल! कृपया MP3, WAV या M4A फ़ाइल चुनें।'
          : 'Invalid audio file! Please select MP3, WAV, or M4A.'
      );
      return;
    }

    setSelectedFile(file);
    const newUrl = URL.createObjectURL(file);
    setAudioUrl(newUrl);
    setCutStart(0);
    setCurrentTime(0);
    setIsPlaying(false);
    setIsTestingCycle(false);
    setStatusMsg(null);
  };

  const handleLoadedMetadata = () => {
    const a = audioRef.current;
    if (!a) return;
    const dur = a.duration || 0;
    setDuration(dur);
    if (!currentCustomAudio || selectedFile) {
      setCutEnd(Math.min(dur, 10.0));
    }
  };

  const handleTimeUpdate = () => {
    const a = audioRef.current;
    if (!a) return;
    setCurrentTime(a.currentTime);

    // If testing single cycle loop: loop back when reaching cutEnd
    if (isTestingCycle) {
      if (a.currentTime >= cutEnd) {
        a.currentTime = cutStart;
        a.play().catch(() => {});
      }
    }
  };

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;

    if (isPlaying) {
      a.pause();
      setIsPlaying(false);
      setIsTestingCycle(false);
    } else {
      setIsTestingCycle(false);
      a.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const testSingleCycle = () => {
    const a = audioRef.current;
    if (!a) return;

    a.currentTime = cutStart;
    setIsTestingCycle(true);
    a.play().then(() => {
      setIsPlaying(true);
    }).catch(() => {
      setIsPlaying(false);
      setIsTestingCycle(false);
    });
  };

  const handleSeek = (time: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = time;
    setCurrentTime(time);
  };

  const setStartToCurrent = () => {
    const s = Math.max(0, Math.min(currentTime, cutEnd - 0.2));
    setCutStart(parseFloat(s.toFixed(2)));
  };

  const setEndToCurrent = () => {
    const e = Math.min(duration || currentTime, Math.max(cutStart + 0.2, currentTime));
    setCutEnd(parseFloat(e.toFixed(2)));
  };

  const handleSave = async () => {
    if (!selectedFile && !currentCustomAudio) {
      setStatusMsg(
        language === 'or'
          ? 'ଦୟାକରି ପ୍ରଥମେ ଏକ ଅଡିଓ ଫାଇଲ୍ ବାଛନ୍ତୁ!'
          : language === 'hi'
          ? 'कृपया पहले एक ऑडियो फ़ाइल चुनें!'
          : 'Please select an audio file first!'
      );
      return;
    }

    if (cutEnd <= cutStart) {
      setStatusMsg(
        language === 'or'
          ? 'ଶେଷ ସମୟ ନିଶ୍ଚିତ ଭାବେ ଆରମ୍ଭ ସମୟଠାରୁ ଅଧିକ ହେବା ଆବଶ୍ୟକ।'
          : language === 'hi'
          ? 'समाप्ति समय प्रारंभ समय से अधिक होना चाहिए।'
          : 'End time must be greater than start time.'
      );
      return;
    }

    try {
      setIsSaving(true);
      const blob = selectedFile || currentCustomAudio?.record.blob;
      if (!blob) throw new Error('No audio blob found.');

      const fileName = selectedFile?.name || currentCustomAudio?.fileName || 'mantra.mp3';
      const saved = await saveCustomAudio(mantra.id, blob, cutStart, cutEnd, fileName);
      onAudioSaved(saved);
      setIsSaving(false);
      onClose();
    } catch (err: any) {
      setIsSaving(false);
      setStatusMsg(err?.message || 'Error saving audio.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCustomAudio(mantra.id);
      onAudioDeleted();
      onClose();
    } catch (err: any) {
      setStatusMsg(err?.message || 'Error removing audio.');
    }
  };

  if (!isOpen) return null;

  const cycleDuration = Math.max(0, cutEnd - cutStart);
  const mantraTitle = mantra.name[language as 'or' | 'hi' | 'en'] || mantra.name.en;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-cosmic-950 border border-cosmic-gold/40 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-300">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>{language === 'or' ? 'ମନ୍ତ୍ର ଅଡିଓ କଟର୍ ଓ ଲୁପର୍' : language === 'hi' ? 'मंत्र ऑडियो कटर एवं लूपर' : 'Mantra Audio Cutter & Looper'}</span>
              </h3>
              <p className="text-xs text-amber-300/80 font-medium">
                {mantraTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Informational Guidance */}
        <div className="bg-gradient-to-r from-amber-950/30 via-cosmic-900/40 to-amber-950/20 border border-amber-500/20 rounded-2xl p-3.5 mb-4 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            {language === 'or'
              ? 'YouTube ବା ଆପଣଙ୍କ ଫୋନ୍‌ରୁ ଡାଉନଲୋଡ୍ କରିଥିବା କୌଣସି ବି MP3/WAV ଅଡିଓ ବାଛନ୍ତୁ। ମନ୍ତ୍ରର ୧ ଥର ଉଚ୍ଚାରଣ ହେଉଥିବା ଆରମ୍ଭ (Start) ଓ ଶେଷ (End) ସେକେଣ୍ଡ ବାଛନ୍ତୁ। ଏହା ସ୍ୱୟଂଚାଳିତ ଭାବେ ୧୦୮ ଥର ଲୁପ୍‌ରେ ବାଜି ମାଳା ଗଣତି କରିବ।'
              : language === 'hi'
              ? 'यूट्यूब या फ़ोन से डाउनलोड किया गया कोई भी MP3/WAV ऑडियो चुनें। मंत्र के 1 उच्चारण का प्रारंभ और समाप्ति समय सेट करें। यह स्वतः 108 बार लूप में बज कर माला गिनेगा।'
              : 'Select any MP3/WAV chant audio. Set start & end markers for 1 recitation cycle. The app will loop it seamlessly 108 times and advance the mala automatically.'}
          </span>
        </div>

        {/* Audio Element */}
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            preload="metadata"
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => {
              if (!isTestingCycle) setIsPlaying(false);
            }}
          />
        )}

        {/* File Picker or Active Audio Badge */}
        <div className="space-y-3 mb-5">
          <label className="block text-xs font-semibold text-slate-300">
            {language === 'or' ? 'ଅଡିଓ ଫାଇଲ୍ ବାଛନ୍ତୁ (MP3 / WAV / M4A)' : language === 'hi' ? 'ऑडियो फ़ाइल चुनें (MP3 / WAV / M4A)' : 'Select Audio File (MP3 / WAV / M4A)'}
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <label className="flex-1 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-cosmic-900 border border-dashed border-amber-400/40 hover:border-amber-400 text-amber-200 text-xs font-bold cursor-pointer transition-all hover:bg-cosmic-800/80">
              <Upload className="w-4 h-4 text-amber-400" />
              <span>
                {selectedFile
                  ? selectedFile.name
                  : currentCustomAudio
                  ? `${currentCustomAudio.fileName} (Active)`
                  : (language === 'or' ? '📂 ଫାଇଲ୍ ଅପଲୋଡ୍ କରନ୍ତୁ' : language === 'hi' ? '📂 फ़ाइल अपलोड करें' : '📂 Upload Audio File')}
              </span>
              <input
                type="file"
                accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.opus"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {currentCustomAudio && !selectedFile && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3.5 py-3 rounded-2xl bg-rose-950/40 border border-rose-500/30 hover:border-rose-400 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Remove custom audio"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === 'or' ? 'ହଟାନ୍ତୁ' : language === 'hi' ? 'हटाएँ' : 'Remove'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Audio Player & Scrubbing */}
        {audioUrl ? (
          <div className="bg-cosmic-900/60 border border-slate-800 rounded-2xl p-4 space-y-4 mb-5">
            {/* Play / Pause & Time readout */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  className={`p-3 rounded-2xl flex items-center justify-center text-white transition-all ${
                    isPlaying
                      ? 'bg-amber-600 shadow-lg shadow-amber-500/30'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20 hover:scale-105'
                  }`}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <div>
                  <div className="text-sm font-bold text-slate-100 font-mono">
                    {fmtSec(currentTime)} <span className="text-xs text-slate-400">/ {fmtSec(duration)}</span>
                  </div>
                  <div className="text-[10px] text-amber-300 font-medium">
                    {isTestingCycle ? (language === 'or' ? '🔄 ୧ ଚକ୍ର ଲୁପ୍ ପରୀକ୍ଷା ଚାଲିଛି...' : language === 'hi' ? '🔄 1 चक्र लूप परीक्षण जारी...' : '🔄 Testing 1-cycle loop...') : ''}
                  </div>
                </div>
              </div>

              {/* Test Cycle Loop Button */}
              <button
                type="button"
                onClick={testSingleCycle}
                className="px-3 py-2 rounded-xl bg-violet-950/60 border border-violet-400/40 text-violet-200 text-xs font-bold hover:bg-violet-900/50 flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-violet-300" />
                <span>{language === 'or' ? '୧ ଚକ୍ର ପରୀକ୍ଷା' : language === 'hi' ? '1 चक्र टेस्ट' : 'Test Loop'}</span>
              </button>
            </div>

            {/* Timeline Scrubber */}
            <div className="space-y-1.5">
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.05}
                value={currentTime}
                onChange={(e) => handleSeek(parseFloat(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>00:00.0</span>
                <span>{fmtSec(duration)}</span>
              </div>
            </div>

            {/* Loop Cutter Segment Markers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
              {/* Start Point */}
              <div className="bg-cosmic-950/70 border border-slate-800 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>{language === 'or' ? 'ଆରମ୍ଭ ବିନ୍ଦୁ (Start)' : language === 'hi' ? 'प्रारंभ समय (Start)' : 'Start Point'}</span>
                  <span className="font-mono text-emerald-400">{fmtSec(cutStart)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCutStart(prev => Math.max(0, parseFloat((prev - 0.2).toFixed(2))))}
                    className="px-2 py-1 bg-slate-800 text-slate-200 rounded text-xs font-bold"
                  >
                    -0.2s
                  </button>
                  <input
                    type="number"
                    step={0.1}
                    min={0}
                    max={cutEnd}
                    value={cutStart}
                    onChange={(e) => setCutStart(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="flex-1 bg-cosmic-900 border border-slate-700 rounded px-2 py-1 text-xs text-center font-mono text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={() => setCutStart(prev => Math.min(cutEnd - 0.2, parseFloat((prev + 0.2).toFixed(2))))}
                    className="px-2 py-1 bg-slate-800 text-slate-200 rounded text-xs font-bold"
                  >
                    +0.2s
                  </button>
                </div>
                <button
                  type="button"
                  onClick={setStartToCurrent}
                  className="w-full py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold hover:bg-emerald-900/40 transition-colors"
                >
                  ⏱️ {language === 'or' ? `ଏହି ସମୟକୁ Start କରନ୍ତୁ (${currentTime.toFixed(1)}s)` : language === 'hi' ? `वर्तमान समय को Start करें (${currentTime.toFixed(1)}s)` : `Mark Current as Start (${currentTime.toFixed(1)}s)`}
                </button>
              </div>

              {/* End Point */}
              <div className="bg-cosmic-950/70 border border-slate-800 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>{language === 'or' ? 'ଶେଷ ବିନ୍ଦୁ (End)' : language === 'hi' ? 'समाप्ति समय (End)' : 'End Point'}</span>
                  <span className="font-mono text-amber-400">{fmtSec(cutEnd)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCutEnd(prev => Math.max(cutStart + 0.2, parseFloat((prev - 0.2).toFixed(2))))}
                    className="px-2 py-1 bg-slate-800 text-slate-200 rounded text-xs font-bold"
                  >
                    -0.2s
                  </button>
                  <input
                    type="number"
                    step={0.1}
                    min={cutStart}
                    max={duration || 600}
                    value={cutEnd}
                    onChange={(e) => setCutEnd(Math.max(cutStart + 0.1, parseFloat(e.target.value) || 0))}
                    className="flex-1 bg-cosmic-900 border border-slate-700 rounded px-2 py-1 text-xs text-center font-mono text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={() => setCutEnd(prev => Math.min(duration || 600, parseFloat((prev + 0.2).toFixed(2))))}
                    className="px-2 py-1 bg-slate-800 text-slate-200 rounded text-xs font-bold"
                  >
                    +0.2s
                  </button>
                </div>
                <button
                  type="button"
                  onClick={setEndToCurrent}
                  className="w-full py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[11px] font-semibold hover:bg-amber-900/40 transition-colors"
                >
                  ⏱️ {language === 'or' ? `ଏହି ସମୟକୁ End କରନ୍ତୁ (${currentTime.toFixed(1)}s)` : language === 'hi' ? `वर्तमान समय को End करें (${currentTime.toFixed(1)}s)` : `Mark Current as End (${currentTime.toFixed(1)}s)`}
                </button>
              </div>
            </div>

            {/* Cycle summary duration badge */}
            <div className="text-center bg-cosmic-950/80 border border-cosmic-gold/20 py-2 px-3 rounded-xl">
              <span className="text-xs text-slate-400">
                {language === 'or' ? '୧ ମନ୍ତ୍ର ଚକ୍ରର ଅବଧି: ' : language === 'hi' ? '1 मंत्र चक्र की अवधि: ' : '1-Cycle Recitation Length: '}
              </span>
              <span className="text-sm font-bold font-mono text-cosmic-gold">
                {cycleDuration.toFixed(2)} {language === 'or' ? 'ସେକେଣ୍ଡ' : language === 'hi' ? 'सेकंड' : 'seconds'}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                (108× = {((cycleDuration * 108) / 60).toFixed(1)} {language === 'or' ? 'ମିନିଟ୍ ସାଧନା' : language === 'hi' ? 'मिनट साधना' : 'mins total sadhana'})
              </span>
            </div>
          </div>
        ) : (
          <div className="border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs mb-5 space-y-2">
            <Music className="w-8 h-8 mx-auto text-slate-600 mb-1" />
            <p>{language === 'or' ? 'କୌଣସି ଅଡିଓ ଫାଇଲ୍ ବଛାଯାଇନାହିଁ। ଉପରୁ ଏକ MP3 ବାଛନ୍ତୁ।' : language === 'hi' ? 'कोई ऑडियो फ़ाइल नहीं चुनी गई। ऊपर से एक MP3 चुनें।' : 'No audio file selected yet. Please upload an MP3 above.'}</p>
          </div>
        )}

        {/* Error / Status Message */}
        {statusMsg && (
          <div className="p-3 mb-4 rounded-xl bg-amber-950/50 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            {language === 'or' ? 'ବାତିଲ୍ କରନ୍ତୁ' : language === 'hi' ? 'रद्द करें' : 'Cancel'}
          </button>

          <button
            type="button"
            disabled={!audioUrl || isSaving}
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-black flex items-center gap-2 shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Check className="w-4 h-4" />
            <span>
              {isSaving
                ? (language === 'or' ? 'ସେଭ୍ ହେଉଛି...' : language === 'hi' ? 'सेव हो रहा है...' : 'Saving...')
                : (language === 'or' ? '💾 ସେଭ୍ କରନ୍ତୁ ଓ ୧୦୮ ଜପରେ ବ୍ୟବହାର କରନ୍ତୁ' : language === 'hi' ? '💾 सेव करें और 108 जप में उपयोग करें' : '💾 Save & Use for 108 Japa')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
