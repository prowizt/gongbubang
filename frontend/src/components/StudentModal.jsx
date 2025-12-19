import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // 👈 핵심: 팝업을 화면 맨 위로 탈출시키는 기능
import { X, Save, Check, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../api';

const StudentModal = ({ isOpen, onClose, student, onSave }) => {
  // 1. 모달이 닫혀있으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  const isEditMode = !!student; // student 데이터가 있으면 '수정 모드'

  // 2. 폼 데이터 초기값 설정
  const [formData, setFormData] = useState({
    haksaeng_nm: '',
    gender: '남자',
    chojunggo_cd: '초등',
    school_nm: '',
    haknyeon: '',
    tel_no: '',
    address: '',
    detail_address: ''
  });

  // 3. 모달 열릴 때 데이터 세팅
  useEffect(() => {
    if (student) {
      setFormData(student);
    } else {
      setFormData({
        haksaeng_nm: '',
        gender: '남자',
        chojunggo_cd: '초등',
        school_nm: '',
        haknyeon: '',
        tel_no: '',
        address: '',
        detail_address: ''
      });
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
        await api.put(`/haksaeng/${student.haksaeng_id}`, formData);
        Swal.fire({
          icon: 'success',
          title: '수정 완료!',
          text: '학생 정보가 수정되었습니다.',
          confirmButtonColor: '#4f46e5'
        });
      } else {
        await api.post('/haksaeng', formData);
        Swal.fire({
          icon: 'success',
          title: '등록 완료!',
          text: '새로운 학생이 등록되었습니다.',
          confirmButtonColor: '#4f46e5'
        });
      }
      onSave(); // 목록 새로고침
      onClose(); // 모달 닫기
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: '오류 발생',
        text: '저장 중 문제가 발생했습니다.',
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
        await api.delete(`/haksaeng/${student.haksaeng_id}`);
        await Swal.fire('삭제됨!', '학생 정보가 삭제되었습니다.', 'success');
        onSave();
        onClose();
      } catch (error) {
         Swal.fire('오류!', '삭제 중 문제가 발생했습니다.', 'error');
      }
    }
  };

  // 7. createPortal을 사용하여 <body> 태그 바로 아래에 렌더링 (사이드바 위로 덮힘 보장)
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      
      {/* 모달 박스 */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
        
        {/* 헤더 */}
        <div className="bg-indigo-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {isEditMode ? <><Check size={20}/> 학생 정보 수정</> : <><Save size={20}/> 신규 학생 등록</>}
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* 본문 (스크롤 가능) */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          {/* 학생 ID (수정 시 표시) */}
          {isEditMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
              <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 text-sm">
                {student.haksaeng_id}
              </div>
            </div>
          )}

          {/* 이름 & 성별 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이름 *</label>
              <input
                name="haksaeng_nm"
                value={formData.haksaeng_nm}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="홍길동"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="남자">남자</option>
                <option value="여자">여자</option>
              </select>
            </div>
          </div>

          {/* 학교급 & 학년 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">학교급</label>
              <select
                name="chojunggo_cd"
                value={formData.chojunggo_cd}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
              >
                <option value="초등">초등</option>
                <option value="중등">중등</option>
                <option value="고등">고등</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">학년</label>
              <input
                type="tel"
                name="haknyeon"
                value={formData.haknyeon}
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
              name="school_nm"
              value={formData.school_nm}
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
              name="tel_no"
              value={formData.tel_no}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
              placeholder="010-0000-0000"
            />
          </div>

          {/* 주소 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none mb-2"
              placeholder="기본 주소"
            />
            <input
              name="detail_address"
              value={formData.detail_address}
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
    document.body // 👈 모달을 body 태그에 직접 붙임 (사이드바 덮기 성공!)
  );
};

export default StudentModal;