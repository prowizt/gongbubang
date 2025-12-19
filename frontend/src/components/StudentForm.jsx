import React, { useState } from 'react';
import api from '../api';

const StudentForm = ({ onStudentAdded }) => {
    const [formData, setFormData] = useState({
        HAKSAENG_ID: '',
        HAKSAENG_NM: '',
        GENDER_CD: '',
        HAKGYOMYEONG: '',
        CHOJUNGGO_CD: '',
        HAKNYEON: '',
        HP_NO: '',
        ADDR1: '',
        ADDR2: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/haksaeng/', formData);
            alert('학생 등록 성공!');
            setFormData({
                HAKSAENG_ID: '',
                HAKSAENG_NM: '',
                GENDER_CD: '',
                HAKGYOMYEONG: '',
                CHOJUNGGO_CD: '',
                HAKNYEON: '',
                HP_NO: '',
                ADDR1: '',
                ADDR2: ''
            });
            onStudentAdded(); // Refresh list
        } catch (error) {
            console.error(error);
            alert('등록 실패: ' + (error.response?.data?.detail || error.message));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-bold mb-4">학생 등록</h2>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">학생 ID</label>
                    <input
                        type="text" name="HAKSAENG_ID" value={formData.HAKSAENG_ID} onChange={handleChange} required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">이름</label>
                    <input
                        type="text" name="HAKSAENG_NM" value={formData.HAKSAENG_NM} onChange={handleChange} required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">성별</label>
                    <select
                        name="GENDER_CD" value={formData.GENDER_CD} onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                    >
                        <option value="">선택</option>
                        <option value="1">남자</option>
                        <option value="2">여자</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">학교급</label>
                    <select
                        name="CHOJUNGGO_CD" value={formData.CHOJUNGGO_CD} onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                    >
                        <option value="">선택</option>
                        <option value="1">초등</option>
                        <option value="2">중등</option>
                        <option value="3">고등</option>
                        <option value="4">일반</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">학교명</label>
                    <input
                        type="text" name="HAKGYOMYEONG" value={formData.HAKGYOMYEONG} onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">학년</label>
                    <input
                        type="text" name="HAKNYEON" value={formData.HAKNYEON} onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                        maxLength="1"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">전화번호</label>
                <input
                    type="text" name="HP_NO" value={formData.HP_NO} onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                />
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">주소</label>
                    <input
                        type="text" name="ADDR1" value={formData.ADDR1} onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">상세주소</label>
                    <input
                        type="text" name="ADDR2" value={formData.ADDR2} onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                    />
                </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                등록하기
            </button>
        </form>
    );
};

export default StudentForm;
