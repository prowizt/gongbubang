import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Trash2, User, Phone, MapPin, School, Calendar, BookOpen, Edit2, Save, Undo } from 'lucide-react';
import api from '../api';
import Swal from 'sweetalert2';

const StudentDetailModal = ({ isOpen, onClose, student, onDeleteSuccess }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(null);

    useEffect(() => {
        if (student) {
            setEditForm({
                HAKSAENG_NM: student.HAKSAENG_NM,
                GENDER_CD: student.GENDER_CD,
                HAKGYOMYEONG: student.HAKGYOMYEONG,
                CHOJUNGGO_CD: student.CHOJUNGGO_CD,
                HAKNYEON: student.HAKNYEON,
                HP_NO: student.HP_NO,
                ADDR1: student.ADDR1,
                ADDR2: student.ADDR2,
            });
            setIsEditing(false); // Reset edit mode on open/change
        }
    }, [student, isOpen]);

    if (!isOpen || !student) return null;

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            await api.put(`/haksaeng/${student.HAKSAENG_ID}`, editForm);
            await Swal.fire({
                title: '수정 완료',
                text: '학생 정보가 성공적으로 수정되었습니다.',
                icon: 'success',
                confirmButtonColor: '#3085d6'
            });
            setIsEditing(false);
            onDeleteSuccess(); // Trigger validation/refresh parent
            onClose();
        } catch (error) {
            console.error("Update failed", error);
            Swal.fire({
                title: '수정 실패',
                text: error.response?.data?.detail || error.message,
                icon: 'error',
                confirmButtonColor: '#d33'
            });
        }
    };

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: '정말로 삭제하시겠습니까?',
            text: "삭제된 데이터는 복구할 수 없습니다.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '네, 삭제합니다',
            cancelButtonText: '취소'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/haksaeng/${student.HAKSAENG_ID}`);
                await Swal.fire({
                    title: '삭제 완료!',
                    text: '학생 데이터가 삭제되었습니다.',
                    icon: 'success',
                    confirmButtonColor: '#3085d6'
                });
                onDeleteSuccess();
                onClose();
            } catch (error) {
                console.error("Delete failed", error);
                Swal.fire({
                    title: '삭제 실패',
                    text: error.response?.data?.detail || error.message,
                    icon: 'error',
                    confirmButtonColor: '#d33'
                });
            }
        }
    };

    // Helper to format codes
    const formatGender = (code) => {
        if (code === '1') return '남자';
        if (code === '2') return '여자';
        return '-';
    };

    const formatSchoolLevel = (code) => {
        switch (code) {
            case '1': return '초등';
            case '2': return '중등';
            case '3': return '고등';
            case '4': return '일반';
            default: return '-';
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100">
                {/* Header */}
                <div className="bg-[#1e3a8a] px-6 py-5 flex justify-between items-start text-white relative overflow-hidden">
                    <div className="relative z-10 w-full pr-8">
                        {isEditing ? (
                            <input
                                type="text"
                                name="HAKSAENG_NM"
                                value={editForm?.HAKSAENG_NM || ''}
                                onChange={handleEditChange}
                                className="text-2xl font-bold bg-transparent border-b border-blue-400 focus:border-white outline-none w-full placeholder-blue-300 text-white"
                                placeholder="이름 입력"
                            />
                        ) : (
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                {student.HAKSAENG_NM}
                            </h2>
                        )}
                        <p className="text-blue-200 text-sm mt-1 font-mono">ID: {student.HAKSAENG_ID}</p>
                    </div>
                    <button onClick={onClose} className="absolute right-4 top-4 text-blue-200 hover:text-white transition-colors bg-blue-900 bg-opacity-30 hover:bg-opacity-50 p-1.5 rounded-full z-20">
                        <X size={20} />
                    </button>
                    <div className="absolute -right-6 -bottom-10 text-blue-900 opacity-20">
                        <User size={150} />
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                            <div className="p-2 bg-white rounded-full shadow-sm text-blue-600"><User size={18} /></div>
                            <div className="w-full">
                                <p className="text-xs font-semibold text-gray-500 uppercase">성별</p>
                                {isEditing ? (
                                    <select name="GENDER_CD" value={editForm?.GENDER_CD || ''} onChange={handleEditChange} className="w-full mt-1 p-1 bg-white border border-gray-300 rounded text-sm">
                                        <option value="">선택</option>
                                        <option value="1">남자</option>
                                        <option value="2">여자</option>
                                    </select>
                                ) : (
                                    <p className="text-gray-900 font-medium mt-0.5">{formatGender(student.GENDER_CD)}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                            <div className="p-2 bg-white rounded-full shadow-sm text-blue-600"><Calendar size={18} /></div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">등록일</p>
                                <p className="text-gray-900 font-medium mt-0.5">{student.DUNGROK_DT ? new Date(student.DUNGROK_DT).toLocaleDateString() : '-'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg col-span-2">
                            <div className="p-2 bg-white rounded-full shadow-sm text-blue-600"><BookOpen size={18} /></div>
                            <div className="w-full grid grid-cols-2 gap-2">
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase">학교급</p>
                                    {isEditing ? (
                                        <select name="CHOJUNGGO_CD" value={editForm?.CHOJUNGGO_CD || ''} onChange={handleEditChange} className="w-full mt-1 p-1 bg-white border border-gray-300 rounded text-sm">
                                            <option value="">선택</option>
                                            <option value="1">초등</option>
                                            <option value="2">중등</option>
                                            <option value="3">고등</option>
                                            <option value="4">일반</option>
                                        </select>
                                    ) : (
                                        <p className="text-gray-900 font-medium mt-0.5">{formatSchoolLevel(student.CHOJUNGGO_CD)}</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase">학년</p>
                                    {isEditing ? (
                                        <input type="text" inputMode="numeric" name="HAKNYEON" value={editForm?.HAKNYEON || ''} onChange={handleEditChange} className="w-full mt-1 p-1 bg-white border border-gray-300 rounded text-sm" placeholder="학년" />
                                    ) : (
                                        <p className="text-gray-900 font-medium mt-0.5">{student.HAKNYEON ? student.HAKNYEON + '학년' : '-'}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg col-span-2">
                            <div className="p-2 bg-white rounded-full shadow-sm text-blue-600"><School size={18} /></div>
                            <div className="w-full">
                                <p className="text-xs font-semibold text-gray-500 uppercase">학교명</p>
                                {isEditing ? (
                                    <input type="text" name="HAKGYOMYEONG" value={editForm?.HAKGYOMYEONG || ''} onChange={handleEditChange} className="w-full mt-1 p-1 bg-white border border-gray-300 rounded text-sm" placeholder="학교명" />
                                ) : (
                                    <p className="text-gray-900 font-medium mt-0.5">{student.HAKGYOMYEONG || '-'}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-white rounded-full shadow-sm text-blue-600"><Phone size={18} /></div>
                        <div className="w-full">
                            <p className="text-xs font-semibold text-gray-500 uppercase">연락처</p>
                            {isEditing ? (
                                <input type="tel" name="HP_NO" value={editForm?.HP_NO || ''} onChange={handleEditChange} className="w-full mt-1 p-1 bg-white border border-gray-300 rounded text-sm" placeholder="010-0000-0000" />
                            ) : (
                                <p className="text-gray-900 font-medium mt-0.5">{student.HP_NO || '-'}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-white rounded-full shadow-sm text-blue-600"><MapPin size={18} /></div>
                        <div className="w-full">
                            <p className="text-xs font-semibold text-gray-500 uppercase">주소</p>
                            {isEditing ? (
                                <div className="space-y-1 mt-1">
                                    <input type="text" name="ADDR1" value={editForm?.ADDR1 || ''} onChange={handleEditChange} className="w-full p-1 bg-white border border-gray-300 rounded text-sm" placeholder="기본주소" />
                                    <input type="text" name="ADDR2" value={editForm?.ADDR2 || ''} onChange={handleEditChange} className="w-full p-1 bg-white border border-gray-300 rounded text-sm" placeholder="상세주소" />
                                </div>
                            ) : (
                                <p className="text-gray-900 font-medium mt-0.5 whitespace-pre-wrap">{`${student.ADDR1 || ''} ${student.ADDR2 || ''}`}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                            >
                                <Undo size={16} />
                                취소
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-medium shadow-md transition-colors flex items-center gap-2"
                            >
                                <Save size={16} />
                                저장
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
                            >
                                <Trash2 size={16} />
                                삭제
                            </button>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
                                >
                                    <Edit2 size={16} />
                                    수정
                                </button>
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-medium shadow-md transition-colors"
                                >
                                    확인
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default StudentDetailModal;
