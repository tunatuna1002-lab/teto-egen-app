import React, { useState, useRef, useCallback } from 'react';
import { Image, Upload, Loader2, RefreshCw, Camera } from 'lucide-react';
import { GlassButton } from './GlassButton';
import { predictImage, classNameToFaceType } from '../utils/teachableMachine';
import { FaceType } from '../data/faceChemistry';

interface FaceAnalysisProps {
    onResult: (faceType: FaceType, probability: number) => void;
    onError?: (error: string) => void;
}

export const FaceAnalysis: React.FC<FaceAnalysisProps> = ({ onResult, onError }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [inputMode, setInputMode] = useState<'file' | 'camera'>('file');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    const handleFileSelect = useCallback(async (file: File) => {
        if (!file.type.startsWith('image/')) {
            onError?.('이미지 파일만 업로드할 수 있어요!');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    }, [onError]);

    const analyzeImage = useCallback(async () => {
        if (!imageRef.current) return;

        setIsLoading(true);
        try {
            const predictions = await predictImage(imageRef.current);
            const topResult = predictions[0];
            const faceType = classNameToFaceType(topResult.className);
            onResult(faceType, topResult.probability);
        } catch (error) {
            console.error('Analysis error:', error);
            onError?.('분석 중 오류가 발생했어요. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    }, [onResult, onError]);

    const handleImageLoad = useCallback(() => {
        analyzeImage();
    }, [analyzeImage]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    }, [handleFileSelect]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileSelect(file);
    }, [handleFileSelect]);

    const handleRetry = useCallback(() => {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    return (
        <div className="w-full">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture={inputMode === 'camera' ? 'user' : undefined}
                onChange={handleInputChange}
                className="hidden"
            />

            {!preview ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800">
                            🔍 얼굴 분석 모델
                        </h3>
                    </div>

                    {/* Input Toggle */}
                    <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-600">Input</span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setInputMode('file')}
                                className={`px-3 py-1.5 text-sm rounded-lg transition-all ${inputMode === 'file'
                                        ? 'bg-lovely-pink text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <Upload className="w-4 h-4 inline mr-1" />
                                파일
                            </button>
                            <button
                                onClick={() => setInputMode('camera')}
                                className={`px-3 py-1.5 text-sm rounded-lg transition-all ${inputMode === 'camera'
                                        ? 'bg-lovely-pink text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <Camera className="w-4 h-4 inline mr-1" />
                                카메라
                            </button>
                        </div>
                    </div>

                    {/* Drop Zone */}
                    <div
                        className={`mx-6 my-6 border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer ${isDragging
                                ? 'border-lovely-pink bg-lovely-pink/5 scale-[1.02]'
                                : 'border-gray-300 bg-blue-50/50 hover:border-lovely-pink hover:bg-lovely-pink/5'
                            }`}
                        onClick={handleClick}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                    >
                        <div className="flex flex-col items-center justify-center py-12 px-6">
                            <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mb-4">
                                <Image className="w-8 h-8 text-amber-500" />
                            </div>
                            <p className="text-amber-600 font-medium text-center">
                                {inputMode === 'camera'
                                    ? '클릭해서 셀카 찍기'
                                    : '파일에서 이미지를 선택하거나'}
                            </p>
                            <p className="text-amber-500 text-sm">
                                {inputMode === 'file' && '여기에 드래그 & 드롭'}
                            </p>
                        </div>
                    </div>

                    {/* Help Text */}
                    <div className="px-6 pb-4">
                        <p className="text-xs text-gray-400 text-center">
                            💡 얼굴이 잘 보이는 정면 사진일수록 분석이 정확해요!
                        </p>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800">
                            📷 분석 중인 사진
                        </h3>
                    </div>

                    {/* Image Preview */}
                    <div className="p-6">
                        <div className="relative rounded-xl overflow-hidden">
                            <img
                                ref={imageRef}
                                src={preview}
                                alt="분석할 사진"
                                onLoad={handleImageLoad}
                                className="w-full h-64 object-cover"
                            />
                            {isLoading && (
                                <div className="absolute inset-0 bg-gradient-to-br from-lovely-pink/80 to-purple-500/80 flex flex-col items-center justify-center">
                                    <Loader2 className="w-16 h-16 text-white animate-spin mb-4" />
                                    <p className="text-white font-bold text-lg">AI가 분석 중...</p>
                                    <p className="text-white/80 text-sm mt-1">
                                        강아지상? 고양이상? 🤔
                                    </p>
                                </div>
                            )}
                        </div>

                        {!isLoading && (
                            <div className="mt-4 flex justify-center">
                                <GlassButton
                                    onClick={handleRetry}
                                    variant="secondary"
                                    size="sm"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    다른 사진으로 다시 분석
                                </GlassButton>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
