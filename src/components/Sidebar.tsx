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
  onViewCatalogue: () => void;
}

export default function Sidebar({
  currentTab,
  setCurrentTab,
  selectedCategory,
  setSelectedCategory,
  onScrollToSection,
  onViewCatalogue,
}: SidebarProps) {
  
  const categoriesList = [
    { id: 'ALL' as Category, label: '전체제품' },
    { id: 'UG_STANDARD' as Category, label: 'UG 보강형 일반 탱크' },
    { id: 'UD_DISCHARGE' as Category, label: 'UD 완전배출 탱크' },
    { id: 'UN_AGITATION' as Category, label: 'UN조 탱크' },
    { id: 'DECK_STS' as Category, label: 'STS 보강형 일반 탱크' },
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

      {/* 3. 울트라 탱크 종합 카달로그 */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50/40 rounded-xl p-4 border border-orange-100 space-y-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
            <Layers className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-slate-900">종합 카달로그</h4>
            <p className="text-[10px] text-orange-600 font-extrabold uppercase tracking-wider">Ultra Tank Booklet</p>
          </div>
        </div>
        <div className="bg-white/90 p-2.5 rounded-lg border border-orange-200/50 text-[11px] text-slate-600 leading-normal">
          울트라 탱크의 <strong className="text-orange-600 font-extrabold">내약품성표, 규격서, 설치 및 시공 요령, 사용상 주의점</strong>을 한눈에 열람하십시오.
        </div>
        <button
          onClick={onViewCatalogue}
          className="w-full flex items-center justify-between text-[11px] text-white bg-slate-900 hover:bg-slate-850 px-3.5 py-2.5 rounded-lg font-extrabold transition-all hover:shadow-xs cursor-pointer"
        >
          <span>스마트 종합 카달로그 열람</span>
          <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
        </button>
      </div>

    </aside>
  );
}
