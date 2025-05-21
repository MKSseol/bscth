document.addEventListener('DOMContentLoaded', function() {
    // DOM 요소 참조
    const nicknameInput = document.getElementById('nickname');
    const changeNicknameBtn = document.getElementById('changeNickname');
    const randomNicknameOptions = document.getElementById('randomNicknameOptions');
    const teamNameDiv = document.getElementById('teamName');
    const problemDiv = document.getElementById('problem');
    const ideasBoard = document.getElementById('ideasBoard');
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const adminControls = document.getElementById('adminControls');
    const publishButton = document.getElementById('publishButton');
    const saveDataButton = document.getElementById('saveDataButton');
    const resetButton = document.getElementById('resetButton');
    const startInputButton = document.getElementById('startInputButton');
    const timerContainer = document.getElementById('timerContainer');
    const timerElement = document.getElementById('timer');
    
    // 형용사 목록
    const adjectives = [
        // 성격 관련 형용사
        '귀여운', '용감한', '똑똑한', '재미있는', '부지런한', '유쾌한', '친절한', 
        '아름다운', '멋진', '신선한', '활기찬', '따뜻한', '평화로운', '건강한', 
        '자상한', '슬기로운', '행복한', '열정적인', '정직한', '책임감있는',
        // 외모/상태 관련 형용사
        '빛나는', '환한', '반짝이는', '놀라운', '우아한', '섬세한', '강력한',
        '부드러운', '작은', '큰', '날카로운', '둥근', '기나긴', '짧은', '완벽한',
        // 감정 관련 형용사
        '기쁜', '설레는', '즐거운', '상쾌한', '웃는', '씩씩한', '든든한', '편안한',
        '느긋한', '담담한', '조용한', '차분한', '활발한', '명랑한', '쾌활한',
        // 계절/자연 관련 형용사
        '봄같은', '여름같은', '가을같은', '겨울같은', '푸른', '하얀', '노란',
        '붉은', '초록의', '보랏빛', '금빛', '은빛', '새벽의', '햇살같은', '구름같은'
    ];
    
    // 명사 목록
    const nouns = [
        // 동물
        '사자', '호랑이', '코끼리', '토끼', '고양이', '강아지', '여우', 
        '다람쥐', '기린', '판다', '나비', '꿀벌', '개미', '물고기', 
        '달팽이', '참새', '독수리', '거북이', '햄스터', '앵무새',
        '펭귄', '곰', '얼룩말', '원숭이', '고릴라', '코알라', '캥거루',
        '악어', '하마', '기러기', '까치', '두루미', '부엉이', '공작새',
        // 식물
        '개나리', '장미', '진달래', '민들레', '벚꽃', '해바라기', '튤립',
        '백합', '목련', '수국', '라일락', '국화', '무궁화', '진달래', '제비꽃',
        // 자연/우주
        '바다', '하늘', '구름', '별', '달', '태양', '숲', '산', '언덕', '계곡',
        '강', '폭포', '바위', '돌', '모래', '눈꽃', '빗방울', '안개', '무지개',
        // 음식/과일
        '사과', '딸기', '바나나', '포도', '귤', '복숭아', '수박', '멜론',
        '초콜릿', '쿠키', '아이스크림', '케이크', '파이', '푸딩', '캔디'
    ];
    
    // 임의의 닉네임 생성 함수
    function generateRandomNickname() {
        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
        return randomAdjective + randomNoun;
    }
    
    // 접속할 때마다 랜덤 닉네임 생성 (기본값으로 저장하지 않음)
    let nickname = generateRandomNickname();
    nicknameInput.value = nickname;
    
    // 입력 상태 변수 - localStorage에서 초기화
    let inputEnabled = localStorage.getItem('inputEnabled') === 'true';
    
    // 타이머 변수 및 요소
    let timerInterval;
    let timerEndTime;
    let isTimerRunning = false;
    
    // 숨겨진 관리자 닉네임을 위한 변수 (실제 표시되는 닉네임)
    let displayNickname = nickname;
    
    // AI 요약 버튼 생성 및 추가
    const aiSummaryButton = document.createElement('button');
    aiSummaryButton.id = 'aiSummaryButton';
    aiSummaryButton.className = 'admin-button';
    aiSummaryButton.textContent = 'AI요약';
    aiSummaryButton.style.backgroundColor = '#9c27b0'; // 다른 버튼과 구분되는 색상
    adminControls.appendChild(aiSummaryButton);
    
    // 닉네임에 따른 권한 설정 - "관리자" 제거하고 "sseolshine"만 사용
    function setPermissions() {
        // 숨겨진 관리자 닉네임 확인
        if (nickname === 'sseolshine') {
            // 관리자 권한 부여
            displayNickname = '관리자'; // 표시 닉네임을 '관리자'로 변경
            nicknameInput.value = displayNickname; // 입력창의 값도 변경
        }
        
        const isAdmin = nickname === 'sseolshine';
        teamNameDiv.contentEditable = isAdmin.toString();
        problemDiv.contentEditable = isAdmin.toString();
        
        // 관리자 컨트롤 표시/숨김
        adminControls.style.display = isAdmin ? 'inline-block' : 'none';
    
        // 관리자인 경우 스타일 변경 및 다크 모드 적용
        if (isAdmin) {
            document.body.classList.add('dark-mode');
            
            // 관리자가 이전에 저장한 팀명과 문제 불러오기
            const savedTeamName = localStorage.getItem('teamName');
            const savedProblem = localStorage.getItem('problem');
    
            if (savedTeamName && savedTeamName.trim() !== '' && savedTeamName !== '아직 설정되지 않음') {
                teamNameDiv.textContent = savedTeamName;
            }
    
            if (savedProblem && savedProblem.trim() !== '' && savedProblem !== '아직 설정되지 않음') {
                problemDiv.textContent = savedProblem;
            }
        } else {
            document.body.classList.remove('dark-mode');
        }
    }
    
    // 닉네임 변경 버튼 클릭 이벤트 - 랜덤 닉네임 옵션 표시
    changeNicknameBtn.addEventListener('click', function() {
        // 닉네임 옵션 생성
        generateRandomNicknameOptions(6);
        
        // 닉네임 옵션, 표시/숨김 토글
        if (randomNicknameOptions.style.display === 'none') {
            randomNicknameOptions.style.display = 'block';
        } else {
            randomNicknameOptions.style.display = 'none';
        }
    });
    
    // 랜덤 닉네임 옵션 생성 함수 - 관리자 옵션 제거됨
    function generateRandomNicknameOptions(count) {
        randomNicknameOptions.innerHTML = '';
        
        // 랜덤 닉네임 옵션 추가
        for (let i = 0; i < count; i++) {
            const randomName = generateRandomNickname();
            const option = document.createElement('div');
            option.className = 'nickname-option';
            option.textContent = randomName;
            option.addEventListener('click', function() {
                nickname = randomName;
                displayNickname = nickname; // 표시 닉네임 업데이트
                nicknameInput.value = nickname;
                randomNicknameOptions.style.display = 'none';
                setPermissions();
                showNotification(`닉네임이 "${nickname}"(으)로 변경되었습니다.`);
            });
            randomNicknameOptions.appendChild(option);
        }
    }
    
    // 닉네임 입력 필드 변경 이벤트
    nicknameInput.addEventListener('change', function() {
        nickname = nicknameInput.value.trim();
        displayNickname = nickname; // 기본적으로 표시 닉네임은 입력 닉네임과 동일
        setPermissions();
        
        // 'sseolshine'인 경우 메시지 수정
        if (nickname === 'sseolshine') {
            showNotification('관리자 모드로 전환되었습니다.');
        } else {
            showNotification(`닉네임이 "${displayNickname}"(으)로 변경되었습니다.`);
        }
    });
    
    // AI 요약 함수
    async function generateAISummary() {
        // 로딩 알림 표시
        showNotification('AI 요약을 생성 중입니다...', 10000);
    
        // 팀명과 문제 가져오기
        const teamName = teamNameDiv.textContent.trim();
        const problem = problemDiv.textContent.trim();
    
        // 해결 아이디어 가져오기
        const ideas = getAllIdeas();
        
        // 아이디어가 없는 경우 처리
        if (ideas.length === 0) {
            showNotification('요약할 아이디어가 없습니다.', 3000);
            return;
        }
    
        // 프롬프트 형식으로 아이디어 포맷팅
        let ideasText = '';
        ideas.forEach(idea => {
            if (idea.content.trim() !== '') {
                ideasText += `${idea.author}: ${idea.content}\n`;
            }
        });
    
        // 프롬프트 생성
        const prompt = `당신은 성공적으로 프로젝트를 수행하는 것을 돕는 AI어시스턴트 입니다. 다음 ${teamName}에서 겪고있는 문제는 ${problem}입니다. 당신은 이를 해결하기 위해 아래에 다른 구성원들이 제안한 아이디어 중 참고할만한 아이디어를 차용하고, 거기에 덧붙여 당신의 아이디어를 제공해야 합니다. "닉네임: 아이디어"와 같이 구성된 내용들을 참고하여 답변하세요.\n\n${ideasText}`;
    
        try {
            // OpenAI API 호출
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + (localStorage.getItem('openai_api_key') || '')
                },
                body: JSON.stringify({
                    model: 'gpt-4.1-nano',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.7,
                    max_tokens: 800
                })
            });
    
            // 응답 확인
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || '요약 생성 중 오류가 발생했습니다.');
            }
    
            const data = await response.json();
            const aiSummary = data.choices[0].message.content;
    
            // 결과 표시를 위한 모달 창 생성
            displayAISummaryModal(aiSummary);
        } catch (error) {
            console.error('AI 요약 생성 오류:', error);
            
            // API 키가 없는 경우
            if (error.message.includes('API key') || !localStorage.getItem('openai_api_key')) {
                promptForAPIKey();
            } else {
                showNotification('요약 생성 중 오류: ' + error.message, 5000);
            }
        }
    }
    
    // API 키 입력 프롬프트
    function promptForAPIKey() {
        // 기존 모달 제거
        const existingModal = document.querySelector('.ai-modal-container');
        if (existingModal) {
            existingModal.remove();
        }
    
        // 모달 컨테이너 생성
        const modalContainer = document.createElement('div');
        modalContainer.className = 'ai-modal-container';
        modalContainer.style.position = 'fixed';
        modalContainer.style.top = '0';
        modalContainer.style.left = '0';
        modalContainer.style.width = '100%';
        modalContainer.style.height = '100%';
        modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        modalContainer.style.display = 'flex';
        modalContainer.style.justifyContent = 'center';
        modalContainer.style.alignItems = 'center';
        modalContainer.style.zIndex = '1000';
    
        // 모달 내용
        const modalContent = document.createElement('div');
        modalContent.className = 'ai-modal-content';
        modalContent.style.backgroundColor = '#fff';
        modalContent.style.padding = '20px';
        modalContent.style.borderRadius = '8px';
        modalContent.style.maxWidth = '500px';
        modalContent.style.width = '90%';
        modalContent.style.maxHeight = '80vh';
        modalContent.style.overflowY = 'auto';
        modalContent.style.color = '#333';
        modalContent.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
    
        // 모달 제목
        const modalTitle = document.createElement('h3');
        modalTitle.textContent = 'OpenAI API 키 입력';
        modalTitle.style.marginTop = '0';
        modalTitle.style.marginBottom = '15px';
        modalTitle.style.borderBottom = '1px solid #ddd';
        modalTitle.style.paddingBottom = '10px';
    
        // 키 입력 필드
        const apiKeyInput = document.createElement('input');
        apiKeyInput.type = 'password';
        apiKeyInput.placeholder = 'OpenAI API 키를 입력하세요';
        apiKeyInput.style.width = '100%';
        apiKeyInput.style.padding = '10px';
        apiKeyInput.style.marginBottom = '15px';
        apiKeyInput.style.border = '1px solid #ddd';
        apiKeyInput.style.borderRadius = '4px';
        apiKeyInput.style.boxSizing = 'border-box';
        apiKeyInput.value = localStorage.getItem('openai_api_key') || '';
    
        // 버튼 컨테이너
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'flex-end';
        buttonContainer.style.gap = '10px';
    
        // 취소 버튼
        const cancelButton = document.createElement('button');
        cancelButton.textContent = '취소';
        cancelButton.style.padding = '8px 15px';
        cancelButton.style.border = 'none';
        cancelButton.style.borderRadius = '4px';
        cancelButton.style.backgroundColor = '#ccc';
        cancelButton.style.cursor = 'pointer';
        cancelButton.onclick = () => modalContainer.remove();
    
        // 저장 버튼
        const saveButton = document.createElement('button');
        saveButton.textContent = '저장 및 요약 생성';
        saveButton.style.padding = '8px 15px';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '4px';
        saveButton.style.backgroundColor = '#4CAF50';
        saveButton.style.color = 'white';
        saveButton.style.cursor = 'pointer';
        saveButton.onclick = () => {
            const apiKey = apiKeyInput.value.trim();
            if (apiKey) {
                localStorage.setItem('openai_api_key', apiKey);
                modalContainer.remove();
                generateAISummary(); // API 키 저장 후 다시 요약 시도
            } else {
                alert('API 키를 입력해주세요.');
            }
        };
    
        // 요소 조합
        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(saveButton);
    
        modalContent.appendChild(modalTitle);
        modalContent.appendChild(apiKeyInput);
        modalContent.appendChild(buttonContainer);
        modalContainer.appendChild(modalContent);
    
        document.body.appendChild(modalContainer);
    
        // 포커스 설정
        apiKeyInput.focus();
    }
    
    // AI 요약 결과 표시 모달
    function displayAISummaryModal(summary) {
        // 기존 모달 제거
        const existingModal = document.querySelector('.ai-modal-container');
        if (existingModal) {
            existingModal.remove();
        }
    
        // 모달 컨테이너 생성
        const modalContainer = document.createElement('div');
        modalContainer.className = 'ai-modal-container';
        modalContainer.style.position = 'fixed';
        modalContainer.style.top = '0';
        modalContainer.style.left = '0';
        modalContainer.style.width = '100%';
        modalContainer.style.height = '100%';
        modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        modalContainer.style.display = 'flex';
        modalContainer.style.justifyContent = 'center';
        modalContainer.style.alignItems = 'center';
        modalContainer.style.zIndex = '1000';
    
        // 모달 내용
        const modalContent = document.createElement('div');
        modalContent.className = 'ai-modal-content';
        modalContent.style.backgroundColor = '#fff';
        modalContent.style.padding = '20px';
        modalContent.style.borderRadius = '8px';
        modalContent.style.maxWidth = '700px';
        modalContent.style.width = '90%';
        modalContent.style.maxHeight = '80vh';
        modalContent.style.overflowY = 'auto';
        modalContent.style.color = '#333';
        modalContent.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
    
        // 모달 제목
        const modalTitle = document.createElement('h3');
        modalTitle.textContent = 'AI 요약 결과';
        modalTitle.style.marginTop = '0';
        modalTitle.style.marginBottom = '15px';
        modalTitle.style.borderBottom = '1px solid #ddd';
        modalTitle.style.paddingBottom = '10px';
    
        // 요약 내용 표시
        const summaryContent = document.createElement('div');
        summaryContent.style.whiteSpace = 'pre-wrap';
        summaryContent.style.lineHeight = '1.5';
        summaryContent.style.marginBottom = '20px';
        summaryContent.style.padding = '10px';
        summaryContent.style.backgroundColor = '#f9f9f9';
        summaryContent.style.border = '1px solid #eee';
        summaryContent.style.borderRadius = '4px';
        summaryContent.textContent = summary;
    
        // 버튼 컨테이너
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'flex-end';
        buttonContainer.style.gap = '10px';
    
        // 닫기 버튼
        const closeButton = document.createElement('button');
        closeButton.textContent = '닫기';
        closeButton.style.padding = '8px 15px';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '4px';
        closeButton.style.backgroundColor = '#ccc';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => modalContainer.remove();
    
        // 클립보드 복사 버튼
        const copyButton = document.createElement('button');
        copyButton.textContent = '복사';
        copyButton.style.padding = '8px 15px';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '4px';
        copyButton.style.backgroundColor = '#2196F3';
        copyButton.style.color = 'white';
        copyButton.style.cursor = 'pointer';
        copyButton.onclick = () => {
            navigator.clipboard.writeText(summary)
                .then(() => {
                    copyButton.textContent = '복사됨!';
                    setTimeout(() => { copyButton.textContent = '복사'; }, 2000);
                })
                .catch(err => {
                    console.error('클립보드 복사 실패:', err);
                    alert('클립보드 복사에 실패했습니다.');
                });
        };
    
        // 브레인스토밍 공유 버튼 (공지사항으로 표시)
        const shareButton = document.createElement('button');
        shareButton.textContent = '결과 공유';
        shareButton.style.padding = '8px 15px';
        shareButton.style.border = 'none';
        shareButton.style.borderRadius = '4px';
        shareButton.style.backgroundColor = '#4CAF50';
        shareButton.style.color = 'white';
        shareButton.style.cursor = 'pointer';
        shareButton.onclick = () => {
            // 공지 배너로 요약 결과 표시
            displayAISummaryBanner(summary);
            
            // 채팅에도 메시지 추가
            addChatMessage('AI 요약', summary);
            
            // 로컬 스토리지에 요약 저장
            localStorage.setItem('aiSummary', summary);
            localStorage.setItem('aiSummaryTimestamp', new Date().toISOString());
            
            modalContainer.remove();
            showNotification('AI 요약 결과가 공유되었습니다.');
        };
    
        // 요소 조합
        buttonContainer.appendChild(closeButton);
        buttonContainer.appendChild(copyButton);
        buttonContainer.appendChild(shareButton);
    
        modalContent.appendChild(modalTitle);
        modalContent.appendChild(summaryContent);
        modalContent.appendChild(buttonContainer);
        modalContainer.appendChild(modalContent);
    
        document.body.appendChild(modalContainer);
    }
    
    // AI 요약 공지사항으로 표시
    function displayAISummaryBanner(summary) {
        // 기존 AI 요약 배너 제거
        const existingBanner = document.querySelector('.ai-summary-banner');
        if (existingBanner) {
            existingBanner.remove();
        }
        
        // 새 배너 생성
        const banner = document.createElement('div');
        banner.className = 'ai-summary-banner';
        banner.style.backgroundColor = '#9c27b0';
        banner.style.color = 'white';
        banner.style.padding = '15px';
        banner.style.margin = '10px 0';
        banner.style.borderRadius = '4px';
        banner.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        banner.style.position = 'relative';
        banner.style.zIndex = '10';
        
        // 배너 제목
        const title = document.createElement('h3');
        title.textContent = 'AI 요약 결과';
        title.style.margin = '0 0 10px 0';
        title.style.fontWeight = 'bold';
        title.style.borderBottom = '1px solid rgba(255,255,255,0.3)';
        title.style.paddingBottom = '8px';
        
        // 요약 내용
        const content = document.createElement('div');
        content.style.whiteSpace = 'pre-wrap';
        content.style.lineHeight = '1.5';
        content.style.fontSize = '15px';
        content.textContent = summary;
        
        // 타임스탬프
        const timestamp = document.createElement('div');
        timestamp.style.fontSize = '12px';
        timestamp.style.marginTop = '10px';
        timestamp.style.textAlign = 'right';
        timestamp.style.opacity = '0.8';
        timestamp.textContent = `생성 시간: ${new Date().toLocaleTimeString()}`;
        
        // 닫기 버튼
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '10px';
        closeBtn.style.right = '10px';
        closeBtn.style.border = 'none';
        closeBtn.style.background = 'transparent';
        closeBtn.style.color = 'white';
        closeBtn.style.fontSize = '20px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.onclick = () => banner.remove();
        
        // 조합
        banner.appendChild(closeBtn);
        banner.appendChild(title);
        banner.appendChild(content);
        banner.appendChild(timestamp);
        
        // 배너를 아이디어 섹션 위에 추가
        const ideasSection = document.querySelector('.ideas-section');
        ideasSection.insertBefore(banner, ideasSection.firstChild);
    }
    
    // AI 요약 버튼 클릭 이벤트
    aiSummaryButton.addEventListener('click', function() {
        // 아이디어가 있는지 확인
        const ideas = getAllIdeas();
        if (ideas.length === 0) {
            showNotification('요약할 아이디어가 없습니다.');
            return;
        }
    
        // 팀명과 문제가 설정되어 있는지 확인
        if (teamNameDiv.textContent.trim() === '' || teamNameDiv.textContent === '아직 설정되지 않음') {
            showNotification('팀명을 설정해주세요.');
            return;
        }
        
        if (problemDiv.textContent.trim() === '' || problemDiv.textContent === '아직 설정되지 않음') {
            showNotification('문제를 설정해주세요.');
            return;
        }
    
        // AI 요약 생성
        generateAISummary();
    });
    
    // 알림 표시 함수 - 시간 매개변수 추가 (기본 3초)
    function showNotification(message, duration = 3000) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // 알림 표시 애니메이션
        setTimeout(() => notification.classList.add('show'), 10);
        
        // 지정된 시간 후 알림 제거
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
    
    // 공지 배너 표시 함수
    function displayPublishBanner(teamName, problem) {
        // 기존 배너 제거
        const existingBanner = document.querySelector('.publish-banner');
        if (existingBanner) existingBanner.remove();
        
        // 새 배너 생성
        const banner = document.createElement('div');
        banner.className = 'publish-banner';
        banner.innerHTML = `<strong>공지사항</strong>: 팀명 "${teamName}" | 문제: "${problem}"`;
        
        // 문서에 배너 추가
        const container = document.querySelector('.container');
        container.insertBefore(banner, container.firstChild);
        
        // 배너 표시
        banner.style.display = 'block';
    }
    
    // 공지 버튼 클릭 이벤트
    publishButton.addEventListener('click', function() {
        if (teamNameDiv.textContent.trim() === '' || teamNameDiv.textContent === '아직 설정되지 않음') {
            showNotification('팀명을 설정해주세요.');
            return;
        }
        
        if (problemDiv.textContent.trim() === '' || problemDiv.textContent === '아직 설정되지 않음') {
            showNotification('문제를 설정해주세요.');
            return;
        }
        
        // 공지 내용 저장
        const publishData = {
            teamName: teamNameDiv.textContent,
            problem: problemDiv.textContent,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('publishedData', JSON.stringify(publishData));
        showNotification('공지가 게시되었습니다!');
        displayPublishBanner(publishData.teamName, publishData.problem);
        
        // 팀명/문제 수정이 타이머에 영향을 주지 않도록 타이머 상태 유지
        // 타이머가 이미 시작되었는지 확인
        const existingTimer = localStorage.getItem('timerEndTime');
        const timerEnded = localStorage.getItem('timerEndedAt');
        
        // 타이머 상태 유지 (게시해도 타이머 상태 변경 없음)
        if (!existingTimer && !timerEnded) {
            // 타이머가 아직 시작되지 않았으면 아무 작업도 하지 않음
        }
    });
    
    // 내용 저장 버튼 클릭 이벤트
    saveDataButton.addEventListener('click', function() {
        // 팀명, 문제, 해결 아이디어 저장
        const saveData = {
            teamName: teamNameDiv.textContent,
            problem: problemDiv.textContent,
            ideas: getAllIdeas(),
            timestamp: new Date().toISOString()
        };
        
        saveDataToFile('brainstorming_data.json', JSON.stringify(saveData, null, 2));
        showNotification('내용이 저장되었습니다!');
    });
    
    // 타이머 초기화 함수
    function resetTimer() {
        clearInterval(timerInterval);
        timerElement.textContent = '5:00';
        timerElement.className = '';
        isTimerRunning = false;
        timerContainer.style.display = 'none';
        
        // 타이머 관련 데이터 제거
        localStorage.removeItem('timerEndTime');
        localStorage.removeItem('timerEndedAt');
        
        // 관리자가 아닌 경우 입력 상태에 따라 입력 필드 업데이트
        if (nickname !== 'sseolshine') {
            updateInputState();
        }
    }
    
    // 타이머 시작 함수
    function startIdeaTimer() {
        // 타이머가 이미 실행 중이거나 입력이 비활성화된 경우 리턴
        if (isTimerRunning || !inputEnabled) return;
        
        // 타이머가 이미 종료되었는지 확인
        const timerEndedAt = localStorage.getItem('timerEndedAt');
        if (timerEndedAt) {
            // 타이머가 이미 끝났으면 입력 비활성화
            disableIdeaInput();
            timerElement.textContent = '시간 종료';
            timerElement.className = 'timer-ended';
            timerContainer.style.display = 'block';
            return;
        }
        
        // 저장된 타이머 시간이 있는지 확인
        const savedEndTime = localStorage.getItem('timerEndTime');
        
        if (savedEndTime) {
            // 저장된 타이머 종료 시간이 있으면 복원
            timerEndTime = new Date(savedEndTime);
            
            // 종료 시간이 이미 지났는지 확인
            if (new Date() >= timerEndTime) {
                endTimer();
                return;
            }
        } else {
            // 새 타이머 설정 (5분)
            timerEndTime = new Date(new Date().getTime() + 5 * 60 * 1000);
            localStorage.setItem('timerEndTime', timerEndTime.toISOString());
        }
        
        // 타이머 표시
        timerContainer.style.display = 'block';
        isTimerRunning = true;
        
        // 타이머 업데이트 인터벌 설정
        timerInterval = setInterval(updateTimer, 1000);
        updateTimer(); // 즉시 한 번 업데이트
    }
    
    // 타이머 업데이트 함수
    function updateTimer() {
        const now = new Date();
        const timeLeft = timerEndTime - now;
        
        if (timeLeft <= 0) {
            // 타이머 종료
            endTimer();
            return;
        }
        
        // 남은 시간 계산
        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        
        // 타이머 표시
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // 색상 변경
        if (timeLeft < 60000) { // 1분 미만
            timerElement.className = 'timer-danger';
        } else if (timeLeft < 120000) { // 2분 미만
            timerElement.className = 'timer-warning';
        } else {
            timerElement.className = 'timer-active';
        }
    }
    
    // 타이머 종료 함수
    function endTimer() {
        clearInterval(timerInterval);
        timerElement.textContent = '시간 종료';
        timerElement.className = 'timer-ended';
        isTimerRunning = false;
        
        // 종료 시간 저장
        localStorage.setItem('timerEndedAt', new Date().toISOString());
        
        // 입력 비활성화
        disableIdeaInput();
        
        // 시스템 메시지 추가
        addChatMessage('시스템', '브레인스토밍 시간이 종료되었습니다.');
    }
    
    // 아이디어 입력 비활성화 함수
    function disableIdeaInput() {
        if (nickname !== 'sseolshine') {
            messageInput.disabled = true;
            sendButton.disabled = true;
            messageInput.placeholder = '브레인스토밍 시간이 종료되었습니다.';
        }
    }
    
    // 초기화 버튼 클릭 이벤트
    resetButton.addEventListener('click', function() {
        if (confirm('정말로 모든 아이디어를 초기화하시겠습니까?')) {
            // 아이디어 보드 초기화
            ideasBoard.innerHTML = '';
            
            // 로컬 스토리지에서 아이디어 데이터 제거
            localStorage.removeItem('ideas');
            
            // AI 요약 제거
            localStorage.removeItem('aiSummary');
            localStorage.removeItem('aiSummaryTimestamp');
            
            // AI 요약 배너 제거
            const aiSummaryBanner = document.querySelector('.ai-summary-banner');
            if (aiSummaryBanner) {
                aiSummaryBanner.remove();
            }
            
            // 타이머 초기화
            resetTimer();
            
            // 입력 상태 초기화
            inputEnabled = false;
            updateInputState();
            
            showNotification('모든 아이디어가 초기화되었습니다.');
        }
    });
    
    // 입력시작 버튼 클릭 이벤트
    startInputButton.addEventListener('click', function() {
        // 입력 상태 토글
        inputEnabled = !inputEnabled;
        
        // 로컬 스토리지에 즉시 저장
        localStorage.setItem('inputEnabled', inputEnabled);
        
        // 버튼 상태 업데이트
        if (inputEnabled) {
            startInputButton.textContent = '입력중지';
            startInputButton.classList.add('active');
            
            // 타이머가 종료된 경우 초기화
            const timerEndedAt = localStorage.getItem('timerEndedAt');
            if (timerEndedAt) {
                resetTimer();
            }
            
            // 타이머가 실행 중이 아니면 "입력 가능" 표시
            if (!isTimerRunning && !localStorage.getItem('timerEndedAt')) {
                timerElement.textContent = '입력 가능';
                timerElement.className = 'timer-active';
                timerContainer.style.display = 'block';
            }
            
            showNotification('아이디어 입력이 시작되었습니다. 5분 타이머는 첫 아이디어 입력 시 시작됩니다.');
        } else {
            startInputButton.textContent = '입력시작';
            startInputButton.classList.remove('active');
            
            // 입력이 비활성화되면 타이머 숨기기 (종료된 경우 제외)
            if (!localStorage.getItem('timerEndedAt') && !isTimerRunning) {
                timerContainer.style.display = 'none';
            }
            
            showNotification('아이디어 입력이 중지되었습니다.');
        }
        
        // 입력 필드 상태도 강제 업데이트 (관리자의 경우 항상 활성화)
        if (nickname !== 'sseolshine') {
            const timerEnded = !!localStorage.getItem('timerEndedAt');
            messageInput.disabled = !inputEnabled || timerEnded;
            sendButton.disabled = !inputEnabled || timerEnded;
            
            if (!inputEnabled && !timerEnded) {
                messageInput.placeholder = '아직 아이디어 입력이 시작되지 않았습니다.';
            } else if (timerEnded) {
                messageInput.placeholder = '브레인스토밍 시간이 종료되었습니다.';
            } else {
                messageInput.placeholder = '아이디어를 입력하세요...';
            }
        }
    });
    
    // 입력 상태 업데이트 함수 개선
    function updateInputState() {
        // 입력 상태 로컬 스토리지에 저장
        localStorage.setItem('inputEnabled', inputEnabled);
        
        console.log("입력 상태 업데이트:", inputEnabled); // 디버깅용 로그
        
        // 버튼 텍스트 및 스타일 업데이트
        if (inputEnabled) {
            if (startInputButton) { // 요소 존재 여부 확인
                startInputButton.textContent = '입력중지';
                startInputButton.classList.add('active');
            }
            
            // 타이머가 실행 중이 아니면 "입력 가능" 표시
            if (!isTimerRunning && !localStorage.getItem('timerEndedAt')) {
                timerElement.textContent = '입력 가능';
                timerElement.className = 'timer-active';
                timerContainer.style.display = 'block';
            }
            
            // 입력 필드 상태도 업데이트
            if (nickname !== 'sseolshine') {
                messageInput.disabled = !!localStorage.getItem('timerEndedAt');
                sendButton.disabled = !!localStorage.getItem('timerEndedAt');
                
                if (localStorage.getItem('timerEndedAt')) {
                    messageInput.placeholder = '브레인스토밍 시간이 종료되었습니다.';
                } else {
                    messageInput.placeholder = '아이디어를 입력하세요...';
                }
            }
        } else {
            if (startInputButton) {
                startInputButton.textContent = '입력시작';
                startInputButton.classList.remove('active');
            }
            
            // 입력이 비활성화되면 타이머 숨기기 (종료된 경우 제외)
            if (!localStorage.getItem('timerEndedAt') && !isTimerRunning) {
                timerContainer.style.display = 'none';
            }
            
            // 입력 필드 비활성화
            if (nickname !== 'sseolshine') {
                messageInput.disabled = true;
                sendButton.disabled = true;
                messageInput.placeholder = '아직 아이디어 입력이 시작되지 않았습니다.';
            }
        }
    }
    
    // 메시지 전송 함수
    function sendMessage() {
        const messageText = messageInput.value.trim();
        if (messageText === '') return;
    
        // 입력이 비활성화되었고, 관리자가 아니면 메시지 전송 금지
        if (!inputEnabled && nickname !== 'sseolshine') {
            showNotification('아직 아이디어 입력이 시작되지 않았습니다.');
            return;
        }
        
        // 타이머가 종료되었고 관리자가 아니면 메시지 전송 금지
        const timerEndedAt = localStorage.getItem('timerEndedAt');
        if (timerEndedAt && nickname !== 'sseolshine') {
            showNotification('브레인스토밍 시간이 종료되었습니다.');
            return;
        }
    
        // 채팅 메시지 추가 (sseolshine이면 '관리자'로 표시)
        addChatMessage(displayNickname, messageText);
    
        // 일반 사용자인 경우 아이디어 포스트잇 추가
        if (nickname !== 'sseolshine') {
            addIdeaNote(displayNickname, messageText);
        }
    
        // 입력 필드 초기화
        messageInput.value = '';
    }
    
    // 채팅 메시지 추가 함수
    function addChatMessage(author, content) {
        const timestamp = new Date().toISOString();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.dataset.timestamp = timestamp;
    
        const authorDiv = document.createElement('div');
        authorDiv.className = 'author';
        authorDiv.textContent = author;
    
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = content;
    
        messageDiv.appendChild(authorDiv);
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
    
        // 스크롤을 항상 맨 아래로 유지
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // 로컬 스토리지에 메시지 저장
        saveMessage({
            author: author,
            content: content,
            timestamp: timestamp
        });
    }
    
    // 메시지 저장 함수
    function saveMessage(message) {
        let messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
        messages.push(message);
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
    
    // 아이디어 포스트잇 추가 함수 - 닉네임에 따라 색상 결정
    function addIdeaNote(author, content) {
        const timestamp = new Date().toISOString();
        
        const noteDiv = document.createElement('div');
        noteDiv.className = 'idea-note ' + getColorClassByNickname(author);
        noteDiv.dataset.timestamp = timestamp;
        noteDiv.dataset.author = author;
    
        const contentP = document.createElement('p');
        contentP.textContent = content;
    
        const authorP = document.createElement('p');
        authorP.className = 'idea-author';
        authorP.textContent = `- ${author}`;
    
        noteDiv.appendChild(contentP);
        noteDiv.appendChild(authorP);
        ideasBoard.appendChild(noteDiv);
        
        // 로컬 스토리지에 아이디어 저장
        saveIdea({
            author: author,
            content: content,
            timestamp: timestamp,
            colorClass: getColorClassByNickname(author)
        });
        
        // 첫 번째 아이디어가 입력되면 타이머 시작
        startIdeaTimer();
    }
    
    // 닉네임에 따라 포스트잇 색상 클래스 결정
    function getColorClassByNickname(nickname) {
        // 관리자는 항상 노란색
        if (nickname === '관리자') {
            return 'color-yellow';
        }
        
        // 닉네임의 첫 글자를 기준으로 색상 결정
        const firstChar = nickname.charAt(0);
        const charCode = firstChar.charCodeAt(0);
        
        const colors = [
            'color-yellow',
            'color-pink',
            'color-green',
            'color-blue',
            'color-purple',
            'color-orange',
            'color-teal'
        ];
        
        // 첫 글자의 유니코드 값을 이용하여 색상 인덱스 결정
        const colorIndex = charCode % colors.length;
        return colors[colorIndex];
    }
    
    // 아이디어 저장 함수
    function saveIdea(idea) {
        let ideas = JSON.parse(localStorage.getItem('ideas') || '[]');
        ideas.push(idea);
        localStorage.setItem('ideas', JSON.stringify(ideas));
    }
    
    // 모든 아이디어 가져오기
    function getAllIdeas() {
        const ideas = [];
        const noteElements = ideasBoard.querySelectorAll('.idea-note');
        
        noteElements.forEach(note => {
            const contentElement = note.querySelector('p:first-child');
            const authorElement = note.querySelector('.idea-author');
            
            if (contentElement && contentElement.textContent.trim() !== '') {
                ideas.push({
                    content: contentElement ? contentElement.textContent : '',
                    author: authorElement ? authorElement.textContent.replace('- ', '') : '',
                    timestamp: note.dataset.timestamp || new Date().toISOString()
                });
            }
        });
        
        return ideas;
    }
    
    // 모든 채팅 메시지 가져오기
    function getAllChatMessages() {
        const messages = [];
        const messageElements = chatMessages.querySelectorAll('.message');
        
        messageElements.forEach(message => {
            const authorElement = message.querySelector('.author');
            const contentElement = message.querySelector('.message-content');
            
            messages.push({
                author: authorElement ? authorElement.textContent : '',
                content: contentElement ? contentElement.textContent : '',
                timestamp: message.dataset.timestamp || new Date().toISOString()
            });
        });
        
        return messages;
    }
    
    // 파일로 데이터 저장 (다운로드 방식)
    function saveDataToFile(filename, data) {
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
    
    // 저장된 아이디어 불러오기
    function loadSavedIdeas() {
        const ideas = JSON.parse(localStorage.getItem('ideas') || '[]');
        
        // 아이디어 보드 초기화
        ideasBoard.innerHTML = '';
        
        ideas.forEach(idea => {
            const noteDiv = document.createElement('div');
            noteDiv.className = 'idea-note';
            noteDiv.dataset.timestamp = idea.timestamp;
            
            // 색상 클래스 추가 (저장된 색상 또는 닉네임 기반 새로 생성)
            if (idea.colorClass) {
                noteDiv.classList.add(idea.colorClass);
            } else {
                noteDiv.classList.add(getColorClassByNickname(idea.author));
            }
    
            const contentP = document.createElement('p');
            contentP.textContent = idea.content;
    
            const authorP = document.createElement('p');
            authorP.className = 'idea-author';
            authorP.textContent = `- ${idea.author}`;
    
            noteDiv.appendChild(contentP);
            noteDiv.appendChild(authorP);
            ideasBoard.appendChild(noteDiv);
        });
    }
    
    // 저장된 AI 요약 불러오기
    function loadSavedAISummary() {
        const aiSummary = localStorage.getItem('aiSummary');
        const aiSummaryTimestamp = localStorage.getItem('aiSummaryTimestamp');
        
        if (aiSummary && aiSummaryTimestamp) {
            // AI 요약 배너 표시
            displayAISummaryBanner(aiSummary);
        }
    }
    
    // 저장된 채팅 메시지 불러오기 (표시하지 않고 카운트만 저장)
    function loadSavedMessages() {
        const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
        return messages.length;
    }
    
    // 저장된 공지사항 불러오기
    function loadPublishedData() {
        const publishedData = JSON.parse(localStorage.getItem('publishedData') || 'null');
        if (publishedData) {
            displayPublishBanner(publishedData.teamName, publishedData.problem);
            teamNameDiv.textContent = publishedData.teamName;
            problemDiv.textContent = publishedData.problem;
        }
    }
    
    // 페이지 로드 시 타이머 상태 확인
    function checkTimerStatus() {
        const ideas = JSON.parse(localStorage.getItem('ideas') || '[]');
        const timerEndedAt = localStorage.getItem('timerEndedAt');
        
        if (ideas.length > 0) {
            if (timerEndedAt) {
                // 타이머가 이미 종료됨
                timerElement.textContent = '시간 종료';
                timerElement.className = 'timer-ended';
                timerContainer.style.display = 'block';
                disableIdeaInput();
            } else {
                // 아이디어가 있으면 타이머 시작
                startIdeaTimer();
            }
        }
    }
    
    // 작성 버튼 클릭 이벤트
    sendButton.addEventListener('click', sendMessage);
    
    // 엔터 키 입력 이벤트
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // 편집 중 상태 추적 변수
    let isTeamNameEditing = false;
    let isProblemEditing = false;
    
    // 관리자가 팀명과 문제를 수정하는 이벤트
    teamNameDiv.addEventListener('focus', function() {
        if (nickname === 'sseolshine') {
            isTeamNameEditing = true;
        }
    });
    
    teamNameDiv.addEventListener('blur', function() {
        if (nickname === 'sseolshine' && teamNameDiv.textContent.trim() !== '') {
            isTeamNameEditing = false;
            localStorage.setItem('teamName', teamNameDiv.textContent);
        }
    });
    
    problemDiv.addEventListener('focus', function() {
        if (nickname === 'sseolshine') {
            isProblemEditing = true;
        }
    });
    
    problemDiv.addEventListener('blur', function() {
        if (nickname === 'sseolshine' && problemDiv.textContent.trim() !== '') {
            isProblemEditing = false;
            localStorage.setItem('problem', problemDiv.textContent);
        }
    });
    
    // 실시간 데이터 업데이트 함수 (개선)
    function setupRealTimeUpdates() {
        // 마지막으로 확인한 아이디어와 메시지의 개수
        let lastIdeaCount = 0;
        let lastMessageCount = 0;
        // 입력 상태 추적을 위한 변수 추가
        let lastInputEnabledState = inputEnabled;
        // AI 요약 추적을 위한 변수
        let lastAISummaryTimestamp = localStorage.getItem('aiSummaryTimestamp') || '';
        
        // 주기적으로 새 데이터를 확인하고 업데이트
        setInterval(() => {
            // 로컬 스토리지에서 데이터 가져오기
            const ideas = JSON.parse(localStorage.getItem('ideas') || '[]');
            const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
            const aiSummaryTimestamp = localStorage.getItem('aiSummaryTimestamp') || '';
            
            // 새로운 아이디어 확인 및 추가
            if (ideas.length > lastIdeaCount) {
                // 아이디어 보드 전체 갱신 (색상 정보 포함)
                loadSavedIdeas();
                lastIdeaCount = ideas.length;
            }
            
            // 새로운 메시지 확인 (메시지는 표시하지 않고 내부 카운트만 유지)
            if (messages.length > lastMessageCount) {
                lastMessageCount = messages.length;
            }
            
            // AI 요약 변경 확인
            if (aiSummaryTimestamp !== lastAISummaryTimestamp) {
                const aiSummary = localStorage.getItem('aiSummary');
                if (aiSummary) {
                    // AI 요약 배너 표시 (이미 있으면 업데이트됨)
                    displayAISummaryBanner(aiSummary);
                }
                lastAISummaryTimestamp = aiSummaryTimestamp;
            }
            
            // 입력 가능 상태 확인 및 업데이트 (추가)
            const currentInputEnabledState = localStorage.getItem('inputEnabled') === 'true';
            if (currentInputEnabledState !== lastInputEnabledState) {
                // 입력 상태가 변경됨
                inputEnabled = currentInputEnabledState;
                lastInputEnabledState = currentInputEnabledState;
                // 입력 상태 UI 업데이트
                updateInputState();
            }
            
            // 관리자가 편집 중이 아닐 때만 공지사항 확인 및 업데이트
            if (!isTeamNameEditing && !isProblemEditing) {
                const publishedData = JSON.parse(localStorage.getItem('publishedData') || 'null');
                if (publishedData) {
                    const existingBanner = document.querySelector('.publish-banner');
                    if (!existingBanner) {
                        displayPublishBanner(publishedData.teamName, publishedData.problem);
                    }
                    
                    // 관리자가 편집 중이 아닐 때만 팀명과 문제 업데이트
                    if (nickname !== 'sseolshine' || (nickname === 'sseolshine' && !isTeamNameEditing)) {
                        if (teamNameDiv.textContent !== publishedData.teamName) {
                            teamNameDiv.textContent = publishedData.teamName;
                        }
                    }
                    
                    if (nickname !== 'sseolshine' || (nickname === 'sseolshine' && !isProblemEditing)) {
                        if (problemDiv.textContent !== publishedData.problem) {
                            problemDiv.textContent = publishedData.problem;
                        }
                    }
                }
            }
            
            // 타이머 상태 확인 (팀명/문제 수정과 무관하게 항상 진행)
            const timerEndedAt = localStorage.getItem('timerEndedAt');
            if (timerEndedAt && !isTimerRunning) {
                if (nickname !== 'sseolshine') {
                    disableIdeaInput();
                }
                timerElement.textContent = '시간 종료';
                timerElement.className = 'timer-ended';
                timerContainer.style.display = 'block';
            } else {
                // 타이머가 진행 중이면 표시
                const savedEndTime = localStorage.getItem('timerEndTime');
                if (savedEndTime && !isTimerRunning && ideas.length > 0) {
                    startIdeaTimer();
                }
            }
        }, 2000); // 2초마다 확인
    }
    
    // 모달 외부 클릭 시 닫기 이벤트 처리
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('ai-modal-container')) {
            event.target.remove();
        }
    });
    
    // CSS 스타일 추가
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .ai-modal-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            
            .ai-modal-content {
                background-color: #fff;
                padding: 20px;
                border-radius: 8px;
                max-width: 700px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                color: #333;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
            }
            
            .dark-mode .ai-modal-content {
                background-color: #333;
                color: #f5f5f5;
                border: 1px solid #555;
            }
            
            .dark-mode .ai-modal-content button {
                background-color: #555;
                color: #fff;
            }
            
            .admin-button#aiSummaryButton {
                background-color: #9c27b0;
            }
            
            .admin-button#aiSummaryButton:hover {
                background-color: #7b1fa2;
            }
            
            .ai-summary-banner {
                background-color: #9c27b0;
                color: white;
                padding: 15px;
                margin: 10px 0;
                border-radius: 4px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                position: relative;
                z-index: 10;
            }
            
            .dark-mode .ai-summary-banner {
                background-color: #7b1fa2;
            }
            
            .chat-messages {
                max-height: 200px;
                overflow-y: auto;
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 10px;
                margin-bottom: 10px;
                background-color: white;
                display: block !important; /* 채팅창 항상 표시 */
            }
            
            .dark-mode .chat-messages {
                background-color: #333;
                border-color: #555;
            }
        `;
        document.head.appendChild(style);
    }
    
    // CSS 스타일 추가
    addStyles();
    
    // DOM 조작: 채팅 메시지를 더 잘 표시하기 위해 헤더에 채팅창 나타나게 수정
    function updateChatSection() {
        // 채팅 메시지 항상 표시
        if (chatMessages) {
            chatMessages.style.display = 'block';
            chatMessages.style.maxHeight = '200px';
            chatMessages.style.overflowY = 'auto';
        }
    }
    
    // 채팅 섹션 업데이트
    updateChatSection();
    
    // 저장된 데이터 불러오기
    loadSavedIdeas();
    loadSavedMessages();
    loadPublishedData();
    loadSavedAISummary(); // AI 요약 로드
    
    // 초기 권한 설정
    setPermissions();
    
    // 페이지 로드 시 타이머 상태 확인
    checkTimerStatus();
    
    // 페이지 로드 시 입력 상태 즉시 적용
    updateInputState();
    
    // 실시간 업데이트 시작
    setupRealTimeUpdates();
    });