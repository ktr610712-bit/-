/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Check, HelpCircle, PhoneCall, FileText } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onInstantInquire: (productName: string) => void;
}

export default function ProductModal({ product, onClose, onInstantInquire }: ProductModalProps) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs" id="product-detail-modal">
      <div 
        className="relative bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-orange-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded uppercase">
              {product.specs.model}
            </span>
            <h3 className="font-extrabold text-sm sm:text-base tracking-tight truncate max-w-md">
              {product.name} 상세 규격서
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Image on left side */}
            <div className="relative rounded-xl overflow-hidden shadow border border-slate-200 bg-slate-50">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-auto object-cover max-h-72"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 right-3 bg-slate-900/95 text-amber-400 text-2xs font-bold px-2 py-1 rounded">
                제조사: 울트라월드(주)
              </div>
            </div>

            {/* Main high-level info on right side */}
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <span className="text-slate-400 text-xs tracking-wider uppercase font-bold">카테고리 분류</span>
                <p className="text-slate-900 font-bold text-sm mt-0.5">{product.categoryName}</p>
              </div>

              <div className="pb-3 border-b border-slate-100">
                <span className="text-slate-400 text-xs tracking-wider uppercase font-bold">스펙 요약</span>
                <div className="grid grid-cols-2 gap-2 mt-1 bg-slate-50 p-3 rounded-lg border border-slate-200/60 text-xs text-slate-700">
                  <div>• 호칭 용량: <strong>{product.specs.capacity}</strong></div>
                  <div>• 탱크 외경: <strong>{product.specs.diameter}</strong></div>
                  <div>• 탱크 높이: <strong>{product.specs.height}</strong></div>
                  <div>• 탱크 두께: <strong>{product.specs.thickness || '사양별 협의'}</strong></div>
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-xs tracking-wider uppercase font-bold">공급 단가</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-lg md:text-xl font-black text-rose-600">가격협의</span>
                  <span className="text-xs text-slate-500">(도면 견적 요청)</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal mt-1">
                  ※ 산, 알칼리, 고온 등 담는 케미칼 약품의 비중과 농도에 따라 두께 및 강도가 달라지므로 전화 상담이 필수적입니다.
                </p>
              </div>
            </div>

          </div>

          {/* Key Product Features list */}
          <div className="space-y-2.5">
            <h4 className="font-extrabold text-slate-900 text-sm border-l-4 border-orange-500 pl-2">
              제품 특징 (Features)
            </h4>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/70 space-y-2 text-xs md:text-sm text-slate-700 leading-relaxed">
              {product.features.map((feature, idx) => (
                <div key={idx} className="flex gap-2.5 items-start">
                  <div className="w-5 h-5 rounded-full bg-emerald-150 flex items-center justify-center shrink-0 text-emerald-700 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Engineering Specification Table */}
          <div className="space-y-2.5">
            <h4 className="font-extrabold text-slate-900 text-sm border-l-4 border-slate-900 pl-2">
              정밀 기계 수치 규격 명세 (Engineering Specs)
            </h4>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <th className="p-3 font-bold">구분 항목</th>
                    <th className="p-3 font-bold">설계 표준 규격</th>
                    <th className="p-3 font-bold">비고 및 조율 범위</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr>
                    <td className="p-3 font-semibold bg-slate-50/50">모델명 (Model)</td>
                    <td className="p-3 text-slate-900 font-bold">{product.specs.model}</td>
                    <td className="p-3 text-slate-400">자체 표준 공장 모델 코드</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold bg-slate-50/50">저장액량 (Capacity)</td>
                    <td className="p-3 text-slate-900 font-medium">{product.specs.capacity}</td>
                    <td className="p-3">비중 1.0 ~ 1.5 맞춤 제조 가능</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold bg-slate-50/50">몸체 수치 (Dimensions)</td>
                    <td className="p-3 text-slate-900 font-medium">외경 Ø {product.specs.diameter} x 높이 {product.specs.height}</td>
                    <td className="p-3">안전 사다리, 점검 데크 장착 가능</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold bg-slate-50/50">맨홀 규격 (Manhole)</td>
                    <td className="p-3 text-slate-900">{product.specs.manhole || 'Ø 450 mm'}</td>
                    <td className="p-3">상부 밀폐형 패킹 볼트 밀폐식 맨홀 제공 가능</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold bg-slate-50/50">몸체 평균 두께 (Thickness)</td>
                    <td className="p-3 text-slate-900">{product.specs.thickness || '8 mm ~ 12 mm'}</td>
                    <td className="p-3">약품에 맞추어 강화식 보강 플레이트 주문</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold bg-slate-50/50">배출 배관 피팅 (Flange)</td>
                    <td className="p-3 text-slate-950 font-bold">50A / 80A / 100A (협의)</td>
                    <td className="p-3">위치, 규격 지정 피팅 용접 후 안전 검사 공급</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Communication Box */}
          <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                <PhoneCall className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-left">
                <p className="text-2xs text-slate-400 font-bold tracking-widest uppercase">빠른 전용 유선 상담</p>
                <p className="text-sm font-bold">부장 정식문의: <span className="text-amber-400 font-black">010-3887-6107</span></p>
              </div>
            </div>
            
            <button
              onClick={() => onInstantInquire(product.name)}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              이 제품에 대한 온라인 견적용 도면 발송 요청
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
