/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Landmark, Compass, Award, Building2, MapPin, ClipboardCheck, Phone, CheckCircle, Navigation, Copy, ExternalLink, ShieldCheck } from 'lucide-react';

export default function CompanyIntro() {
  const [copied, setCopied] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<'CAR' | 'PUBLIC'>('CAR');

  const companyAddress = '경상남도 양산시 생동길 30';

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(companyAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12" id="company-intro-view">
      
      {/* 1. CEO Greetings (인사말) Area */}
      <section 
        className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300"
        id="ceo-greetings"
      >
        <div className="bg-gradient-to-r from-blue-950 to-slate-900 p-6 md:p-8 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-900/60 flex items-center justify-center border border-slate-750">
              <Building2 className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold tracking-tight">울트라월드(주) 인사말</h2>
              <p className="text-2xs text-slate-400 uppercase tracking-widest font-bold">Message from our Chief Executive</p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-10 space-y-8">
          
          {/* Main Statement */}
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-snug tracking-tight">
              &ldquo;인류와 환경을 먼저 생각하는 <span className="text-orange-500">PE 약품 저장탱크 전문 제조 파트너</span>&rdquo;
            </h3>
            <p className="text-slate-705 text-sm md:text-base leading-relaxed">
              안녕하십니까? 울트라월드(주) 홈페이지를 찾아주신 존경하는 바이어 및 협력사 임직원 여러분께 진심으로 깊은 감사의 인사를 올립니다.
            </p>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              저희 울트라월드 주식회사는 오랜 현장 가공 실무 기술을 축적한 엔지니어들이 주축이 되어 설립되었습니다. 
              부식성이 강하고 엄격한 관리가 뒷받침되어야 하는 화학 약품탱크와 산업용 케미칼탱크 전문 제조업체 입니다.
            </p>
          </div>

          {/* Signoff */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-slate-100 text-sm">
            <div className="text-slate-500">
              울트라월드 주식회사는 <strong>경상남도 양산시</strong>에 본사 생산 공장을 가동하여 친환경 신소재 제조에 기여하고 있습니다.
            </div>
            <div className="text-right font-bold text-slate-900">
               울트라월드(주) 대표이사 <span className="text-lg font-extrabold text-slate-950">김 태 리</span> 배상
            </div>
          </div>

        </div>
      </section>

      {/* 2. Interactive Route guide (오시는 길) Area */}
      <section 
        className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
        id="office-map"
      >
        <div className="bg-gradient-to-r from-blue-950 to-slate-900 p-6 md:p-8 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-900/60 flex items-center justify-center border border-slate-750">
                <MapPin className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold tracking-tight">오시는 길 (양산 제조공장)</h2>
                <p className="text-2xs text-slate-400 uppercase tracking-widest font-bold">Location & Driving Directions</p>
              </div>
            </div>

            {/* Copy Address Shortcut */}
            <button
              onClick={handleCopyAddress}
              className="inline-flex items-center gap-2 text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-lg transition-all cursor-pointer border border-white/15"
              id="copy-address-btn"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? '주소 복사 완료!' : '도로명 주소 복사하기'}
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Custom Interactive Vector Map - Left Container */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-video rounded-xl bg-slate-950 overflow-hidden border border-slate-800 shadow-inner flex flex-col justify-between p-4">
              
              {/* Map Canvas Elements Simulation (Interactive Vector Map) */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {/* Interactive Vector Overlay representing Korean Southern Highway Nodes */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 300">
                {/* Geongbu Highway Lane */}
                <path d="M 20 60 Q 150 120, 250 180 T 480 280" fill="none" stroke="#22c55e" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
                <path d="M 20 60 Q 150 120, 250 180 T 480 280" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" opacity="0.9" />
                
                {/* Yangsan River Route */}
                <path d="M 20 180 C 120 150, 220 220, 480 150" fill="none" stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" opacity="0.3" />
                
                {/* Local roads */}
                <path d="M 250 180 L 290 120 L 380 90" fill="none" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
                
                {/* Highways Nodes text */}
                <text x="50" y="55" fill="#f8fafc" fontSize="10" fontWeight="bold" opacity="0.8">경부고속도로 (Gyeongbu Hwy)</text>
                <text x="80" y="155" fill="#93c5fd" fontSize="9" fontWeight="medium" opacity="0.8">양산천 (Yangsan River)</text>
                
                <circle cx="250" cy="180" r="12" fill="#ef4444" fillOpacity="0.2" className="animate-ping" />
                <circle cx="250" cy="180" r="5" fill="#ef4444" />
                <circle cx="150" cy="120" r="4" fill="#fbbf24" />
                <circle cx="380" cy="90" r="4" fill="#fbbf24" />
                
                <text x="162" y="123" fill="#cbd5e1" fontSize="9" fontWeight="bold">남양산 IC</text>
                <text x="392" y="93" fill="#cbd5e1" fontSize="9" fontWeight="bold">양산 IC</text>
              </svg>

              {/* Company Floating HUD Pin Card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-12 -translate-y-20 bg-slate-900 border border-amber-400 text-white p-3 rounded-lg shadow-2xl space-y-1.5 w-60 z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
                  <span className="w-2.5 h-2.5 bg-rose-500 rounded-full absolute" />
                  <strong className="text-xs text-slate-100 font-extrabold">울트라월드(주) 양산공장</strong>
                </div>
                <div className="text-[10px] text-slate-300 leading-normal">
                  <p>📍 경상남도 양산시 생동길 30</p>
                  <p className="text-amber-400 font-bold mt-0.5">📞 대표전화: 055-385-2696</p>
                </div>
              </div>

              {/* Map controls mock HUD */}
              <div className="z-10 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-lg text-[10px] text-slate-300 flex items-center gap-3 border border-slate-700 max-w-fit shadow">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-1.5 bg-green-500 rounded-full inline-block" /> 고속도로
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-1.5 bg-blue-500 rounded-full inline-block" /> 수자원유역
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-red-500 rounded-full inline-block animate-pulse" /> 본사 위치
                </span>
              </div>

              <div className="z-10 text-right">
                <span className="bg-slate-900/95 text-[10px] text-slate-400 font-mono px-2.5 py-1.5 rounded-md border border-slate-800">
                  interactive offline vector map Ver 2.6
                </span>
              </div>

            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span>네이버 지도 및 카카오맵과의 연동을 원하시면 우측 버튼을 누르세요.</span>
              <div className="flex gap-2">
                <a 
                  href="https://map.naver.com" 
                  target="_blank" 
                  referrerPolicy="no-referrer"
                  className="bg-white hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded border border-slate-200 font-semibold inline-flex items-center gap-1"
                >
                  네이버 <ExternalLink className="w-3 h-3 text-emerald-500" />
                </a>
              </div>
            </div>

          </div>

          {/* Navigation guides list - Right Container */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Navigation className="w-4 h-4 text-orange-500" />
                공장 방문 교통 상세수단안내
              </h4>

              {/* Tabs for Car vs Transit directions */}
              <div className="flex bg-slate-100 rounded-lg p-1.5 border border-slate-200">
                <button
                  onClick={() => setSelectedRoute('CAR')}
                  className={`flex-1 text-center py-2 text-xs font-bold rounded-md transition-all ${
                    selectedRoute === 'CAR' 
                      ? 'bg-slate-900 text-white shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  자가용 / 화물 탑차 운행 시
                </button>
                <button
                  onClick={() => setSelectedRoute('PUBLIC')}
                  className={`flex-1 text-center py-2 text-xs font-bold rounded-md transition-all ${
                    selectedRoute === 'PUBLIC' 
                      ? 'bg-slate-900 text-white shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  기차 / 지하철 이용 시
                </button>
              </div>

              {/* Transit content box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 text-xs text-slate-700 space-y-3">
                {selectedRoute === 'CAR' ? (
                  <>
                    <div className="space-y-1">
                      <strong className="text-slate-950 block hover:text-orange-500 transition-colors">■ 경부고속도로 진입 (양산 IC 기준)</strong>
                      <p className="leading-relaxed text-slate-600 pl-3">
                        양산 Interchange 톨게이트 진출 후 삼거리에서 좌회전 &rarr; 중앙대로변으로 약 2.5km 직진 후 생동길 산업유역 방면 우회전 &rarr; 공장 진입로 입구. (IC에서 약 7분 소요)
                      </p>
                    </div>
                    <div className="space-y-1 pt-2 border-t border-slate-200">
                      <strong className="text-slate-950 block">■ 부산 대구 방면 진입 (남양산 IC 기준)</strong>
                      <p className="leading-relaxed text-slate-600 pl-3">
                        남양산IC 진출 후 양산 신도시 방면 우회전 &rarr; 양산천 대로변 통과 &rarr; 강변로 따라 양산시종합운동장 통과 후 야외 야적 야산공장 방면으로 진입. (IC에서 약 12분 소요)
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <strong className="text-slate-950 block">■ 부산 2호선 양산역 하차</strong>
                      <p className="leading-relaxed text-slate-600 pl-3">
                        양산역 2번 출구 앞 버스정류장 &rarr; 일반 버스 11번, 12번 승차 후 &ldquo;생동마을입구 및 산업공단 앞&rdquo; 정류장 하차 &rarr; 도보로 3분 이내 공장 도착.
                      </p>
                    </div>
                    <div className="space-y-1 pt-2 border-t border-slate-200">
                      <strong className="text-slate-950 block">■ KTX 울산역(통도사역) 이용 시</strong>
                      <p className="leading-relaxed text-slate-600 pl-3">
                        리무진 버스 3000번 탑승 후 신도시 하차 &rarr; 택시 이용 시 기본 택시 할증 기준 약 8,000원 선 소요.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Quick Contact help box in sidebar */}
            <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl flex flex-col justify-between gap-4 border border-slate-800 shadow-lg">
              <div>
                <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">네비게이션 권고사항</span>
                <h5 className="font-extrabold text-sm text-yellow-405 mt-1">티맵, 카카오네비 검색어</h5>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  초행 화물 탑차 또는 20톤 장대 트레일러 진입 시 회전 반경 확보를 위해 도로 진입 전 반드시 공장 사무실로 연락 주시기 바랍니다.
                </p>
              </div>
              <div className="bg-slate-850 p-2 text-slate-200 rounded font-semibold text-center border border-slate-700 flex items-center justify-center gap-2">
                <Phone className="w-4 h-4 text-amber-400" />
                대표번호: 055-385-2696
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
