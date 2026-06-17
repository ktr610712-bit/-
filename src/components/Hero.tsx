/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Phone, Smartphone, FileSpreadsheet, ArrowRight, CheckCircle, Edit } from 'lucide-react';

interface HeroProps {
  onConsultClick: () => void;
  heroBadgeText: string;
  onEditHeroBadgeText: () => void;
  heroImageUrl: string;
  onEditHeroImageUrl: () => void;
  isAdmin: boolean;
}

export default function Hero({ onConsultClick, heroBadgeText, onEditHeroBadgeText, heroImageUrl, onEditHeroImageUrl, isAdmin }: HeroProps) {
  return (
    <section className="relative flex items-center bg-slate-900 overflow-hidden py-12 lg:py-16 border-b border-slate-950" id="hero-banner">
      {/* Background Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/40 z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Main Copy / Bullet Points */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <span className="text-orange-500 font-extrabold tracking-widest text-xs uppercase mb-1 block">
              Industrial Chemical Solutions
            </span>
            
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5.5xl font-black text-white leading-tight tracking-tight">
                약품탱크·케미칼탱크<br />
                전문업체 <span className="text-blue-500">울트라월드(주)</span>
              </h1>
              <p className="text-slate-300 text-base md:text-lg font-light">
                저장조 PE탱크 · UN형 · 교반형 · 소형 탱크 맞춤 제작
              </p>
            </div>

            <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-xl">
              저희 울트라월드 주식회사는 최첨단 일체성형 회전 공업공법으로 
              약품탱크, 케미칼탱크 등을 완벽히 제작 공급해 드립니다. 
              강산성/알칼리성 화학약품 및 산업용 물질을 균열 없이 안전하게 영구 저장하십시오.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2 text-xs">
              {[
                '저밀도 폴리에틸렌 일체 성형 위생 관리',
                '산, 알칼리, 질산, 황산 등 완벽 내약품성',
                '수요자 요구 맞춤형 노즐 타공 및 플랜지 장착',
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-300 font-medium">
                  <CheckCircle className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={onConsultClick}
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-extrabold px-7 py-3.5 rounded-full shadow-lg shadow-orange-950/40 hover:scale-102 transition-all text-sm group cursor-pointer"
                id="hero-quote-btn"
              >
                온라인 견적 및 도면 설계 신청
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Banner Photo Right Side - Styled into a gorgeous premium frame matching the design circle */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="w-72 h-72 sm:w-85 sm:h-85 md:w-96 md:h-96 border-[12px] border-orange-500 rounded-full flex items-center justify-center overflow-hidden bg-slate-800 shadow-2xl relative">
              {/* Image from generate_image inside the circular frame */}
              <img
                src={heroImageUrl}
                alt="울트라월드 PE 보강식 케미칼탱크 사진"
                className="w-full h-full object-cover hover:scale-110 duration-700 transition-transform absolute inset-0"
                referrerPolicy="no-referrer"
                id="hero-img"
              />
              
              {isAdmin && onEditHeroImageUrl && (
                <button
                  onClick={(e) => { e.stopPropagation(); onEditHeroImageUrl(); }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-12 z-35 bg-orange-500 hover:bg-orange-600 text-white px-3.5 py-2 rounded-full shadow-lg border border-white hover:scale-110 transition-transform flex items-center gap-1.5 cursor-pointer text-2xs font-extrabold focus:outline-none"
                  title="대표 사진 URL 수정하기"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>사진 수정</span>
                </button>
              )}
              
              {/* Overlay elements */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              
              {/* Badge */}
              <span className="absolute top-8 bg-orange-650/90 text-white font-black text-[9px] tracking-widest px-3 py-1 rounded shadow uppercase">
                PE CHEMICAL TANK
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Blue / Charcoal Quick strip for Hotline Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        <div className="bg-slate-900 text-white rounded-xl shadow-xl p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center" id="hero-quick-bar">
          
          <div className="flex items-center gap-3.5 px-4 py-2 border-b md:border-b-0 md:border-r border-slate-800">
            <div className="w-11 h-11 rounded-lg bg-orange-500 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-white animate-bounce" />
            </div>
            <div>
              <p className="text-slate-400 text-2xs uppercase tracking-widest font-extrabold">기술 직통/긴급 상담</p>
              <p className="text-lg font-black text-amber-400">010-3887-6107</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 px-4 py-2 border-b md:border-b-0 md:border-r border-slate-800">
            <div className="w-11 h-11 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-slate-300" />
            </div>
            <div>
              <p className="text-slate-400 text-2xs uppercase tracking-widest font-extrabold">양산 대표사무소</p>
              <p className="text-lg font-black text-slate-100">055-385-2696</p>
            </div>
          </div>

          <button
            onClick={onConsultClick}
            className="flex items-center justify-between gap-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-3 rounded-lg shadow-sm hover:shadow-md transition-all text-sm w-full cursor-pointer mt-2 md:mt-0"
            id="quick-consult-shortcut"
          >
            <span className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 shrink-0" />
              온라인 견적 문의 바로가기
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
        </div>
      </div>
    </section>
  );
}
