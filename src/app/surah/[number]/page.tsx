'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useRef } from 'react';

// Define the shape of Ayat data
interface Ayat {
    nomorAyat: number;
    teksArab: string;
    teksLatin: string;
    teksIndonesia: string;
    audio: {
        '01': string;
        '02': string;
        '03': string;
        '04': string;
        '05': string;
    };
}

// Define the shape of Surah detail data
interface SurahDetail {
    nomor: number;
    nama: string;
    namaLatin: string;
    arti: string;
    jumlahAyat: number;
    tempatTurun: string;
    audioFull: {
        '01': string;
        '02': string;
        '03': string;
        '04': string;
        '05': string;
    };
    ayat: Ayat[];
}

export default function SurahDetailPage() {
    const params = useParams();
    const nomorSurah = params.number as string;
    const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const { data, isLoading, isError } = useQuery<SurahDetail>({
        queryKey: ['surah-detail', nomorSurah],
        queryFn: async () => {
            const response = await axios.get(`https://equran.id/api/v2/surat/${nomorSurah}`);
            return response.data.data;
        },
    });

    const playAudio = (audioUrl: string, ayatNumber: number) => {
        // Stop current audio if playing
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }

        // If clicking the same ayat that's currently playing, stop it
        if (currentlyPlaying === ayatNumber) {
            setCurrentlyPlaying(null);
            return;
        }

        // Create new audio element and play
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        setCurrentlyPlaying(ayatNumber);

        audio.play().catch((error) => {
            console.error('Error playing audio:', error);
            setCurrentlyPlaying(null);
        });

        // Reset state when audio ends
        audio.onended = () => {
            setCurrentlyPlaying(null);
            audioRef.current = null;
        };

        // Handle audio errors
        audio.onerror = () => {
            setCurrentlyPlaying(null);
            audioRef.current = null;
        };
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-lg">Memuat surah...</p>
                </div>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 text-lg">Terjadi kesalahan saat memuat surah!</p>
                    <p className="text-slate-400 mt-2">Silakan coba lagi nanti.</p>
                    <Link href="/" className="inline-block mt-4 px-4 py-2 bg-slate-700 rounded hover:bg-slate-600 transition-colors">
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            <main className="container mx-auto p-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white mb-4 transition-colors">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Daftar Surah
                    </Link>

                    <div className="text-center bg-slate-800 rounded-lg p-6 border border-slate-700">
                        <h1 className="text-3xl font-bold mb-2">{data.namaLatin}</h1>
                        <p className="text-4xl font-mono mb-2 text-slate-300">{data.nama}</p>
                        <p className="text-slate-400 mb-2">{data.arti}</p>
                        <div className="flex justify-center gap-4 text-sm text-slate-500">
                            <span>{data.jumlahAyat} ayat</span>
                            <span>•</span>
                            <span>{data.tempatTurun}</span>
                        </div>
                    </div>
                </div>

                {/* Ayat List */}
                <div className="space-y-6">
                    {data.ayat.map((ayat) => (
                        <div key={ayat.nomorAyat} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                            {/* Ayat Number and Play Button */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center justify-center h-8 w-8 bg-slate-700 rounded-full text-sm font-bold">
                                    {ayat.nomorAyat}
                                </div>
                                <button
                                    onClick={() => playAudio(ayat.audio['01'], ayat.nomorAyat)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${currentlyPlaying === ayat.nomorAyat
                                            ? 'bg-green-600 hover:bg-green-700 text-white'
                                            : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                                        }`}
                                    title={currentlyPlaying === ayat.nomorAyat ? 'Stop Audio' : 'Play Audio'}
                                >
                                    {currentlyPlaying === ayat.nomorAyat ? (
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    )}
                                    <span className="text-sm">
                                        {currentlyPlaying === ayat.nomorAyat ? 'Stop' : 'Play'}
                                    </span>
                                </button>
                            </div>

                            {/* Arabic Text */}
                            <div className="text-right mb-4">
                                <p className="text-2xl leading-loose font-mono text-slate-200" dir="rtl">
                                    {ayat.teksArab}
                                </p>
                            </div>

                            {/* Latin Text */}
                            <div className="mb-4">
                                <p className="text-slate-400 italic leading-relaxed">
                                    {ayat.teksLatin}
                                </p>
                            </div>

                            {/* Indonesian Translation */}
                            <div className="mb-4">
                                <p className="text-slate-200 leading-relaxed">
                                    {ayat.teksIndonesia}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

