/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Send, FileCheck, Search, HelpCircle, HardHat, ShieldCheck, Download, AlertCircle, RefreshCw, Trash2 } from 'lucide-react';
import { Inquiry } from '../types';

interface ConsultationFormProps {
  initialInquiries: Inquiry[];
  onAddInquiry: (inquiry: Inquiry) => void;
  prefilledProduct?: string;
  isAdmin?: boolean;
  onDeleteInquiry?: (id: string) => void;
  onUpdateInquiryStatus?: (id: string, newStatus: '접수대기' | '검토중' | '답변완료') => void;
}

export default function ConsultationForm({ 
  initialInquiries, 
  onAddInquiry, 
  prefilledProduct = '',
  isAdmin = false,
  onDeleteInquiry,
  onUpdateInquiryStatus
}: ConsultationFormProps) {
  
  // Form values
  const [companyName, setCompanyName] = useState('');
  const [picName, setPicName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [productType, setProductType] = useState(prefilledProduct || '케미칼저장탱크 (UG 일반형)');
  const [capacityNeeded, setCapacityNeeded] = useState('');
  const [content, setContent] = useState('');
  const [chemicalType, setChemicalType] = useState('황산 / 질산 / 산독성 약품');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // File Upload simulation state
  const [dragActive, setDragActive] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  // Inquiry Tracker search state
  const [searchQuery, setSearchQuery] = useState('');

  // Handle Drag Over
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setAttachedFile(e.dataTransfer.files[0]);
    }
  };

  // Handle Manual File Choice
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert('개인정보 수집 및 동의에 체크해 주세요.');
      return;
    }

    if (!companyName || !picName || !phone || !email || !content) {
      alert('모든 필수 기재란을 작성해주시기 바랍니다.');
      return;
    }

    setIsSubmitting(true);

    // Simulate server side delays
    setTimeout(() => {
      const now = new Date();
      const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      const newInquiry: Inquiry = {
        id: `inq-${Math.floor(Math.random() * 900) + 100}`,
        companyName,
        picName,
        phone,
        email,
        productType: `${productType} (${chemicalType} 보관용)`,
        capacityNeeded: capacityNeeded || '상담 후 설계결정',
        content,
        hasDrawings: !!attachedFile,
        drawingFileName: attachedFile ? attachedFile.name : undefined,
        submittedAt: formattedDate,
        status: '접수대기',
      };

      onAddInquiry(newInquiry);
      
      // Reset form variables
      setCompanyName('');
      setPicName('');
      setPhone('');
      setEmail('');
      setCapacityNeeded('');
      setContent('');
      setAttachedFile(null);
      setAgreeTerms(false);
      
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Auto dismiss success page
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1200);
  };

  // Filter inquiry status tracker
  const filteredInquiries = initialInquiries.filter((inq) => {
    const term = searchQuery.toLowerCase();
    return inq.companyName.toLowerCase().includes(term) ||
           inq.picName.toLowerCase().includes(term) ||
           inq.productType.toLowerCase().includes(term);
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="consultation-form-view">
      
      {/* Left Container - Input form */}
      <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        <div className="bg-gradient-to-r from-blue-950 to-slate-900 text-white p-5 md:p-6 border-b border-blue-950">
          <h2 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
            <Send className="w-4.5 h-4.5 text-orange-500 animate-pulse" />
            온라인 대형 견적 및 정밀 도면 설계 요청서
          </h2>
          <p className="text-[11px] text-slate-400 mt-1">
            * 필수 기재란을 정확히 입력해주시면 기술 부장과 상무가 신속하게 통화 후 공식 서신 견적서를 송부해 드립니다.
          </p>
        </div>

        {submitSuccess ? (
          <div className="p-10 text-center space-y-4 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
              <FileCheck className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">도면 설명서 및 문의 접수 완료!</h3>
            <p className="text-slate-600 text-xs leading-relaxed max-w-sm mx-auto">
              고객님의 소중한 약품저장탱크 견적 문의가 생산본부로 성공적으로 접수되었습니다. 
              담당 기술 총과장이 적시 검토 후 기재해주신 번호와 메일로 긴급 회신해 드리겠습니다.
            </p>
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-slate-500 font-mono text-[10px] max-w-xs mx-auto">
              접수 관리번호: UW-{Math.floor(Math.random() * 900000) + 100000}
            </div>
            <button 
              onClick={() => setSubmitSuccess(false)}
              className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-bold p-2.5 rounded-lg cursor-pointer"
            >
              추가 문의하기
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5 text-xs text-slate-700">
            
            {/* Row 1: Company & PIC name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 block text-xs">
                  업체명 / 회사명 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 울트라화학공업(주)"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent px-3 py-2.5 rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 block text-xs">
                  담당자 성함 및 직급 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 이재용 과장"
                  value={picName}
                  onChange={(e) => setPicName(e.target.value)}
                  className="w-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent px-3 py-2.5 rounded-lg"
                />
              </div>
            </div>

            {/* Row 2: Contact & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 block text-xs">
                  휴대폰 및 연락처 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="예: 010-3887-6107"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent px-3 py-2.5 rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 block text-xs">
                  이메일 주소 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="예: buyer@chemical.co.kr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent px-3 py-2.5 rounded-lg"
                />
              </div>
            </div>

            {/* Row 3: Product selector & Storage Fluid selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 block text-xs">
                  문의 대상 제품 카테고리 <span className="text-rose-500">*</span>
                </label>
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent px-3 py-2.5 rounded-lg"
                >
                  <option value="케미칼저장탱크 (UG 일반형)">케미칼저장탱크 (UG 일반형)</option>
                  <option value="완전배출형 (UD 원추형)">완전배출형 (UD 원추형)</option>
                  <option value="교반형 및 모터 부착식 (UN형)">교반형 및 모터 부착식 (UN형)</option>
                  <option value="DECK형 안전난간 스틸밴딩">DECK형 안전난간 스틸밴딩</option>
                  <option value="특수 주문 제작 복합 탱크">특수 주문 제작 복합 탱크</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 block text-xs">
                  탱크 보관 예정 물질 종류 <span className="text-rose-500">*</span>
                </label>
                <select
                  value={chemicalType}
                  onChange={(e) => setChemicalType(e.target.value)}
                  className="w-full border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent px-3 py-2.5 rounded-lg"
                >
                  <option value="황산 / 염산 / 강독성 케미칼">황산 / 염산 / 강독성 케미칼 (특수 두께)</option>
                  <option value="수산화나트륨(NaOH) / 알칼리약액">수산화나트륨(NaOH) / 알칼리약액 (일반 두께)</option>
                  <option value="수처리 폐수 / 슬러지 / 정화액물질">수처리 폐수 / 슬러지 / 정화액물질</option>
                  <option value="농업용 정량 해수 / 염수 보관수조">농업용 정량 해수 / 염수 보관수조</option>
                  <option value="일반 정수 / 지하수 / 보조 저수조">일반 정수 / 지하수 / 보조 저수조</option>
                </select>
              </div>
            </div>

            {/* Row 4: Required capacity sizes */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 block text-xs">
                희망 수량 및 톤수 사양 <span className="text-slate-400">(상세 기입)</span>
              </label>
              <input
                type="text"
                placeholder="예: 5톤 2대 혹은 20톤 1대"
                value={capacityNeeded}
                onChange={(e) => setCapacityNeeded(e.target.value)}
                className="w-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent px-3 py-2.5 rounded-lg"
              />
            </div>

            {/* Content description text area */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 block text-xs">
                문의 내용 (상세 조건 / 배관 플랜지 위치 조율) <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                placeholder="예: 하단 배관 2군데 50A 플랜지 용접 요함, 충진 가능한 가이드 안전 사다리가 꼭 필요합니다."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent px-3 py-2.5 rounded-lg placeholder-slate-400 leading-relaxed text-xs"
              />
            </div>

            {/* Drag & Drop Drawing CAD file attach simulator */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 block text-xs">
                설계 도면, 탱크 요청 사양 파일 첨부 (Simulation)
              </label>
              <div 
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                  dragActive ? 'border-amber-500 bg-amber-50/50' : 'border-slate-200 bg-slate-50'
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <Download className={`w-8 h-8 ${dragActive ? 'text-amber-505 animate-bounce' : 'text-slate-400'}`} />
                  <p className="font-bold text-slate-700 text-2xs md:text-xs">
                    도면 캐드파일(dwg, pdf, jpg)을 이곳에 끌어다 놓거나 클릭하여 선택해주십시오.
                  </p>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    (안전 설계 및 정확한 단가 산정을 위해 배치 도면을 첨부하시면 매우 좋습니다.)
                  </p>
                  
                  <input
                    type="file"
                    id="sim-file-upload"
                    multiple={false}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label 
                    htmlFor="sim-file-upload"
                    className="mt-2.5 px-3 py-1.5 bg-white border border-slate-250 text-slate-700 font-bold hover:bg-slate-50 text-[11px] rounded shadow-2xs hover:shadow cursor-pointer inline-block"
                  >
                    컴퓨터에서 파일 불러오기
                  </label>

                  {attachedFile && (
                    <div className="mt-4 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-150 text-[11px] font-bold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" />
                      선택 파일: {attachedFile.name} ({(attachedFile.size / 1024).toFixed(1)} KB)
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Terms Consent and Submit */}
            <div className="space-y-4 pt-1.5">
              <label className="flex items-start gap-2.5 text-slate-600 leading-normal cursor-pointer text-2xs select-none">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5"
                  id="agree-checkbox"
                />
                <span>
                   울트라월드(주) 약품탱크의 안전 상담 및 견적 송신을 위한 <strong>개인정보 수집 및 자문 이용 동의</strong> (필수)
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-350 text-white font-black py-3 rounded-lg text-sm transition-all text-center flex items-center justify-center gap-2.5 cursor-pointer shadow-md"
                id="consult-submit-btn"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4.5 h-4.5 text-white animate-spin" />
                    B2B 생산본부로 접수 보안 데이터 암호 전송 중...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    온라인 견적 상담 제출하기 (신속 접수)
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>

      {/* Right Container - Active inquiry tracking Board (현황판 조회기) */}
      <div className="lg:col-span-5 space-y-6">
        
        <div className="bg-slate-100/80 rounded-2xl p-5 border border-slate-200">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4.5 h-4.5 text-slate-700" />
            <h3 className="font-extrabold text-slate-900 text-sm">실시간 온라인 견적 접수 현황판</h3>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal mt-1.5">
            울트라월드의 투명한 B2B 소통을 위한 최신 접수 현황판입니다. 보안을 위해 타 이메일 및 휴대폰 번호 끝자리는 안전 보호 처리됩니다.
          </p>
        </div>

        {/* Inquiry query lookup block */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-500 block font-bold">나의 견적 의뢰 간편 검색기</label>
            <div className="relative">
              <input
                type="text"
                placeholder="회사명 검색 (예: 한일화학)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* Scrolling tracker nodes list */}
          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto space-y-2 pt-2">
            
            {filteredInquiries.length > 0 ? (
              filteredInquiries.map((inq) => {
                let badgeColor = 'bg-slate-100 text-slate-600';
                if (inq.status === '접수대기') badgeColor = 'bg-amber-100 text-amber-700';
                if (inq.status === '검토중') badgeColor = 'bg-indigo-150 text-indigo-700';
                if (inq.status === '답변완료') badgeColor = 'bg-emerald-100 text-emerald-800';

                return (
                  <div key={inq.id} className="pt-3 first:pt-0 space-y-2 text-2xs md:text-xs border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-xs">{inq.companyName}</span>
                        {isAdmin ? (
                          <span className="text-blue-650 font-semibold text-[10px] mt-0.5">
                            담당: {inq.picName} ({inq.phone} | {inq.email})
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px] mt-0.5">({inq.picName.charAt(0)}* 대표)</span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 shrink-0">
                        {isAdmin && onUpdateInquiryStatus ? (
                          <select
                            value={inq.status}
                            onChange={(e) => onUpdateInquiryStatus(inq.id, e.target.value as any)}
                            className="text-[9px] font-bold border border-slate-300 rounded px-1.5 py-0.5 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                          >
                            <option value="접수대기">접수대기</option>
                            <option value="검토중">검토중</option>
                            <option value="답변완료">답변완료</option>
                          </select>
                        ) : (
                          <span className={`px-2 py-0.5 rounded font-black text-[10px] ${badgeColor}`}>
                            {inq.status}
                          </span>
                        )}

                        {isAdmin && onDeleteInquiry && (
                          <button
                            onClick={() => onDeleteInquiry(inq.id)}
                            className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded transition-all cursor-pointer"
                            title="삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded border border-slate-150">
                      <p className="text-slate-500 font-mono text-[10px]">
                        분류: <strong className="text-slate-800">{inq.productType}</strong>
                      </p>
                      {inq.chemicalType && (
                        <p className="text-slate-500 font-mono text-[10px] mt-0.5">
                          약품: <strong className="text-slate-800">{inq.chemicalType}</strong>
                        </p>
                      )}
                      <p className="text-slate-500 font-mono text-[10px] mt-0.5">
                        희망: <strong className="text-slate-800">{inq.capacityNeeded}</strong>
                      </p>
                      <p className="text-slate-600 text-wrap leading-relaxed mt-1 text-[11px] bg-white p-1.5 rounded border border-slate-100 italic">
                        &ldquo;{inq.content}&rdquo;
                      </p>
                      {inq.hasDrawings && (
                        <div className="mt-2 text-[10px] text-amber-800 font-bold flex items-center gap-1">
                          📂 도면첨부완료 ({inq.drawingFileName || 'spec_sheet.dwg'})
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>접수번호: UW-{inq.id}</span>
                      <span>등록일: {inq.submittedAt}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-slate-400 py-6 text-2xs">
                해당 상담 문의자 또는 소속 회사가 없습니다.
              </p>
            )}

          </div>

        </div>

        {/* Security / Quality Statement */}
        <div className="bg-slate-950 text-white rounded-2xl p-5 border border-slate-850 space-y-3 shadow-md">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4.5 h-4.5 text-amber-400" />
            <h4 className="font-extrabold text-xs text-white">B2B 보안 전송 보도</h4>
          </div>
          <p className="text-[10px] text-slate-400 leading-normal leading-relaxed">
            울트라월드(주)는 <strong>SSL 공장 보안 1등급</strong> 지표를 준수하여 발주서와 배치 평면도를 외부의 임의 기밀 유출로부터 암호화 보존해오고 있습니다. 안심하고 도안을 등록하시기 바랍니다.
          </p>
        </div>

      </div>

    </div>
  );
}
