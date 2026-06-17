/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, Compass, MapPin, Grid, Layers, HardHat, ShieldCheck, ExternalLink } from 'lucide-react';
import { Category } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  selectedCategory: Category;
  setSelectedCategory: (category: Category) => void;
  onScrollToSection?: (sectionId: string) => void;
}

export default function Sidebar({
  currentTab,
  setCurrentTab,
  selectedCategory,
  setSelectedCategory,
  onScrollToSection,
}: SidebarProps) {
  
  const categoriesList = [
    { id: 'ALL' as Category, label: '전체제품' },
    { id: 'UG_STANDARD' as Category, label: '케미칼저장탱크(UG/일반형)' },
    { id: 'UD_DISCHARGE' as Category, label: '완전배출형(UD)' },
    { id: 'UN_AGITATION' as Category, label: '교반형/소형탱크' },
    { id: 'DECK_STS' as Category, label: 'DECK형/STS밴드형' },
  ];

  const handleCompanyGuideClick = (sectionId: string) => {
    setCurrentTab('intro');
    setTimeout(() => {
      if (onScrollToSection) {
        onScrollToSection(sectionId);
      } else {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 100);
  };

  return (
    <aside className="space-y-6 shrink-0 w-full lg:w-64" id="sidebar-quick-menu">
      
      {/* 1. 회사안내 단축메뉴 */}
      <div className="bg-slate-900 text-white rounded-xl shadow-md overflow-hidden border border-slate-800">
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-sm tracking-wide flex items-center gap-2">
            <Compass className="w-4 h-4 text-orange-400" />
            회사안내 단축메뉴
          </h3>
        </div>
        <div className="p-2 space-y-1">
          <button
            onClick={() => handleCompanyGuideClick('ceo-greetings')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
              currentTab === 'intro' 
                ? 'bg-slate-800 text-amber-400 font-bold' 
                : 'text-slate-300 hover:bg-slate-850 hover:text-white'
            }`}
          >
            <span>업체소개 (인사말)</span>
            <span className="text-[10px] text-slate-500 font-mono">ABOUT</span>
          </button>
          
          <button
            onClick={() => handleCompanyGuideClick('office-map')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
              currentTab === 'intro'
                ? 'bg-slate-800 text-amber-400 font-bold'
                : 'text-slate-300 hover:bg-slate-850 hover:text-white'
            }`}
          >
            <span>오시는 길 (양산공장)</span>
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* 2. 제품분류 카테고리 */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-xs flex items-center gap-2 uppercase tracking-wide">
            <Grid className="w-4 h-4 text-blue-900" />
            제품분류 카테고리
          </h3>
        </div>
        <div className="p-2 space-y-0.5">
          {categoriesList.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setCurrentTab('home'); // Ensure we are on home to filter products
                  setSelectedCategory(cat.id);
                  // Scroll slightly to showroom
                  const showroom = document.getElementById('product-showroom-title');
                  if (showroom) {
                    showroom.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-sm text-xs font-semibold flex items-center justify-between transition-all ${
                  isSelected 
                    ? 'bg-blue-900 text-white font-bold shadow-xs' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-blue-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-orange-500' : 'bg-slate-300'}`} />
                  <span>{cat.label}</span>
                </div>
                {cat.id === 'ALL' && (
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">8</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. B2B Quick Hotline */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-xl p-4 border border-blue-100 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4.5 h-4.5 text-white font-bold" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-slate-900">품질안전 보증</h4>
            <p className="text-[10px] text-slate-505">울트라월드 정품 인증</p>
          </div>
        </div>
        <div className="bg-white/80 p-2.5 rounded border border-blue-50 text-[11px] text-slate-600 leading-normal">
          울트라월드(주)는 <strong>품질안정/위생보장</strong> 기준에 통과된 압출 성형용 PE 약품탱크 전문 제조사입니다.
        </div>
        <a
          href="#consult"
          onClick={(e) => {
            e.preventDefault();
            setCurrentTab('consult');
          }}
          className="flex items-center justify-between text-[11px] text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-2 rounded-sm font-bold transition-all"
        >
          <span>신품 실시간 단가 및 도면 문의</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

    </aside>
  );
}
