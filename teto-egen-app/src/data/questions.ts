import { QuestionCategory } from '../types';

export interface TestQuestion {
    id: number;
    text: string;
    type: 'T' | 'E';
    category: QuestionCategory;
}

export const TEST_QUESTIONS: TestQuestion[] = [
    // T 성향 (테토) - 15문항
    { id: 1, text: "연인이 우울해할 때, 해결책을 제시하는 것이 최고의 위로라고 생각합니다", type: 'T', category: 'conflict' },
    { id: 2, text: "목표 달성을 위해서라면 당장의 즐거움은 기꺼이 희생할 수 있습니다", type: 'T', category: 'value' },
    { id: 3, text: "갈등 상황에서 감정 호소보다는 논리적인 잘잘못 따지기가 우선입니다", type: 'T', category: 'conflict' },
    { id: 4, text: "데이트 코스나 여행 계획은 제가 주도적으로 짜는 편입니다", type: 'T', category: 'lifestyle' },
    { id: 5, text: "나의 성취와 능력을 인정받을 때 가장 큰 사랑을 느낍니다", type: 'T', category: 'intimacy' },
    { id: 6, text: "돌려 말하는 것보다 직설적으로 꽂아주는 대화가 편합니다", type: 'T', category: 'basic' },
    { id: 7, text: "결정을 내릴 때 내 감정보다는 객관적 사실이 더 중요합니다", type: 'T', category: 'value' },
    { id: 8, text: "바쁠 때는 연락이 뜸해져도 서로 이해해야 한다고 봅니다", type: 'T', category: 'lifestyle' },
    { id: 9, text: "관계에서도 주도권을 잡고 리드하는 것이 마음 편합니다", type: 'T', category: 'basic' },
    { id: 10, text: "연인의 투정이나 감정 기복을 받아주는 것이 가끔 버겁습니다", type: 'T', category: 'intimacy' },
    { id: 21, text: "갈등이 생기면 시간을 갖기보다 그 자리에서 바로 풀어야 직성이 풀립니다", type: 'T', category: 'conflict' },
    { id: 22, text: "연인이 나에게 의존하기보다 각자의 삶을 주도적으로 살기를 원합니다", type: 'T', category: 'value' },
    { id: 23, text: "비효율적인 방식으로 일 처리하는 것을 보면 참기 힘들어집니다", type: 'T', category: 'lifestyle' },
    { id: 24, text: "감정적인 위로보다는 실질적인 도움을 줄 때 사랑을 느낍니다", type: 'T', category: 'intimacy' },
    { id: 25, text: "팩폭(팩트 폭력)이라도 나에게 도움이 되는 말이라면 감사합니다", type: 'T', category: 'basic' },

    // E 성향 (에겐) - 15문항
    { id: 11, text: "해결책보다는 '그랬구나'라는 공감과 맞장구가 먼저 필요합니다", type: 'E', category: 'conflict' },
    { id: 12, text: "혼자만의 성공보다 함께하는 관계의 화목함이 더 중요합니다", type: 'E', category: 'value' },
    { id: 13, text: "싸울 때 논리보다는 말투나 표정 때문에 더 상처받습니다", type: 'E', category: 'conflict' },
    { id: 14, text: "계획을 따르기보다 그날의 기분과 분위기에 맞춰 움직이고 싶습니다", type: 'E', category: 'lifestyle' },
    { id: 15, text: "사소한 배려와 따뜻한 말 한마디에서 가장 큰 사랑을 느낍니다", type: 'E', category: 'intimacy' },
    { id: 16, text: "상대방이 기분 나빠할까 봐 할 말을 속으로 삼킬 때가 많습니다", type: 'E', category: 'basic' },
    { id: 17, text: "객관적 사실보다 나와 상대방의 관계가 어떻게 될지가 더 중요합니다", type: 'E', category: 'value' },
    { id: 18, text: "아무리 바빠도 틈틈이 연락해서 서로를 확인해야 합니다", type: 'E', category: 'lifestyle' },
    { id: 19, text: "리드하기보다는 상대방의 결정에 따르는 것이 마음 편합니다", type: 'E', category: 'basic' },
    { id: 20, text: "연인의 감정 변화를 귀신같이 눈치채고 맞춰주는 편입니다", type: 'E', category: 'intimacy' },
    { id: 26, text: "싸우더라도 절대 잠수타거나 회피해서는 안 된다고 생각합니다", type: 'E', category: 'conflict' },
    { id: 27, text: "나의 모든 일상을 연인과 공유하고 사소한 것도 함께하길 원합니다", type: 'E', category: 'value' },
    { id: 28, text: "효율성보다는 함께하는 과정과 그 시간 자체에 의미를 둡니다", type: 'E', category: 'lifestyle' },
    { id: 29, text: "실질적인 도움보다는 따뜻한 눈빛과 스킨십에서 사랑을 느낍니다", type: 'E', category: 'intimacy' },
    { id: 30, text: "옳은 말이라도 내 기분을 상하게 하는 말투라면 받아들이기 힘듭니다", type: 'E', category: 'basic' },
];

export interface DiagnosisQuestion {
    id: number;
    text: string;
    dimension?: 'E' | 'N' | 'T' | 'J'; // Yes일 때 해당되는 성향
    score: number;
}

export const MBTI_DIAGNOSIS_QUESTIONS: DiagnosisQuestion[] = [
    // E vs I (Energy Source) - 8문항
    { id: 1, text: "힘든 하루를 보낸 후, 친구들과의 수다나 모임으로 스트레스를 푸는 편인가요?", dimension: 'E', score: 1 },
    { id: 2, text: "새로운 사람을 만나는 자리에서 어색함보다 호기심이나 즐거움이 더 큰가요?", dimension: 'E', score: 1 },
    { id: 3, text: "생각을 정리할 때 혼자 고민하기보다 대화를 통해 답을 찾는 편인가요?", dimension: 'E', score: 1 },
    { id: 4, text: "주목받는 상황이 되었을 때, 불편하기보다는 은근히 즐기는 편인가요?", dimension: 'E', score: 1 },
    { id: 5, text: "전화 통화가 문자나 톡보다 편하고 빠르다고 느끼나요?", dimension: 'E', score: 1 },
    { id: 31, text: "주말에 아무 약속 없이 집에만 있으면 왠지 처지거나 심심한가요?", dimension: 'E', score: 1 },
    { id: 32, text: "여럿이서 함께하는 프로젝트나 활동에서 에너지를 얻나요?", dimension: 'E', score: 1 },
    { id: 33, text: "처음 보는 사람에게도 말을 거는 것이 어렵지 않나요?", dimension: 'E', score: 1 },


    // N vs S (Information Processing) - 8문항
    { id: 6, text: "현재의 상황이나 팩트보다 미래의 가능성과 의미 부여가 더 중요한가요?", dimension: 'N', score: 1 },
    { id: 7, text: "영화나 책을 볼 때 줄거리보다 숨겨진 메시지나 상징에 집중하나요?", dimension: 'N', score: 1 },
    { id: 8, text: "일할 때 구체적인 지침보다 큰 그림과 자율성을 선호하나요?", dimension: 'N', score: 1 },
    { id: 9, text: "가끔 비현실적이고 엉뚱한 상상(멍때리기)에 깊이 빠지곤 하나요?", dimension: 'N', score: 1 },
    { id: 10, text: "남들은 지나치는 사소한 것에서 패턴이나 연관성을 잘 발견하나요?", dimension: 'N', score: 1 },
    { id: 34, text: "현실적인 대화보다는 추상적이거나 철학적인 주제의 대화를 즐기나요?", dimension: 'N', score: 1 },
    { id: 35, text: "새로운 방법이나 아이디어를 내는 것을 좋아하나요 (기존 방식 답습 싫음)?", dimension: 'N', score: 1 },
    { id: 36, text: "설명을 들을 때 세세한 디테일보다 '그래서 결론이 뭔데?'가 더 중요한가요?", dimension: 'N', score: 1 },


    // T vs F (Decision Making) - 8문항
    { id: 11, text: "고민 상담을 해줄 때, 공감보다는 실질적인 해결책을 주는 게 진정한 도움이라 생각하나요?", dimension: 'T', score: 1 },
    { id: 12, text: "논쟁이 시작되면 상대의 기분보다 '누가 옳은지' 논리적으로 따지는 게 우선인가요?", dimension: 'T', score: 1 },
    { id: 13, text: "의사결정을 할 때 '나의 가치관'보다 '객관적인 팩트와 효율'을 중요시하나요?", dimension: 'T', score: 1 },
    { id: 14, text: "상처받았다는 말을 들으면 '왜?'라는 원인 분석부터 하게 되나요?", dimension: 'T', score: 1 },
    { id: 15, text: "지나치게 감정적인 호소는 오히려 문제 해결을 방해한다고 생각하나요?", dimension: 'T', score: 1 },
    { id: 37, text: "일이 잘못되었을 때, 사람의 마음보다는 시스템이나 프로세스 문제를 먼저 보나요?", dimension: 'T', score: 1 },
    { id: 38, text: "객관적인 비평이나 지적을 감정 상하지 않고 잘 받아들이는 편인가요?", dimension: 'T', score: 1 },
    { id: 39, text: "나는 '차갑다'거나 '냉정하다'는 말을 종종 듣는 편인가요?", dimension: 'T', score: 1 },


    // J vs P (Lifestyle) - 8문항
    { id: 16, text: "여행을 갈 때 분 단위는 아니더라도 대략적인 계획이 있어야 마음이 편한가요?", dimension: 'J', score: 1 },
    { id: 17, text: "갑자기 일정이 변경되거나 돌발 상황이 생기면 스트레스를 많이 받나요?", dimension: 'J', score: 1 },
    { id: 18, text: "마감 기한이 닥치기 전에 미리 일을 끝내놓는 편인가요?", dimension: 'J', score: 1 },
    { id: 19, text: "결론을 빨리 내고 상황을 종결짓는 것(Closure)을 선호하나요?", dimension: 'J', score: 1 },
    { id: 20, text: "물건이나 파일이 제자리에 정리되어 있지 않으면 신경이 쓰이나요?", dimension: 'J', score: 1 },
    { id: 40, text: "해야 할 일의 목록(To-Do List)을 작성하고 체크하는 것을 좋아하나요?", dimension: 'J', score: 1 },
    { id: 41, text: "시작하기 전에 구체적인 계획과 단계를 설정하는 편인가요?", dimension: 'J', score: 1 },
    { id: 42, text: "놀 때도 어느 정도 계획이나 목적이 있어야 즐거운가요?", dimension: 'J', score: 1 },
];

export const DEEP_QUESTIONS = [
    { id: 1, text: "연인과 싸울 때, '내가 이겼다/졌다'는 승패의 느낌을 받곤 하나요?" },
    { id: 2, text: "상대방의 감정을 이해하기 위해 내 논리를 포기한 적이 있나요?" },
    { id: 3, text: "연애가 내 일상이나 커리어에 방해가 된다면 헤어질 수 있나요?" },
    { id: 4, text: "상대방이 나를 위해 희생하는 모습을 보면 사랑받는다고 느끼나요?" },
    { id: 5, text: "'우리'라는 말보다 '나'와 '너'라는 구분이 더 편한가요?" },
    { id: 6, text: "연인의 과거에 대해 꼬치꼬치 캐묻거나 알고 싶어 하나요?" },
    { id: 7, text: "연락 문제로 다툴 때, 빈도수(팩트)를 따지는 편인가요?" },
    { id: 8, text: "상대방이 엉뚱한 소리를 하면 맞장구치기보다 정정해주고 싶나요?" },
    { id: 9, text: "이별을 생각할 때, 추억보다는 현실적인 이유가 더 큰가요?" },
    { id: 10, text: "나의 취약한 모습을 연인에게 보여주는 것이 두렵나요?" }
];
