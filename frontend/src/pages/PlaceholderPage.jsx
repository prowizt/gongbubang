import React from 'react';
import { Construction } from 'lucide-react';

const PlaceholderPage = ({ title }) => {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center p-8 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="bg-blue-50 p-8 rounded-full mb-6 animate-pulse">
                <Construction size={48} className="text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">{title}</h2>
            <p className="text-gray-500 max-w-sm mb-6 leading-relaxed">
                현재 이 서비스는 준비 중입니다.<br />
                시스템 고도화 작업 이후 제공될 예정입니다.
            </p>
            <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                이전 페이지로 돌아가기
            </button>
        </div>
    );
};

export default PlaceholderPage;
