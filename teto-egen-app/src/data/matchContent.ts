export interface MatchAnalysis {
    summary: string;
    title: string;
    chemistry: string;
    relationship_type: string;
    advice: {
        strength: string;
        warning: string;
        action_item: string;
    };
}

export const getMatchAnalysis = (
    selfType: '테토형' | '에겐형' | '반반(믹스형)',
    otherType: '테토형' | '에겐형' | '반반(믹스형)',
    _attractionScore: number
): MatchAnalysis => {
    // 1. 유형 조합 (9가지 경우의 수 -> 5가지 그룹으로 축소)

    // Case 1: 테토 x 에겐 (반대 성향) - 가장 드라마틱함
    if (
        (selfType === '테토형' && otherType === '에겐형') ||
        (selfType === '에겐형' && otherType === '테토형')
    ) {
        return {
            summary: "🔥 서로 달라서 미친 듯이 끌리는 '자석 커플'",
            title: "냉정과 열정 사이, 도파민 폭발하는 관계",
            chemistry: "한 명은 현실을 보고 한 명은 꿈을 꾸네요. 서로 없는 부분을 기가 막히게 채워주니 처음엔 눈에서 불꽃이 튈 겁니다. 테토는 에겐의 따뜻함에 녹아내리고, 에겐은 테토의 결단력에 반하게 되죠.",
            relationship_type: "상호 보완적 성장형 커플 (단, 싸울 땐 전쟁)",
            advice: {
                strength: "서로의 약점을 완벽하게 커버해 줄 수 있는 환상의 팀워크",
                warning: "싸울 때가 문제입니다. 테토는 '해결'하려 들고 에겐은 '공감'받길 원해서 대화가 안 끝날 수도...",
                action_item: "싸울 때 테토는 '그랬구나' 먼저 하고, 에겐은 '결론은 이거야'라고 말해주세요."
            }
        };
    }

    // Case 2: 테토 x 테토 (같은 성향)
    if (selfType === '테토형' && otherType === '테토형') {
        return {
            summary: "🤝 말하지 않아도 통하는 '성공 파트너'",
            title: "효율 200%, 성공을 향해 달리는 전우애",
            chemistry: "답답한 거 딱 질색인 두 분이 만났네요. 데이트 코스 짤 때 5분 컷 가능? 불필요한 감정 소모 없이 쿨한 관계가 유지됩니다. 서로의 커리어를 응원해주는 든든한 지원군이 될 거예요.",
            relationship_type: "가장 생산적이고 스마트한 커플",
            advice: {
                strength: "군더더기 없는 깔끔한 의사소통과 의사결정",
                warning: "너무 일적으로만 대화할 수 있어요. 연애는 논리가 아닙니다!",
                action_item: "일주일에 한 번은 '생산성 없는' 멍때리는 데이트를 무조건 하세요."
            }
        };
    }

    // Case 3: 에겐 x 에겐 (같은 성향)
    if (selfType === '에겐형' && otherType === '에겐형') {
        return {
            summary: "☁️ 몽글몽글 솜사탕 같은 '힐링 커플'",
            title: "서로의 눈물 버튼, 감성 충만한 로맨스",
            chemistry: "눈빛만 봐도 '아, 오늘 힘들었구나' 바로 알죠? 서로 배려하고 아껴주느라 하루가 다 갑니다. 세상 험한 일들로부터 서로를 지켜주는 따뜻한 벙커 같은 연애를 하겠군요.",
            relationship_type: "정서적 지지가 가장 강력한 소울메이트",
            advice: {
                strength: "누구보다 깊은 정서적 유대감과 안정감",
                warning: "둘 다 결정을 미루다가 데이트 장소 못 정해서 집 앞에만 있을 수도...",
                action_item: "메뉴 결정은 가위바위보로 하세요. 서로 양보하다가 굶습니다."
            }
        };
    }

    // Case 4: 반반 x 반반 (비슷한 성향)
    if (selfType === '반반(믹스형)' && otherType === '반반(믹스형)') {
        return {
            summary: "⚖️ 더할 나위 없이 완벽한 '황금 밸런스'",
            title: "티키타카가 제일 잘 되는 베스트 프렌드",
            chemistry: "둘 다 상황에 맞춰서 변신이 가능한 능력자들이라, 때로는 친구처럼 때로는 연인처럼 지루할 틈이 없습니다. 어떤 주제로 대화해도 물 흐르듯이 이어지는 편안함이 제일 큰 무기!",
            relationship_type: "안정감과 재미를 다 잡은 육각형 커플",
            advice: {
                strength: "갈등 상황에서도 유연하게 대처하는 성숙함",
                warning: "너무 무난해서 가끔은 '우리 좀 심심한가?' 싶을 수도 있어요.",
                action_item: "가끔은 서로 예측 불가능한 서프라이즈 이벤트를 준비해 보세요."
            }
        };
    }

    // Case 5: 반반 x (테토 or 에겐)
    return {
        summary: "🌈 누구와도 잘 어울리는 '카멜레온 케미'",
        title: "한 쪽이 이끌고 한 쪽이 맞춰주는 안정적인 관계",
        chemistry: "한쪽이 확실한 색깔을 내면, 다른 한쪽(반반형)이 기가 막히게 맞춰줍니다. 반반형이 통역사 역할을 해주기 때문에 큰 싸움 없이 서로를 이해하며 발전할 수 있는 건강한 관계입니다.",
        relationship_type: "서로에게 배우며 성장하는 학습형 커플",
        advice: {
            strength: "치우치지 않는 균형 잡힌 시각 공유",
            warning: "맞춰주는 쪽(반반형)이 혼자 참다가 나중에 터질 수 있어요.",
            action_item: "반반형이 '아무거나'라고 말하지 않도록, 취향을 물어봐 주세요."
        }
    };
};
