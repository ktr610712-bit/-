/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, FlameKindling, Building } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-950 text-2xs md:text-xs" id="footer-details">
      
      {/* Decorative Brand Summary area */}
      <div className="bg-slate-950 py-8 px-4 sm:px-6 border-b border-slate-900 text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-1.5 md:text-left text-center">
            <h3 className="text-white font-extrabold text-sm tracking-wide flex items-center justify-center md:justify-start gap-2">
              <Building className="w-4 h-4 text-orange-500" />
              울트라월드(주) 약품탱크 전문 생산
            </h3>
          </div>
        </div>
      </div>

      {/* Official Business Information Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-800 pb-6 text-slate-300">
          <div className="space-y-1.5">
            <p className="text-white font-black text-sm tracking-widest uppercase">ULTRA WORLD Co., Ltd.</p>
          </div>
          <div className="text-slate-500 text-[10px] md:text-right max-w-md">
            본 웹사이트에 기재된 모든 규격과 도면은 울트라월드(주) 생산본부에 귀속되어 있으며, 수압 비중 용도에 따라 세부 두께가 사전 고지 없이 협의 보강될 수 있습니다.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 select-text leading-relaxed">
          <div className="space-y-1.5">
            <p>
              회사명 : <strong className="text-slate-350">울트라월드(주)</strong> | 대표자 : <strong className="text-slate-350">김태리</strong> | 주소 : 경상남도 양산시 생동길 30
            </p>
            <p>
              사업자등록번호 : <strong className="text-slate-300">621-81-51848</strong>
            </p>
            <p>
              전화번호 : <strong className="text-slate-300">055-385-2696</strong> | 팩스 : <strong className="text-slate-300">055-385-2698</strong> | 전자우편 : <strong className="text-slate-300">ultfine@naver.com</strong>
            </p>
          </div>
          <div className="md:text-right flex flex-col justify-end items-start md:items-end gap-1.5">
            <p className="font-semibold text-[10px] text-slate-500">
              Copyright ⓒ <strong className="text-slate-400">ULTRA WORLD Co., Ltd.</strong> All Rights Reserved.
            </p>
            <button 
              onClick={() => {
                if (window.confirm("기존 브라우저 로컬 캐시(로컬스토리지)에 저장되었던 이미지와 커스텀 수정 데이터를 최신 고화질 정밀 사진과 제품 목록으로 전부 원천 초기화(Reset)하여 복구하시겠습니까?\n\n이 작업은 깨진 이미지 엑박 현상을 즉시 정형화 해결하고 화면을 리프레시합니다.")) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="text-[10px] text-slate-500 hover:text-orange-400 underline cursor-pointer transition-colors"
              title="데이터 및 캐시 완전 복원"
            >
              데이터 및 캐시 완전 복원 (Reset Cache)
            </button>
          </div>
        </div>
      </div>

    </footer>
  );
}
