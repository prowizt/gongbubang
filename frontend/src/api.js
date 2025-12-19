/* import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000', // FastAPI address
});

export default api;
 */

import axios from 'axios';

// 기존에 localhost로 되어있던 부분을 지우고, 방금 만든 Render 주소로 교체합니다.
// (나중에 환경변수라는 걸로 더 멋지게 바꿀 수 있지만, 지금은 이게 제일 확실합니다!)
const api = axios.create({
    baseURL: 'https://gongbubang.onrender.com',
});

export default api;