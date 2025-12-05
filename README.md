# ERICA 맛집 · 카페 추천 웹사이트

## 1. 프로젝트 소개
이 프로젝트는 **한양대학교 ERICA 캠퍼스 및 한대앞역 주변의 맛집 · 카페 정보를 한 곳에서 볼 수 있는 웹사이트**를 만드는 것을 목표로 합니다.  
처음 온 학생이나, 어디서 밥/카페 갈지 고민되는 사람들을 위해 **간단하고 직관적인 추천 페이지**를 제공합니다.

---

## 2. 주요 기능

- **홈 화면**
  - 프로젝트 소개 및 메뉴 안내
- **카페 추천 페이지**
  - 한대앞 & ERICA 주변 카페 리스트 제공 (추가 예정)
  - 분위기, 가격대, 간단한 설명 등 표시 예정
- **맛집 추천 페이지**
  - 한대앞 & ERICA 주변 맛집 리스트 제공 (추가 예정)
  - 메뉴 특징, 가격대, 추천 포인트 등 표시 예정

> ※ 현재는 기본 페이지 구조만 구축된 상태이며,  
> 이후 팀원들과 함께 실제 데이터(가게 리스트, 설명 등)를 채워 넣을 예정입니다.

---

## 3. 사용 기술 (Tech Stack)

- **HTML5** – 페이지 구조 설계  
- **CSS3** – 기본 스타일링  
- **Git / GitHub** – 버전 관리 및 협업  
- **GitHub Pages** – 웹사이트 배포  

---

## 4. 페이지 구조

```text
Project/
 ├── index.html               # 홈 화면
 ├── css/
 │     └── style.css          # 전체 공통 스타일
 └── pages/
---

## 5. 팀원 구성 및 역할 (역할분담)

- **박준하 (팀장)**  
  - 원격저장소(GitHub Repository) 관리   
  - 프로젝트 기본 구조 설계  
  - 문서(README) 작성  
  - 작업 분배 및 일정 조율  

- **진승재**  
  - 프로젝트 기획  
  - 회의 내용 기록  

- **정유종**  
  - 웹페이지 코딩 및 기능 구현  
  - 페이지 연결 및 관리  

- **임성주**  
  - 웹페이지 디자인  
  - 스타일 개선 및 UI 요소 작업  

---

## 6. 실행 방법

###  GitHub Pages에서 실행 
https://pjh91234.github.io/Project/

###  로컬에서 실행 (선택)
```bash
git clone https://github.com/pjh91234/Project.git
cd Project

       ├── cafe.html          # 카페 추천 페이지
       └── restaurant.html    # 맛집 추천 페이지

## 임성주 디자인 파트
link rel="stylesheet" href="style.css"

/*전반적인 페이지 스타일 */
body {
    font-family: 'Noto Sans KR', sans-serif; 
    margin: 0;
    padding: 0;
    background-color: #f8f9fa;
    color: #343a40; 
    line-height: 1.6; 
    -webkit-font-smoothing: antialiased; 
    text-rendering: optimizeLegibility; 

/*  메인 콘텐츠 영역 컨테이너 */
.container {
    max-width: 960px; 
    margin: 40px auto;
    padding: 20px 30px; 
    background-color: #ffffff;
    border-radius: 12px; 
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
}

/* 제목 */
header {
    text-align: center; 
    margin-bottom: 40px; 
    padding-bottom: 25px; 
    border-bottom: 1px solid #e9ecef; 

h1 {
    color: #2c589b;
    font-size: 2.8em; 
    margin-bottom: 15px; 
    letter-spacing: -0.03em; 
}

p.description {
    font-size: 1.15em; 
    color: #6c757d; 
    margin-top: 0;
    line-height: 1.5;
}

/*  각 카페/맛집 정보 스타일 */
.item-card {
    background-color: #ffffff; 
    border: 1px solid #e0e0e0; 
    border-radius: 10px; 
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease; 
    display: flex; 
    flex-direction: column;
}

.item-card:hover {
    transform: translateY(-5px); 
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12); 
}

/* 각 항목의 제목 */
.item-card h2 {
    color: #333;
    font-size: 1.6em;
    margin-top: 0;
    margin-bottom: 10px;
    border-bottom: 1px dashed #e9ecef;
    padding-bottom: 8px;
    word-break: keep-all; 
}

/* 설명 텍스트 */
.item-card p {
    font-size: 0.95em;
    color: #555;
    margin-bottom: 8px;
    flex-grow: 1; 
}

/* 추가 정보 (예: 가격대, 특징) */
.item-card .info-tag {
    display: inline-block; 
    background-color: #e3f2fd; 
    color: #2196f3; 
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 0.85em;
    margin-right: 8px;
    margin-top: 5px;
    white-space: nowrap; 
}


/* 홈으로 돌아가는 버튼 */
.back-to-home {
    display: inline-block; 
    margin-top: 30px;
    padding: 12px 25px;
    background-color: #6c757d;
    color: #ffffff;
    text-decoration: none;
    border-radius: 8px;
    transition: background-color 0.2s ease, transform 0.2s ease;
    font-weight: bold;
    font-size: 1.05em;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.back-to-home:hover {
    background-color: #5a6268; 
    transform: translateY(-2px);
}

.text-center {
    text-align: center;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
    .container {
        margin: 20px auto;
        padding: 15px;
    }

    h1 {
        font-size: 2.2em;
    }

    .item-list {
        grid-template-columns: 1fr; 
    }
}
