/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, SlidersHorizontal, TableProperties, HelpCircle, PhoneCall, Sparkles } from 'lucide-react';
import { STATIC_SPEC_TABLE, PRODUCT_DATA } from '../data';
import { Product } from '../types';

interface ProductSpecsProps {
  onQuoteClick: (productName: string) => void;
  onViewProductDetails: (product: Product) => void;
}

export default function ProductSpecsList({ onQuoteClick, onViewProductDetails }: ProductSpecsProps) {
  const [capacityFilter, setCapacityFilter] = useState<string>('ALL');
  const [searchText, setSearchText] = useState<string>('');

  const filterOptions = [
    { key: 'ALL', label: '전체 용량 규격' },
    { key: 'SMALL', label: '소형 (5천L 미만)' },
    { key: 'MEDIUM', label: '중형 (5천L ~ 1.5만L)' },
    { key: 'LARGE', label: '대형 (2만L 이상)' },
  ];

  const filteredSpecs = STATIC_SPEC_TABLE.filter((row) => {
    // 1. Text Search filtering
    const matchesSearch = row.model.toLowerCase().includes(searchText.toLowerCase()) || 
                          row.capacity.toLowerCase().includes(searchText.toLowerCase());
    
    if (!matchesSearch) return false;

    // 2. Capacity size threshold logical filtering
    if (capacityFilter === 'ALL') return true;

    // Parse the numerical volume (e.g. "3,000L" -> 3000)
    const capacityNum = parseInt(row.capacity.replace(/,/g, '').replace('L', ''), 10);
    
    if (isNaN(capacityNum)) return true;

    if (capacityFilter === 'SMALL') {
      return capacityNum < 5000;
    } else if (capacityFilter === 'MEDIUM') {
      return capacityNum >= 5000 && capacityNum <= 15000;
    } else if (capacityFilter === 'LARGE') {
      return capacityNum >= 20000;
    }

    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200" id="product-specs-sheet">
      
      {/* 1. Header Information Panel */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-950 to-slate-900 text-white p-6 md:p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-900/60 flex items-center justify-center border border-slate-750">
              <TableProperties className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold tracking-tight">전체 제품 목록 및 상세 규격표</h2>
              <p className="text-2xs text-slate-400 uppercase tracking-widest font-bold">Standard PE Chemical Tank Specifications Database</p>
            </div>
          </div>
          <p className="text-slate-300 text-xs mt-3 leading-relaxed max-w-2xl">
            울트라월드 주식회사주력 모델식 UG 일반형 케미칼 탱크 스펙 시트입니다.
          </p>
        </div>

        {/* Filters and search section */}
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 gap-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-500 mr-1" />
            {filterOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setCapacityFilter(opt.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  capacityFilter === opt.key
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="모델명(예: UG-5000) 검색..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-250 bg-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Specs Table Display */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-4">모델명 (Model Name)</th>
                <th className="p-4">실제 호칭 용량</th>
                <th className="p-4">탱크 외경 (Ø)</th>
                <th className="p-4">탱크 높이 (H)</th>
                <th className="p-4">권장 기본 두께</th>
                <th className="p-4 text-center">도면견적</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {filteredSpecs.length > 0 ? (
                filteredSpecs.map((row) => (
                  <tr 
                    key={row.model} 
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="p-4 font-bold text-slate-900 group-hover:text-amber-600 transition-colors font-mono">
                      {row.model}
                    </td>
                    <td className="p-4 font-medium text-slate-800">{row.capacity}</td>
                    <td className="p-4 font-mono">{row.diameter}</td>
                    <td className="p-4 font-mono">{row.height}</td>
                    <td className="p-4 font-mono text-slate-700">{row.thickness}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => onQuoteClick(`${row.model} (${row.capacity})`)}
                        className="bg-slate-900 group-hover:bg-orange-505 hover:scale-105 bg-slate-900 group-hover:bg-amber-600 group-hover:text-slate-950 text-white font-bold text-[11px] px-3 py-1.5 rounded transition-all cursor-pointer"
                      >
                        견적요청
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    지정된 검색 조건에 해당하는 수치 규격 모델이 존재하지 않습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. Extra Quality Notice / Advisory details */}
      <section className="w-full">
        <div className="bg-slate-950 text-slate-100 rounded-2xl shadow-sm p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block">기술 엔지니어 전담 서비스</span>
            <h4 className="font-extrabold text-white text-base md:text-lg">원하는 맞춤형 크기와 성형이 있으신가요?</h4>
            <p className="text-slate-300 text-xs leading-relaxed">
              위의 기성 모델 이외의 완벽 배출(UD) Conical 바닥 탱크, 이중 단열 보온 수조, 혹은 고점도 약품 전용 교반 모터 기어 스펙은 사내 기술 고문이 직접 가설 견적 설계 해드립니다.
            </p>
          </div>
          <div className="bg-slate-900 px-5 py-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center gap-3 text-xs font-bold text-slate-300 shrink-0">
            <span>직통 기술 설계 연구부:</span>
            <span className="text-amber-400 text-base font-black">010-3887-6107</span>
          </div>
        </div>
      </section>

    </div>
  );
}
