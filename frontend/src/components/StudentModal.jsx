import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Check, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../api';

const StudentModal = ({ isOpen, onClose, student, onSave }) => {
  if (!isOpen) return null;

  const isEditMode = !!student;

  // 2. 폼 데이터 초기값 설정 (백엔드 스키마 대문자 키 사용)
  const [formData, setFormData] = useState({
    HAKSAENG_ID: '',
    HAKSAENG_NM: '',
    GENDER_CD: '1',     // 기본값: 남자
    CHOJUNGGO_CD: '1',  // 기본값: 초등
    HAKGYOMYEONG: '',
    HAKNYEON: '',
    HP_NO: '',
    ADDR1: '',
    ADDR2: ''
  });

  // 3. 모달 열릴 때 데이터 세팅
  useEffect(() => {
    if (student) {
      setFormData({
        HAKSAENG_ID: student.HAKSAENG_ID || '',
        HAKSAENG_NM: student.HAKSAENG_NM || '',
        GENDER_CD: student.GENDER_CD || '1',
        CHOJUNGGO_CD: student.CHOJUNGGO_CD || '1',
        HAKGYOMYEONG: student.HAKGYOMYEONG || '',
        HAKNYEON: student.HAKNYEON || '',
        HP_NO: student.HP_NO || '',
        ADDR1: student.ADDR1 || '',
        ADDR2: student.ADDR2 || ''
      });
    } else if (isOpen) {
      // 신규 등록: 초기화 및 ID 자동 발급
      const fetchNextId = async () => {
        try {
          const response = await api.get('/haksaeng/next-id');
          setFormData({
            HAKSAENG_ID: response.data.next_id,
            HAKSAENG_NM: '',
            GENDER_CD: '1',
            CHOJUNGGO_CD: '1',
            HAKGYOMYEONG: '',
            HAKNYEON: '',
            HP_NO: '',
            ADDR1: '',
            ADDR2: ''
          });
        } catch (error) {
          console.error("Failed to fetch next ID", error);
          setFormData({
            HAKSAENG_ID: '',
            HAKSAENG_NM: '',
            GENDER_CD: '1',
            CHOJUNGGO_CD: '1',
            HAKGYOMYEONG: '',
            HAKNYEON: '',
            HP_NO: '',
            ADDR1: '',
            ADDR2: ''
          });
        }
      };
      fetchNextId();
    }
  }, [student, isOpen]);

  // 4. 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 5. 저장(등록/수정) 핸들러
  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        // 수정 시 PUT
        await api.put(`/haksaeng/${student.HAKSAENG_ID}`, formData);
        Swal.fire({
          icon: 'success',
          title: '수정 완료!',
          text: '학생 정보가 수정되었습니다.',
          confirmButtonColor: '#4f46e5'
        });
      } else {
        // 등록 시 POST
        await api.post('/haksaeng', formData);
        Swal.fire({
          icon: 'success',
          title: '등록 완료!',
          text: '새로운 학생이 등록되었습니다.',
          confirmButtonColor: '#4f46e5'
        });
      }
      onSave();
      onClose();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: '오류 발생',
        text: '저장 중 문제가 발생했습니다.\n' + (error.response?.data?.detail || error.message),
      });
    }
  };

  // 6. 삭제 핸들러
  const handleDelete = async () => {
    if (!student) return;

    const result = await Swal.fire({
      title: '정말 삭제하시겠습니까?',
      text: "이 작업은 되돌릴 수 없습니다!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '삭제',
      cancelButtonText: '취소'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/haksaeng/${student.HAKSAENG_ID}`);
        await Swal.fire('삭제됨!', '학생 정보가 삭제되었습니다.', 'success');
        onSave();
        onClose();
      } catch (error) {
        Swal.fire('오류!', '삭제 중 문제가 발생했습니다.', 'error');
      }
    }
  };

  // 7. createPortal 사용 (z-index 조정을 통해 SweetAlert(z-1060)보다 낮게 설정: z-50)
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

      {/* 모달 박스 */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">

        {/* 헤더 */}
        <div className="bg-indigo-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {isEditMode ? <><Check size={20} /> 학생 정보 수정</> : <><Save size={20} /> 신규 학생 등록</>}
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* 본문 (스크롤 가능) */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">

          {/* 학생 ID (항상 표시: 자동발급 확인용) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID <span className="text-indigo-500 font-normal">(자동부여)</span></label>
            <div className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold ${isEditMode ? 'bg-gray-100 text-gray-500' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>
              {formData.HAKSAENG_ID || '생성 중...'}
            </div>
          </div>

          {/* 이름 & 성별 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이름 *</label>
              <input
                name="HAKSAENG_NM"
                value={formData.HAKSAENG_NM}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="홍길동"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
              <select
                name="GENDER_CD"
                value={formData.GENDER_CD}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="1">남자</option>
                <option value="2">여자</option>
              </select>
            </div>
          </div>

          {/* 학교급 & 학년 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">학교급</label>
              <select
                name="CHOJUNGGO_CD"
                value={formData.CHOJUNGGO_CD}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
              >
                <option value="1">초등</option>
                <option value="2">중등</option>
                <option value="3">고등</option>
                <option value="4">일반</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">학년</label>
              <input
                type="tel"
                name="HAKNYEON"
                value={formData.HAKNYEON}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
                placeholder="숫자"
              />
            </div>
          </div>

          {/* 학교명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">학교명</label>
            <input
              name="HAKGYOMYEONG"
              value={formData.HAKGYOMYEONG}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
              placeholder="학교 이름"
            />
          </div>

          {/* 연락처 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
            <input
              type="tel"
              name="HP_NO"
              value={formData.HP_NO}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
              placeholder="010-0000-0000"
            />
          </div>

          {/* 주소 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
            <input
              name="ADDR1"
              value={formData.ADDR1}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none mb-2"
              placeholder="기본 주소"
            />
            <input
              name="ADDR2"
              value={formData.ADDR2}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
              placeholder="상세 주소"
            />
          </div>
        </div>

        {/* 푸터 (버튼 영역) */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-2 border-t border-gray-100">
          {isEditMode && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-1 mr-auto"
            >
              <Trash2 size={18} /> 삭제
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1"
          >
            <Check size={18} /> 저장
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default StudentModal;