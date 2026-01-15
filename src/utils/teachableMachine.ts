/**
 * Teachable Machine Utility
 * 얼굴상(강아지/고양이) 분류를 위한 TensorFlow.js 래퍼
 */
import * as tmImage from '@teachablemachine/image';

const MODEL_URL = 'https://teachablemachine.withgoogle.com/models/cxrrzC2e5/';

let model: tmImage.CustomMobileNet | null = null;
let isLoading = false;

export interface PredictionResult {
    className: string;
    probability: number;
}

/**
 * 모델 로드 (싱글톤 패턴)
 */
export const loadModel = async (): Promise<tmImage.CustomMobileNet> => {
    if (model) return model;
    if (isLoading) {
        // 로딩 중이면 대기
        while (isLoading) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return model!;
    }

    isLoading = true;
    try {
        const modelURL = MODEL_URL + 'model.json';
        const metadataURL = MODEL_URL + 'metadata.json';
        model = await tmImage.load(modelURL, metadataURL);
        return model;
    } finally {
        isLoading = false;
    }
};

/**
 * 이미지 예측
 */
export const predictImage = async (
    imageElement: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement
): Promise<PredictionResult[]> => {
    const loadedModel = await loadModel();
    const predictions = await loadedModel.predict(imageElement);

    return predictions.map(p => ({
        className: p.className,
        probability: p.probability
    })).sort((a, b) => b.probability - a.probability);
};

/**
 * 가장 높은 확률의 결과 반환
 */
export const getTopPrediction = async (
    imageElement: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement
): Promise<PredictionResult> => {
    const predictions = await predictImage(imageElement);
    return predictions[0];
};

/**
 * 결과 클래스명을 FaceType으로 변환
 * (Teachable Machine 모델의 클래스명에 따라 수정 필요)
 */
export const classNameToFaceType = (className: string): 'dog' | 'cat' => {
    const lowerName = className.toLowerCase();
    if (lowerName.includes('dog') || lowerName.includes('강아지')) {
        return 'dog';
    }
    return 'cat';
};
