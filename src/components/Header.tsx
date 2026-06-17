/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, Trophy, ShieldAlert, Lock, Unlock } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isAdmin: boolean;
  onAdminTrigger: () => void;
}

export default function Header({ currentTab, setCurrentTab, searchQuery, setSearchQuery, isAdmin, onAdminTrigger }: HeaderProps) {
  const menuItems = [
    { id: 'home', label: 'Home' },
    { id: 'intro', label: '회사소개' },
    { id: 'products', label: '제품분류' },
    { id: 'consult', label: '온라인상담' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm" id="main-header">
      {/* Top micro bar for corporate trust */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-300">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              PE 탱크 전문 대표 기업
            </span>
            <span className="text-slate-500">|</span>
            <span className="flex items-center gap-1 text-slate-300">
              <ShieldAlert className="w-3.5 h-3.5 text-orange-400" />
              LLDPE 일체형 성형공법 적용
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <span>양산공장 직통: <strong>055-385-2696</strong></span>
            <span>08:00 - 17:00 (토/일 휴무)</span>
            <span className="text-slate-600">|</span>
            <button 
              onClick={onAdminTrigger}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                isAdmin 
                  ? 'bg-orange-500 text-white hover:bg-orange-600' 
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {isAdmin ? <Unlock className="w-2.5 h-2.5 text-white" /> : <Lock className="w-2.5 h-2.5 text-slate-405" />}
              {isAdmin ? '관리자 로그아웃' : '관리자'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand identity with the refined serif UR logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer group select-none" 
          onClick={() => { setCurrentTab('home'); setSearchQuery(''); }}
          id="brand-logo"
        >
          {/* Refined Serif "UR" Monogram Logo in pure black mimicking the attachment */}
          <div className="w-16 h-10 flex items-center justify-center shrink-0 relative">
            <svg viewBox="0 0 100 80" className="w-16 h-10 overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="4" y="60" fontFamily="'Times New Roman', 'Georgia', serif" fontSize="70" fontWeight="900" fill="#000000">U</text>
              <text x="27" y="60" fontFamily="'Times New Roman', 'Georgia', serif" fontSize="70" fontWeight="900" fill="#000000">R</text>
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-tight text-blue-950 uppercase leading-none group-hover:text-blue-600 transition-colors">
              울트라월드 <span className="text-blue-600">Co., Ltd.</span>
            </h1>
            <p className="text-[9px] uppercase tracking-widest font-extrabold text-slate-400 mt-1">Ultra World Co., Ltd.</p>
          </div>
        </div>

        {/* Navigation & Search bar */}
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
          <nav className="flex items-center gap-6">
            {menuItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => {
                    setCurrentTab(item.id);
                    // Reset product filters on home / products tab change
                    if (item.id === 'home' || item.id === 'products') {
                      setSearchQuery('');
                    }
                  }}
                  className={`relative pb-1.5 font-bold text-sm transition-all duration-200 ${
                    isActive 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-slate-600 hover:text-blue-600 border-b-2 border-transparent'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="검색어를 입력하세요!"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all placeholder-slate-400 font-medium"
              id="header-search-input"
            />
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-2 text-slate-400 hover:text-slate-600 text-xs"
              >
                초기화
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
