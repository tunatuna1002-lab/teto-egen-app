import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, Loader2, RefreshCw } from 'lucide-react';
import { GlassCard } from './GlassCard';
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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    const handleFileSelect = useCallback(async (file: File) => {
        if (!file.type.startsWith('image/')) {
            onError?.('이미지 파일만 업로드할 수 있어요!');
            return;
        }

        // 미리보기 생성
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
                capture="user"
                onChange={handleInputChange}
                className="hidden"
            />

            {!preview ? (
                <GlassCard
                    className={`cursor-pointer transition-all duration-300 ${isDragging ? 'ring-2 ring-lovely-pink scale-[1.02]' : ''
                        }`}
                    padding="lg"
                    onClick={handleClick}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    <div className="flex flex-col items-center justify-center py-8">
                        <div className="w-20 h-20 rounded-full bg-lovely-pink/10 flex items-center justify-center mb-4">
                            <Camera className="w-10 h-10 text-lovely-pink" />
                        </div>
                        <h3 className="text-lg font-bold text-charcoal mb-2">
                            사진을 올려주세요
                        </h3>
                        <p className="text-sm text-charcoal-light text-center mb-4">
                            얼굴이 잘 보이는 사진일수록<br />분석이 정확해요! 📸
                        </p>
                        <div className="flex items-center gap-2 text-xs text-charcoal-light">
                            <Upload className="w-4 h-4" />
                            <span>클릭하거나 드래그해서 업로드</span>
                        </div>
                    </div>
                </GlassCard>
            ) : (
                <GlassCard padding="md">
                    <div className="relative">
                        <img
                            ref={imageRef}
                            src={preview}
                            alt="분석할 사진"
                            onLoad={handleImageLoad}
                            className="w-full h-64 object-cover rounded-xl"
                        />
                        {isLoading && (
                            <div className="absolute inset-0 bg-black/50 rounded-xl flex flex-col items-center justify-center">
                                <Loader2 className="w-12 h-12 text-white animate-spin mb-3" />
                                <p className="text-white font-medium">AI가 분석 중...</p>
                                <p className="text-white/70 text-sm">잠시만 기다려주세요 🔍</p>
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
                </GlassCard>
            )}
        </div>
    );
};
