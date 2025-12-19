import React, { useState, useEffect } from 'react';
import api from '../api';

const StudentList = ({ refreshKey }) => {
    const [students, setStudents] = useState([]);
    const [searchName, setSearchName] = useState('');

    const fetchStudents = async () => {
        try {
            const response = await api.get('/haksaeng/', {
                params: { name: searchName, limit: 100 }
            });
            setStudents(response.data);
        } catch (error) {
            console.error("데이터 불러오기 실패:", error);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [refreshKey]); // Refresh when key changes

    const handleSearch = (e) => {
        e.preventDefault();
        fetchStudents();
    };

    // Helper to format codes
    const formatGender = (code) => {
        if (code === '1') return '남자';
        if (code === '2') return '여자';
        return code;
    };

    const formatSchoolLevel = (code) => {
        switch (code) {
            case '1': return '초등';
            case '2': return '중등';
            case '3': return '고등';
            case '4': return '일반';
            default: return code;
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">학생 목록</h2>

            <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                <input
                    type="text"
                    placeholder="이름으로 검색"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md p-2"
                />
                <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900">
                    검색
                </button>
            </form>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">성별</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학교급</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학교명</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학년</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">등록일</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {students.length > 0 ? (
                            students.map((student) => (
                                <tr key={student.HAKSAENG_ID}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.HAKSAENG_ID}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.HAKSAENG_NM}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatGender(student.GENDER_CD)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatSchoolLevel(student.CHOJUNGGO_CD)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.HAKGYOMYEONG}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.HAKNYEON}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(student.DUNGROK_DT).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">데이터가 없습니다.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentList;
