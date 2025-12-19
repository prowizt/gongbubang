import React, { useState, useEffect } from 'react';
import { Search, Plus, RotateCw, Filter, Download, ChevronRight } from 'lucide-react';
import api from '../api';
import StudentModal from '../components/StudentModal';

import StudentDetailModal from '../components/StudentDetailModal';

const StudentPage = () => {
    const [students, setStudents] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Pagination & Stats State
    const [stats, setStats] = useState({ total: 0, elementary: 0, middle: 0, high: 0 });
    const [currentPage, setCurrentPage] = useState(1);
    const LIMIT = 10;
    const totalPages = Math.ceil(stats.total / LIMIT) || 1;

    // Helper to format codes
    const formatGender = (code) => {
        if (code === '1') return '남자';
        if (code === '2') return '여자';
        return <span className="text-gray-400 text-xs">-</span>;
    };

    const formatSchoolLevel = (code) => {
        switch (code) {
            case '1': return '초등';
            case '2': return '중등';
            case '3': return '고등';
            case '4': return '일반';
            default: return <span className="text-gray-400 text-xs">-</span>;
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.get('/haksaeng/stats');
            setStats(response.data);
        } catch (error) {
            console.error("통계 불러오기 실패:", error);
        }
    };

    const fetchStudents = async () => {
        setIsLoading(true);
        try {
            const skip = (currentPage - 1) * LIMIT;
            const response = await api.get('/haksaeng/', {
                params: { name: searchName, limit: LIMIT, skip: skip }
            });
            setStudents(response.data);
        } catch (error) {
            console.error("데이터 불러오기 실패:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        fetchStudents();
    }, [currentPage]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (currentPage === 1) fetchStudents();
        else setCurrentPage(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Callback when data modification occurs (Create/Delete)
    const handleDataUpdate = () => {
        fetchStats();
        fetchStudents();
    };

    const handleRowClick = (student) => {
        setSelectedStudent(student);
        setIsDetailOpen(true);
    };

    const renderPagination = () => (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-xs text-gray-500 font-medium">
                총 {stats.total.toLocaleString()}명의 학생 중 {(currentPage - 1) * LIMIT + 1} - {Math.min(currentPage * LIMIT, stats.total)}명 표시
            </span>

            {/* Desktop Pagination */}
            <div className="hidden md:flex items-center gap-1.5">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    이전
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let startPage = Math.max(1, currentPage - 2);
                    let endPage = Math.min(totalPages, startPage + 4);
                    if (endPage - startPage < 4) {
                        startPage = Math.max(1, endPage - 4);
                    }
                    const pageNum = startPage + i;
                    if (pageNum > totalPages) return null;

                    return (
                        <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${currentPage === pageNum
                                ? 'bg-indigo-600 text-white border border-indigo-600'
                                : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
                                }`}
                        >
                            {pageNum}
                        </button>
                    );
                })}

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    다음
                </button>
            </div>

            {/* Mobile Pagination (Full Width Buttons) */}
            <div className="flex md:hidden w-full gap-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex-1 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex justify-center items-center gap-2"
                >
                    &lt; 이전 페이지
                </button>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex-1 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex justify-center items-center gap-2"
                >
                    다음 페이지 &gt;
                </button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-fadeIn pb-24 md:pb-0">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">학생 관리</h1>
                    <p className="text-sm text-gray-500 mt-1">학사 행정 데이터베이스의 전체 학생 목록을 조회하고 관리합니다.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleDataUpdate} // Use handleDataUpdate for refresh
                        className="p-2.5 text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-lg transition-all shadow-sm"
                        title="새로고침"
                    >
                        <RotateCw size={20} className={isLoading ? 'animate-spin text-blue-600' : ''} />
                    </button>
                </div>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between group hover:border-blue-300 transition-colors">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">전체 학생</p>
                    <p className="text-2xl font-black text-gray-900 mt-2 flex items-baseline gap-1">
                        {stats.total.toLocaleString()} <span className="text-sm font-medium text-gray-400">명</span>
                    </p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">초등</p>
                    <p className="text-2xl font-black text-gray-800 mt-2 flex items-baseline gap-1">
                        {stats.elementary.toLocaleString()} <span className="text-sm font-medium text-gray-400">명</span>
                    </p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">중등</p>
                    <p className="text-2xl font-black text-gray-800 mt-2 flex items-baseline gap-1">
                        {stats.middle.toLocaleString()} <span className="text-sm font-medium text-gray-400">명</span>
                    </p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">고등</p>
                    <p className="text-2xl font-black text-gray-800 mt-2 flex items-baseline gap-1">
                        {stats.high.toLocaleString()} <span className="text-sm font-medium text-gray-400">명</span>
                    </p>
                </div>
            </div>

            {/* Control Bar */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
                    <div className="relative w-full lg:w-96 group">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="이름으로 검색 (Enter)"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:bg-white transition-all outline-none"
                        />
                    </div>

                    <div className="flex gap-3 w-full lg:w-auto">
                        <button
                            type="button"
                            className="flex-1 lg:flex-none px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:border-gray-300 flex items-center justify-center gap-2 font-medium transition-colors"
                        >
                            <Filter size={18} />
                            <span>필터</span>
                        </button>
                        <button
                            type="button"
                            className="flex-1 lg:flex-none px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:border-gray-300 flex items-center justify-center gap-2 font-medium transition-colors"
                        >
                            <Download size={18} />
                            <span>내보내기</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(true)}
                            className="hidden md:flex flex-1 lg:flex-none px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg items-center justify-center gap-2 shadow-sm hover:shadow hover:-translate-y-0.5 font-medium transition-all"
                        >
                            <Plus size={18} />
                            <span>신규 학생 등록</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Data Table (Desktop) */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-[#f8fafc]">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">학번(ID)</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">이름</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">성별</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">학교급</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">학교명</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">학년</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">연락처</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">등록일</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 cursor-pointer">
                            {students.length > 0 ? (
                                students.map((student) => (
                                    <tr
                                        key={student.HAKSAENG_ID}
                                        onClick={() => handleRowClick(student)}
                                        className="group hover:bg-blue-50/50 transition-colors duration-150"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 group-hover:text-blue-700">{student.HAKSAENG_ID}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">{student.HAKSAENG_NM}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatGender(student.GENDER_CD)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatSchoolLevel(student.CHOJUNGGO_CD)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.HAKGYOMYEONG || <span className="text-gray-300">-</span>}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.HAKNYEON || <span className="text-gray-300">-</span>}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono tracking-tight">{student.HP_NO || <span className="text-gray-300">-</span>}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {student.DUNGROK_DT ? new Date(student.DUNGROK_DT).toLocaleDateString() : <span className="text-gray-300">-</span>}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-20 text-center text-sm text-gray-500 flex flex-col items-center justify-center">
                                        <div className="bg-gray-50 p-4 rounded-full mb-3">
                                            <Search size={32} className="text-gray-300" />
                                        </div>
                                        <p className="font-medium text-gray-600">데이터가 없습니다.</p>
                                        <p className="text-gray-400 mt-1">새로운 학생을 등록하거나 검색어를 변경해보세요.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Desktop Pagination inside Card */}
                {renderPagination()}
            </div>

            {/* Mobile Compact List View */}
            <div className="md:hidden bg-white shadow-sm border-y border-gray-200 divide-y divide-gray-100">
                {students.length > 0 ? (
                    students.map((student) => (
                        <div
                            key={student.HAKSAENG_ID}
                            onClick={() => handleRowClick(student)}
                            className="flex items-center justify-between p-4 active:bg-gray-50 transition-colors"
                        >
                            <div className="overflow-hidden mr-4">
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-base font-bold text-gray-900 truncate">{student.HAKSAENG_NM}</h3>
                                    <span className="text-xs text-blue-600 font-medium whitespace-nowrap">
                                        {formatSchoolLevel(student.CHOJUNGGO_CD)} {student.HAKNYEON ? student.HAKNYEON + '학년' : ''}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5 truncate">{student.HAKGYOMYEONG || '학교명 미입력'}</p>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="text-xs text-gray-400 font-mono">{student.HP_NO || '-'}</span>
                                <ChevronRight size={16} className="text-gray-300" />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-12 text-center text-gray-500 bg-white">
                        <p>데이터가 없습니다.</p>
                    </div>
                )}
            </div>

            {/* Mobile Pagination */}
            <div className="md:hidden bg-white border-b border-gray-200">
                {renderPagination()}
            </div>

            {/* FAB (Floating Action Button) for Mobile */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-900 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-800 active:scale-95 transition-all z-50"
            >
                <Plus size={28} />
            </button>

            <StudentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleDataUpdate}
            />

            <StudentDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                student={selectedStudent}
                onDeleteSuccess={handleDataUpdate}
            />
        </div>
    );
};

export default StudentPage;
